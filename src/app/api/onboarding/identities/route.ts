import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

// API route for onboarding identities creation - Updated
export async function POST(request: NextRequest) {
  try {
    console.log('API identities POST appelé');
    const { identities } = await request.json();

    // Create a default user if not exists
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

    // Delete existing identities for this user
    await db.identity.deleteMany({
      where: { userId: user.id },
    });

    // Create new identities with their attributes
    const createdIdentities = await Promise.all(
      identities.map(async (identity: any) => {
        // Create the identity
        const newIdentity = await db.identity.create({
          data: {
            userId: user.id,
            name: identity.name,
            category: identity.category,
            currentLevel: 1,
            totalXP: 0,
          },
        });

        // Create attributes for this identity
        await Promise.all(
          identity.attributes.map(async (attrName: string) => {
            // Create or find the attribute
            let attribute = await db.attribute.findFirst({
              where: { name: attrName },
            });

            if (!attribute) {
              attribute = await db.attribute.create({
                data: {
                  name: attrName,
                  category: identity.category,
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

        return newIdentity;
      })
    );

    return NextResponse.json({ 
      success: true, 
      identities: createdIdentities,
      user 
    });
  } catch (error) {
    console.error('Error creating identities:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to create identities' },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    const user = await db.user.findFirst();
    
    if (!user) {
      return NextResponse.json({ identities: [] });
    }

    const identities = await db.identity.findMany({
      where: { userId: user.id },
      include: {
        attributeProgress: {
          include: {
            attribute: true,
          },
        },
      },
    });

    return NextResponse.json({ identities });
  } catch (error) {
    console.error('Error fetching identities:', error);
    return NextResponse.json(
      { error: 'Failed to fetch identities' },
      { status: 500 }
    );
  }
}
