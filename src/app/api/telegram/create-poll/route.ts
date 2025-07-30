import { NextResponse } from "next/server";
import {
  TelegramAPI,
  type TelegramResponse,
  SKILL_LEVEL_BUTTONS,
  WEEKLY_SCHEDULE_TEMPLATE,
  GAME_MESSAGE_TEMPLATE,
  MessageUtils,
} from "@/app/lib/telegram";

export const runtime = "edge";

// Sample weekly schedule data - in real use, this could come from a database or external API
const WEEKLY_GAMES = [
  {
    day: "Вторник",
    date: "29.07",
    time: "8:00-09:30",
    club: "SANDDUNE PADEL CLUB Al Qouz",
    price: "65 aed/чел (комплимент от клуба - бельгийская вафля и кофе)🫶🏻",
    courts: 2,
    note: "Забронировано 2 корта!",
  },
  {
    day: "Четверг",
    date: "31.07",
    time: "08:00-09:30",
    club: "Oxygen Padel Sport Academy",
    price: "70 aed/чел",
    courts: 1,
    cancelled: true,
  },
  {
    day: "Суббота",
    date: "02.08",
    time: "11:00-12:30",
    club: "Oxygen Padel Sport Academy",
    price: "90 aed/чел",
    courts: 1,
  },
];

export async function GET() {
  try {
    const timeString = MessageUtils.getCurrentDubaiTime();
    const weekRange = MessageUtils.getCurrentWeekDateRange();

    // Send main weekly schedule message
    const mainMessage = `${WEEKLY_SCHEDULE_TEMPLATE}

📅 Неделя: ${weekRange}`;

    const mainResult = await TelegramAPI.sendMessage({
      chat_id: process.env.CHAT_ID!,
      text: mainMessage,
      parse_mode: "HTML",
      disable_web_page_preview: true,
    });

    if (!mainResult.ok) {
      console.error("Failed to send main message:", mainResult);
      return NextResponse.json(
        { error: "Failed to send main message" },
        { status: 500 }
      );
    }

    // Send individual game messages
    const gameResults: TelegramResponse[] = [];

    for (const game of WEEKLY_GAMES) {
      const gameMessage = GAME_MESSAGE_TEMPLATE(game);

      const gameResult = await TelegramAPI.sendMessage({
        chat_id: process.env.CHAT_ID!,
        text: gameMessage,
        parse_mode: "HTML",
        disable_web_page_preview: true,
        reply_markup: game.cancelled
          ? undefined
          : {
              inline_keyboard: SKILL_LEVEL_BUTTONS,
            },
      });

      gameResults.push(gameResult);

      if (!gameResult.ok) {
        console.error(
          `Failed to send game message for ${game.day}:`,
          gameResult
        );
      }

      // Small delay between messages to avoid rate limiting
      await new Promise((resolve) => setTimeout(resolve, 200));
    }

    console.log(`Padel schedule sent at ${timeString} for week ${weekRange}`);
    return NextResponse.json({
      success: true,
      main_message_id: mainResult.result?.message_id,
      game_messages: gameResults
        .map((r) => r.result?.message_id)
        .filter(Boolean),
      time: timeString,
      week_range: weekRange,
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
