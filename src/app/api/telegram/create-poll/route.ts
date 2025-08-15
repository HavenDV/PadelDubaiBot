import { NextResponse } from "next/server";
import {
  TelegramAPI,
  type TelegramResponse,
  SKILL_LEVEL_BUTTONS,
  GameDataManager,
  MessageFormatter,
} from "@/app/lib/telegram";

export const runtime = "edge";

interface GameInfo {
  day: string;
  date: string;
  time: string;
  club: string;
  price: string;
  courts: number;
  note?: string;
  cancelled?: boolean;
}

// Generate dates for the upcoming week
function getUpcomingWeekDates() {
  const now = new Date();
  const currentDay = now.getDay(); // 0 = Sunday, 1 = Monday, etc.

  // Calculate days until next Monday (if today is Monday, get next Monday)
  const daysUntilNextMonday = currentDay === 1 ? 7 : (8 - currentDay) % 7;

  const nextMonday = new Date(now);
  nextMonday.setDate(now.getDate() + daysUntilNextMonday);

  const formatDate = (date: Date) => {
    return date
      .toLocaleDateString("ru-RU", {
        day: "2-digit",
        month: "2-digit",
        timeZone: "Asia/Dubai",
      })
      .replace(/\./g, ".");
  };

  // Tuesday = Monday + 1, Thursday = Monday + 3, Saturday = Monday + 5
  const tuesday = new Date(nextMonday);
  tuesday.setDate(nextMonday.getDate() + 1);

  const thursday = new Date(nextMonday);
  thursday.setDate(nextMonday.getDate() + 3);

  const saturday = new Date(nextMonday);
  saturday.setDate(nextMonday.getDate() + 5);

  return {
    tuesday: formatDate(tuesday),
    thursday: formatDate(thursday),
    saturday: formatDate(saturday),
  };
}

// Generate weekly schedule data dynamically
function getWeeklyGames(): GameInfo[] {
  const dates = getUpcomingWeekDates();

  return [
    {
      day: "Вторник",
      date: dates.tuesday,
      time: "8:00-09:30",
      club: "SANDDUNE PADEL CLUB Al Qouz",
      price: "65 aed/чел (комплимент от клуба - бельгийская вафля и кофе)🫶🏻",
      courts: 2,
    },
    {
      day: "Четверг",
      date: dates.thursday,
      time: "08:30-10:00",
      club: "Oxygen Padel Sport Academy",
      price: "55 aed/чел",
      courts: 1,
    },
    {
      day: "Суббота",
      date: dates.saturday,
      time: "11:00-12:30",
      club: "Oxygen Padel Sport Academy",
      price: "90 aed/чел",
      courts: 1,
    },
  ];
}

export async function GET() {
  try {
    const timeString = MessageFormatter.getCurrentDubaiTime();
    const weekRange = MessageFormatter.getCurrentWeekDateRange();

    // Send main weekly schedule message
    const mainMessage = MessageFormatter.formatWeeklyScheduleMessage(weekRange);

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
    const weeklyGames = getWeeklyGames();
    const chatId = parseInt(process.env.CHAT_ID!);

    for (const game of weeklyGames) {
      // Create GameInfo object using data-first approach
      const gameInfo = GameDataManager.createGameInfo({
        day: game.day,
        date: game.date,
        time: game.time,
        club: game.club,
        price: game.price,
        courts: game.courts,
        note: game.note,
        chatId: chatId,
      });

      // Format the message from the data
      const gameMessage = MessageFormatter.formatGameMessage(gameInfo);

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
      } else if (gameResult.result?.message_id && !game.cancelled) {
        // Update the gameInfo with the actual message ID
        gameInfo.messageId = gameResult.result.message_id;

        // Admin controls are now handled through the Telegram Mini App
        // No need to send private admin control messages
      }

      // Small delay between messages to avoid rate limiting
      await new Promise((resolve) => setTimeout(resolve, 500));
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
