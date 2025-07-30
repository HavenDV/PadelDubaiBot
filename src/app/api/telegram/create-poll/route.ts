import { NextResponse } from "next/server";
import {
  TelegramAPI,
  type TelegramResponse,
  TIME_BUTTONS,
  VOTING_MESSAGE_TEMPLATE,
  MessageUtils,
} from "@/app/lib/telegram";

export const runtime = "edge";

export async function GET() {
  try {
    const timeString = MessageUtils.getCurrentMoscowTime();

    const result = await TelegramAPI.sendMessage({
      chat_id: process.env.CHAT_ID!,
      text: VOTING_MESSAGE_TEMPLATE,
      parse_mode: "HTML",
      disable_web_page_preview: true,
      reply_markup: {
        inline_keyboard: TIME_BUTTONS,
      },
    });

    // NEW CODE: Pin the sent message to the chat if successful
    let pinResult: TelegramResponse | null = null;
    if (result.ok && result.result?.message_id) {
      pinResult = await TelegramAPI.pinChatMessage({
        chat_id: process.env.CHAT_ID!,
        message_id: result.result.message_id,
        disable_notification: true,
      });

      if (!pinResult.ok) {
        console.error("Failed to pin message:", pinResult);
      }
    }

    if (!result.ok) {
      console.error("Telegram API error:", result);
      return NextResponse.json(
        { error: "Failed to send message" },
        { status: 500 }
      );
    }

    console.log(`Voting message sent at ${timeString}`);
    return NextResponse.json({
      success: true,
      message_id: result.result?.message_id,
      time: timeString,
      pinned: pinResult?.ok ?? false,
    });
  } catch (error) {
    console.error("Error in cron job:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

// Prevent other HTTP methods
export async function POST() {
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
