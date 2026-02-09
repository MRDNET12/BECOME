import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function GET() {
  try {
    const quests = await db.quest.findMany({
      orderBy: { createdAt: "desc" },
      include: {
        identity: true,
        reflection: true,
      },
    });
    return NextResponse.json(quests);
  } catch (error) {
    console.error("Error fetching quests:", error);
    return NextResponse.json(
      { error: "Failed to fetch quests" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { title, description, identityId, userId = "default-user", xpReward = 50 } = body;

    if (!title || !identityId) {
      return NextResponse.json(
        { error: "Title and identityId are required" },
        { status: 400 }
      );
    }

    const quest = await db.quest.create({
      data: {
        title,
        description,
        identityId,
        userId,
        xpReward,
      },
    });

    return NextResponse.json(quest, { status: 201 });
  } catch (error) {
    console.error("Error creating quest:", error);
    return NextResponse.json(
      { error: "Failed to create quest" },
      { status: 500 }
    );
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const body = await request.json();
    const { questId, status, reflection } = body;

    if (!questId) {
      return NextResponse.json(
        { error: "Quest ID is required" },
        { status: 400 }
      );
    }

    const quest = await db.quest.update({
      where: { id: questId },
      data: {
        status,
        completedAt: status === "completed" || status === "forged" ? new Date() : null,
      },
    });

    // If there's a reflection, create or update it
    if (reflection) {
      const { resistance, lesson } = reflection;
      await db.reflection.upsert({
        where: { questId },
        update: { resistance, lesson },
        create: {
          questId,
          userId: quest.userId,
          resistance,
          lesson,
          xpReward: 20, // Wisdom XP
        },
      });
    }

    return NextResponse.json(quest);
  } catch (error) {
    console.error("Error updating quest:", error);
    return NextResponse.json(
      { error: "Failed to update quest" },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const questId = searchParams.get("questId");

    if (!questId) {
      return NextResponse.json(
        { error: "Quest ID is required" },
        { status: 400 }
      );
    }

    await db.quest.delete({
      where: { id: questId },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error deleting quest:", error);
    return NextResponse.json(
      { error: "Failed to delete quest" },
      { status: 500 }
    );
  }
}
