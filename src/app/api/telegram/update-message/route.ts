import { NextResponse } from "next/server";
import { updateTelegramMessageFromDatabase } from "@/app/lib/telegram/booking";

export const runtime = "edge";

interface UpdateMessageRequest {
  chatId: number;
  messageId: number;
}

export async function POST(request: Request) {
  try {
    const { chatId, messageId }: UpdateMessageRequest = await request.json();

    if (!chatId || !messageId) {
      return NextResponse.json(
        { error: "Chat ID and message ID are required" },
        { status: 400 }
      );
    }

    const result = await updateTelegramMessageFromDatabase(chatId, messageId);

    if (!result.success) {
      return NextResponse.json(
        { error: result.error || "Failed to update message" },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "Telegram message updated successfully",
    });
  } catch (error) {
    console.error("Error updating telegram message:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

// Prevent other HTTP methods
export async function GET() {
  return NextResponse.json({ error: "Method not allowed" }, { status: 405 });
}

export async function PUT() {
  return NextResponse.json({ error: "Method not allowed" }, { status: 405 });
}

export async function DELETE() {
  return NextResponse.json({ error: "Method not allowed" }, { status: 405 });
}

export async function PATCH() {
  return NextResponse.json({ error: "Method not allowed" }, { status: 405 });
}
