export const runtime = "edge";

import { NextRequest, NextResponse } from "next/server";
import { bot, ensureBotInit } from "@/app/lib/telegram/bot";

// receive from url parameters as fallback
export async function POST(req: NextRequest) {
  const update = await req.json();
  const timestamp = new Date().toISOString();

  // Log every webhook message with full data for exploration
  console.log(
    `=== TELEGRAM WEBHOOK UPDATE [${timestamp}] ===`,
    JSON.stringify(update, null, 2)
  );

  const secretToken = req.headers.get("X-Telegram-Bot-Api-Secret-Token");
  console.log("secretToken (from header)", secretToken);

  if (secretToken !== process.env.TELEGRAM_WEBHOOK_SECRET) {
    const url = new URL(req.url);
    const secretTokenFromUrl = url.searchParams.get("secret_token");

    console.log("secretToken (from url)", secretTokenFromUrl);

    if (secretTokenFromUrl !== process.env.TELEGRAM_WEBHOOK_SECRET) {
      return NextResponse.json(
        { ok: false, error: "Not allowed" },
        { status: 405 }
      );
    }
  }

  // Initialize bot once per cold start before handling updates
  await ensureBotInit();
  await bot.handleUpdate(update);

  return NextResponse.json({ ok: true });
}
