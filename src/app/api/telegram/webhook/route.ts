// app/api/telegram/webhook/route.ts
// Edge runtime = zero cold-start for small handlers
export const runtime = "edge";

import { NextRequest, NextResponse } from "next/server";
import {
  TelegramAPI,
  SKILL_LEVEL_BUTTONS,
  CALLBACK_MESSAGES,
  MessageUtils,
} from "@/app/lib/telegram";
import { OpenAIUtils } from "@/app/lib/openai";

export async function POST(req: NextRequest) {
  const update = await req.json();
  const callbackQuery = update.callback_query;

  // Handle button callbacks for skill level selection
  if (callbackQuery && callbackQuery.data?.startsWith("skill_")) {
    const chatId = callbackQuery.message.chat.id;
    const messageId = callbackQuery.message.message_id;
    const selectedLevel = callbackQuery.data.replace("skill_", "");
    const user = callbackQuery.from;
    const displayName = user.username
      ? `<a href="https://t.me/${user.username}">@${user.username}</a>`
      : user.first_name || "Unknown";

    // Prepare updated message text
    const currentText = callbackQuery.message.text;
    const updatedText = MessageUtils.updateMessageWithUserSelection(
      currentText,
      displayName,
      selectedLevel
    );

    // Run answerCallbackQuery and editMessageText concurrently
    await Promise.all([
      TelegramAPI.answerCallbackQuery({
        callback_query_id: callbackQuery.id,
        text:
          selectedLevel === "not_coming"
            ? CALLBACK_MESSAGES.NOT_COMING
            : CALLBACK_MESSAGES.REGISTERED(selectedLevel),
      }),
      TelegramAPI.editMessageText({
        chat_id: chatId,
        message_id: messageId,
        text: updatedText,
        parse_mode: "HTML",
        disable_web_page_preview: true,
        reply_markup: {
          inline_keyboard: SKILL_LEVEL_BUTTONS,
        },
      }),
    ]);

    return NextResponse.json({ ok: true });
  }

  // Handle regular messages mentioning the bot
  const msg = update.message;
  const isDirectMention = msg?.text?.includes("@padeldubaibot");
  const isReplyToBot =
    msg?.reply_to_message?.from?.username === "padeldubaibot" ||
    msg?.reply_to_message?.via_bot?.username === "padeldubaibot";

  // Do not reply to a pinned message
  if (msg?.pinned_message) {
    return NextResponse.json({ ok: true });
  }

  if (msg && (isDirectMention || isReplyToBot)) {
    try {
      const promptText =
        isReplyToBot && msg.reply_to_message?.text
          ? `Предыдущее сообщение: ${msg.reply_to_message.text}\nОтвет игрока: ${msg.text}`
          : msg.text ?? "";

      const joke = await OpenAIUtils.generateJoke(promptText);

      await TelegramAPI.sendMessage({
        chat_id: msg.chat.id,
        text: joke,
        reply_to_message_id: msg.message_id,
        disable_web_page_preview: true,
      });
    } catch (err) {
      console.error("OpenAI joke generation failed", err);
    }

    return NextResponse.json({ ok: true });
  }

  // Always ACK Telegram
  return NextResponse.json({ ok: true });
}
