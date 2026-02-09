import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

// API route for onboarding quests creation
export async function POST(request: NextRequest) {
  try {
    const { tasks } = await request.json();

    // Get or create user
    let user = await db.user.findFirst();
    
    if (!user) {
      user = await db.user.create({
        data: {
          email: `player-${Date.now()}@become.app`,
          name: 'Player',
          level: 1,
          totalXP: 0,
          streak: 0,
        },
      });
    }

    // Delete existing quests for today
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    await db.quest.deleteMany({
      where: {
        userId: user.id,
        date: {
          gte: today,
        },
      },
    });

    // Create new quests
    const createdQuests = await Promise.all(
      tasks.map(async (task: any) => {
        // Find the identity by name
        const identity = await db.identity.findFirst({
          where: {
            userId: user.id,
            name: task.identityName,
          },
        });

        return await db.quest.create({
          data: {
            userId: user.id,
            identityId: identity?.id,
            title: task.description,
            description: task.description,
            date: new Date(),
            scheduledTime: task.time,
            xpReward: task.xp || 50,
            difficulty: 'medium',
            completed: false,
          },
        });
      })
    );

    return NextResponse.json({ 
      success: true, 
      quests: createdQuests 
    });
  } catch (error) {
    console.error('Error creating quests:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to create quests' },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    const user = await db.user.findFirst();
    
    if (!user) {
      return NextResponse.json({ quests: [] });
    }

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const quests = await db.quest.findMany({
      where: {
        userId: user.id,
        date: {
          gte: today,
        },
      },
      include: {
        identity: true,
      },
      orderBy: {
        scheduledTime: 'asc',
      },
    });

    return NextResponse.json({ quests });
  } catch (error) {
    console.error('Error fetching quests:', error);
    return NextResponse.json(
      { error: 'Failed to fetch quests' },
      { status: 500 }
    );
  }
}
