// app/api/telegram/webhook/route.ts
// Edge runtime = zero cold-start for small handlers
export const runtime = "edge";

import { NextRequest, NextResponse } from "next/server";
import {
  TelegramAPI,
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

    // Handle admin actions from private messages
    const currentText = callbackQuery.message.text;
    let responseText = "";

    try {
      // Extract reference to the public game message
      const gameReference = MessageUtils.extractGameReference(currentText);

      if (!gameReference) {
        await TelegramAPI.answerCallbackQuery({
          callback_query_id: callbackQuery.id,
          text: "❌ Не удалось найти ссылку на игру.",
          show_alert: true,
        });
        return NextResponse.json({ ok: true });
      }

      // Get the current public game message first
      // Note: We can't directly get message content via API, so we need to handle based on action

      switch (adminAction) {
        case "cancel_game":
          responseText = CALLBACK_MESSAGES.ADMIN_GAME_CANCELLED;

          try {
            // Get the current game message to cancel it properly
            // Since we can't fetch message content directly, we'll try to edit it optimistically
            // The MessageUtils.cancelGame will handle the formatting

            // Edit the message to show cancellation and remove buttons
            // Since we can't fetch the original content, we'll try to preserve what we can
            // and mark it as cancelled
            const cancelledMessageText = `❗️<b>ОТМЕНА</b>❗️

🚫 <b>Игра отменена администратором</b>

❌ Регистрация на эту игру закрыта
❌ Кнопки для записи отключены

<i>Если у вас есть вопросы по отмене, обратитесь к администратору.</i>`;

            await TelegramAPI.editMessageText({
              chat_id: gameReference.chatId,
              message_id: gameReference.messageId,
              text: cancelledMessageText,
              parse_mode: "HTML",
              disable_web_page_preview: true,
              // Remove all buttons by not including reply_markup
            });

            // Also send a notification message
            await TelegramAPI.sendMessage({
              chat_id: gameReference.chatId,
              text: "🚫 <b>Игра отменена администратором</b>",
              parse_mode: "HTML",
              reply_to_message_id: gameReference.messageId,
            });
          } catch (editError) {
            console.error("Error editing cancelled game message:", editError);
            // Fallback: just send the notification message
            await TelegramAPI.sendMessage({
              chat_id: gameReference.chatId,
              text: "🚫 <b>Игра отменена администратором</b>",
              parse_mode: "HTML",
              reply_to_message_id: gameReference.messageId,
            });
          }
          break;

        case "restore_game":
          responseText = CALLBACK_MESSAGES.ADMIN_GAME_RESTORED;

          try {
            // Restore the game by adding buttons back and removing cancellation
            // Since we can't fetch the original content, show a restoration message
            const restoredMessageText = `✅ <b>Игра восстановлена администратором</b>

🎾 Регистрация на игру снова открыта
🎾 Кнопки для записи активированы

<i>Выберите ваш уровень игры для участия.</i>

<b>Записавшиеся игроки:</b>
1. -
2. -
3. -
4. -

⏳ <b>Waitlist:</b>
---`;

            await TelegramAPI.editMessageText({
              chat_id: gameReference.chatId,
              message_id: gameReference.messageId,
              text: restoredMessageText,
              parse_mode: "HTML",
              disable_web_page_preview: true,
              reply_markup: {
                inline_keyboard: AdminUtils.getButtonsForUser(0), // Get skill level buttons
              },
            });

            // Also send a notification message
            await TelegramAPI.sendMessage({
              chat_id: gameReference.chatId,
              text: "✅ <b>Игра восстановлена администратором</b>",
              parse_mode: "HTML",
              reply_to_message_id: gameReference.messageId,
            });
          } catch (editError) {
            console.error("Error editing restored game message:", editError);
            // Fallback: just send the notification message
            await TelegramAPI.sendMessage({
              chat_id: gameReference.chatId,
              text: "✅ <b>Игра восстановлена администратором</b>",
              parse_mode: "HTML",
              reply_to_message_id: gameReference.messageId,
            });
          }
          break;

        case "game_stats":
          // For stats, we need to re-fetch current data
          // Since we can't easily get the current message, show basic stats
          responseText =
            "📊 Для получения актуальной статистики обновите панель администратора";

          await TelegramAPI.answerCallbackQuery({
            callback_query_id: callbackQuery.id,
            text: responseText,
            show_alert: true,
          });
          return NextResponse.json({ ok: true });

        default:
          responseText = "❌ Неизвестная административная команда.";
      }

      // Send response to admin
      await TelegramAPI.answerCallbackQuery({
        callback_query_id: callbackQuery.id,
        text: responseText,
      });

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

    // Admin control messages are now sent proactively when games are created
    // No need to send them on interaction anymore

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
