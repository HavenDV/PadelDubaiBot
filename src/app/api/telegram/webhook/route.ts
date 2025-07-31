// app/api/telegram/webhook/route.ts
// Edge runtime = zero cold-start for small handlers
export const runtime = "edge";

import { NextRequest, NextResponse } from "next/server";
import {
  TelegramAPI,
  SKILL_LEVEL_BUTTONS,
  AdminUtils,
  CALLBACK_MESSAGES,
  WELCOME_MESSAGE_TEMPLATE,
  MessageUtils,
} from "@/app/lib/telegram";
import { OpenAIUtils } from "@/app/lib/openai";

export async function POST(req: NextRequest) {
  const update = await req.json();
  const callbackQuery = update.callback_query;

  // Handle admin-only callbacks
  if (callbackQuery && callbackQuery.data?.startsWith("admin_")) {
    const chatId = callbackQuery.message.chat.id;
    const messageId = callbackQuery.message.message_id;
    const adminAction = callbackQuery.data.replace("admin_", "");
    const user = callbackQuery.from;

    // Check if user is admin
    if (!AdminUtils.isAdmin(user.id)) {
      try {
        await TelegramAPI.answerCallbackQuery({
          callback_query_id: callbackQuery.id,
          text: CALLBACK_MESSAGES.ADMIN_UNAUTHORIZED,
          show_alert: true,
        });
        return NextResponse.json({ ok: true });
      } catch (error) {
        console.error("Error sending admin unauthorized message:", error);
        return NextResponse.json({ ok: true });
      }
    }

    // Handle admin actions
    const currentText = callbackQuery.message.text;
    let updatedMessage = currentText;
    let responseText = "";

    try {
      switch (adminAction) {
        case "cancel_game":
          updatedMessage = MessageUtils.cancelGame(currentText);
          responseText = CALLBACK_MESSAGES.ADMIN_GAME_CANCELLED;
          break;

        case "restore_game":
          updatedMessage = MessageUtils.restoreGame(currentText);
          responseText = CALLBACK_MESSAGES.ADMIN_GAME_RESTORED;
          break;

        case "game_stats":
          const stats = MessageUtils.getGameStats(currentText);
          responseText = CALLBACK_MESSAGES.ADMIN_GAME_STATS(
            stats.registeredCount,
            stats.waitlistCount
          );
          // For stats, we don't update the message, just show the stats
          await TelegramAPI.answerCallbackQuery({
            callback_query_id: callbackQuery.id,
            text: responseText,
            show_alert: true,
          });
          return NextResponse.json({ ok: true });

        default:
          responseText = "❌ Неизвестная административная команда.";
      }

      // Update message and send response
      const promises = [
        TelegramAPI.answerCallbackQuery({
          callback_query_id: callbackQuery.id,
          text: responseText,
        }),
        TelegramAPI.editMessageText({
          chat_id: chatId,
          message_id: messageId,
          text: updatedMessage,
          parse_mode: "HTML",
          disable_web_page_preview: true,
          reply_markup: {
            inline_keyboard: AdminUtils.getButtonsForUser(user.id),
          },
        }),
      ];

      await Promise.all(promises);
      return NextResponse.json({ ok: true });
    } catch (error) {
      console.error("Error handling admin callback:", error);
      return NextResponse.json({ ok: true });
    }
  }

  // Handle button callbacks for skill level selection
  if (callbackQuery && callbackQuery.data?.startsWith("skill_")) {
    const chatId = callbackQuery.message.chat.id;
    const messageId = callbackQuery.message.message_id;
    const selectedLevel = callbackQuery.data.replace("skill_", "");
    const user = callbackQuery.from;
    const displayName = user.username
      ? `<a href="https://t.me/${user.username}">@${user.username}</a>`
      : user.first_name || "Unknown";

    // Check for late cancellation penalty
    const currentText = callbackQuery.message.text;

    // Check if this is a cancellation and if it's within 24 hours
    const isCancellation =
      selectedLevel === "not_coming" ||
      MessageUtils.getRegisteredUsers(currentText).some(
        (user) =>
          MessageUtils.normalizeName(user.userName) ===
            MessageUtils.normalizeName(displayName) &&
          user.skillLevel === selectedLevel
      );

    if (isCancellation) {
      const lateCancellationCheck =
        MessageUtils.isLateCancellation(currentText);

      if (
        lateCancellationCheck.isLate &&
        lateCancellationCheck.hoursRemaining !== null
      ) {
        // Send penalty warning instead of processing cancellation
        try {
          await TelegramAPI.answerCallbackQuery({
            callback_query_id: callbackQuery.id,
            text: CALLBACK_MESSAGES.LATE_CANCELLATION_WARNING(
              lateCancellationCheck.hoursRemaining
            ),
            show_alert: true, // Show as popup alert
          });
          return NextResponse.json({ ok: true });
        } catch (error) {
          console.error("Error sending penalty warning:", error);
          return NextResponse.json({ ok: true });
        }
      }
    }

    // Prepare updated message text
    const result = MessageUtils.updateMessageWithUserSelection(
      currentText,
      displayName,
      selectedLevel
    );

    // Run answerCallbackQuery and editMessageText concurrently
    const promises = [
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
        text: result.updatedMessage,
        parse_mode: "HTML",
        disable_web_page_preview: true,
        reply_markup: {
          inline_keyboard: AdminUtils.getButtonsForUser(user.id),
        },
      }),
    ];

    // If there's a notification, send it as a separate message
    if (result.notification) {
      promises.push(
        TelegramAPI.sendMessage({
          chat_id: chatId,
          text: result.notification,
          parse_mode: "HTML",
          disable_web_page_preview: true,
        })
      );
    }

    try {
      await Promise.all(promises);
      return NextResponse.json({ ok: true });
    } catch (error) {
      console.error("Error handling callback query:", error);
      // Still return success to Telegram to avoid retries
      return NextResponse.json({ ok: true });
    }
  }

  // Handle new chat members
  if (update.message?.new_chat_members?.length > 0) {
    try {
      const chatId = update.message.chat.id;
      const newMembers = update.message.new_chat_members;

      // Send welcome message to each new member
      for (const newMember of newMembers) {
        // Skip if the new member is a bot
        if (newMember.is_bot) {
          continue;
        }

        const firstName = newMember.first_name || "друг";
        const welcomeMessage = WELCOME_MESSAGE_TEMPLATE(firstName);

        await TelegramAPI.sendMessage({
          chat_id: chatId,
          text: welcomeMessage,
          parse_mode: "HTML",
          disable_web_page_preview: true,
        });
      }

      return NextResponse.json({ ok: true });
    } catch (error) {
      console.error("Error sending welcome message:", error);
      // Still return success to Telegram to avoid retries
      return NextResponse.json({ ok: true });
    }
  }

  // Handle regular messages mentioning the bot
  const msg = update.message;
  const isDirectMention = msg?.text?.includes("@padel_dubai_bot");
  const isReplyToBot =
    msg?.reply_to_message?.from?.username === "padel_dubai_bot" ||
    msg?.reply_to_message?.via_bot?.username === "padel_dubai_bot";

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
