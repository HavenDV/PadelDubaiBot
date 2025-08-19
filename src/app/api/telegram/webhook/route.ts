export const runtime = "edge";

import { NextRequest, NextResponse } from "next/server";
import { bot, ensureBotInit } from "@/app/lib/telegram/bot";

// receive from url parameters as fallback
export async function POST(req: NextRequest) {
  const secretToken = req.headers.get("X-Telegram-Bot-Api-Secret-Token");
  const url = new URL(req.url);
  const secretTokenFromUrl = url.searchParams.get("secret_token");

  if (
    secretToken !== process.env.TELEGRAM_WEBHOOK_SECRET &&
    secretTokenFromUrl !== process.env.TELEGRAM_WEBHOOK_SECRET
  ) {
    return NextResponse.json(
      { ok: false, error: "Not allowed" },
      { status: 405 }
    );
  }

  const update = await req.json();
  const timestamp = new Date().toISOString();
  const updateId = update.update_id;

  // Log every webhook message with full data for exploration
  console.log(`=== TELEGRAM WEBHOOK UPDATE [${timestamp}] ===`);
  console.log(`Update ID: ${updateId}`);
  console.log("Full update object:", JSON.stringify(update, null, 2));
  console.log(
    "Update type:",
    Object.keys(update).filter((key) => key !== "update_id")
  );

  // Log specific message types
  if (update.message) {
    console.log("MESSAGE received:");
    console.log("- Chat ID:", update.message.chat.id);
    console.log("- Message ID:", update.message.message_id);
    console.log("- From:", update.message.from);
    console.log("- Text:", update.message.text);
    console.log("- Date:", new Date(update.message.date * 1000).toISOString());
  }

  if (update.callback_query) {
    console.log("CALLBACK_QUERY received:");
    console.log("- Callback ID:", update.callback_query.id);
    console.log("- Data:", update.callback_query.data);
    console.log("- From:", update.callback_query.from);
    console.log("- Message Chat ID:", update.callback_query.message?.chat?.id);
    console.log("- Message ID:", update.callback_query.message?.message_id);
  }

  if (update.edited_message) {
    console.log("EDITED_MESSAGE received:");
    console.log("- Chat ID:", update.edited_message.chat.id);
    console.log("- Message ID:", update.edited_message.message_id);
    console.log(
      "- Edit date:",
      new Date(update.edited_message.edit_date * 1000).toISOString()
    );
  }

  if (update.channel_post) {
    console.log("CHANNEL_POST received:", update.channel_post);
  }

  if (update.inline_query) {
    console.log("INLINE_QUERY received:", update.inline_query);
  }

  if (update.chosen_inline_result) {
    console.log("CHOSEN_INLINE_RESULT received:", update.chosen_inline_result);
  }

  if (update.my_chat_member) {
    console.log("MY_CHAT_MEMBER received:", update.my_chat_member);
  }

  if (update.chat_member) {
    console.log("CHAT_MEMBER received:", update.chat_member);
  }

  if (update.chat_join_request) {
    console.log("CHAT_JOIN_REQUEST received:", update.chat_join_request);
  }

  if (update.poll) {
    console.log("POLL received:", update.poll);
  }

  if (update.poll_answer) {
    console.log("POLL_ANSWER received:", update.poll_answer);
  }

  console.log(`=== END WEBHOOK UPDATE ${updateId} ===\n`);

  // Initialize bot once per cold start before handling updates
  await ensureBotInit();
  await bot.handleUpdate(update);

  return NextResponse.json({ ok: true });
}
