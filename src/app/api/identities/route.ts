import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function POST(request: NextRequest) {
  try {
    const { name, category, attributes } = await request.json();

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

    // Create the identity
    const newIdentity = await db.identity.create({
      data: {
        userId: user.id,
        name,
        category,
        currentLevel: 1,
        totalXP: 0,
      },
    });

    // Create attributes for this identity
    await Promise.all(
      attributes.map(async (attrName: string) => {
        // Create or find the attribute
        let attribute = await db.attribute.findFirst({
          where: { name: attrName },
        });

        if (!attribute) {
          attribute = await db.attribute.create({
            data: {
              name: attrName,
              category,
            },
          });
        }

        // Create user's progress for this attribute
        await db.userAttributeProgress.upsert({
          where: {
            userId_attributeId: {
              userId: user.id,
              attributeId: attribute.id,
            },
          },
          create: {
            userId: user.id,
            attributeId: attribute.id,
            value: 10, // Starting value
            identityId: newIdentity.id,
          },
          update: {},
        });
      })
    );

    // Fetch the created identity with its attributes
    const identityWithAttributes = await db.identity.findUnique({
      where: { id: newIdentity.id },
      include: {
        attributeProgress: {
          include: {
            attribute: true,
          },
        },
      },
    });

    return NextResponse.json({ 
      success: true, 
      identity: identityWithAttributes 
    });
  } catch (error) {
    console.error('Error creating identity:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to create identity' },
      { status: 500 }
    );
  }
}
