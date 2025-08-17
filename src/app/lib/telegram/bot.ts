import { Bot, Context } from "grammy";
import type { InlineKeyboardMarkup } from "grammy/types";
import { AdminUtils, CALLBACK_MESSAGES, GameDataManager, MessageFormatter } from "@/app/lib/telegram";
import { OpenAIUtils } from "@/app/lib/openai";
import { handleDatabaseRegistration } from "@/app/lib/telegram/booking";

const token = process.env.TELEGRAM_BOT_TOKEN!;

export const bot = new Bot<Context>(token);

// Callback buttons: join/leave and legacy skill_* buttons
bot.on("callback_query:data", async (ctx) => {
  const data = ctx.callbackQuery.data || "";
  const msg = ctx.callbackQuery.message;
  if (!msg) return;

  if (data === "join_game" || data === "leave_game") {
    const chatId = msg.chat.id;
    const messageId = msg.message_id;

    const action: "join" | "leave" = data === "join_game" ? "join" : "leave";

    const user = ctx.callbackQuery.from;
    const displayName = user.username
      ? `<a href="https://t.me/${user.username}">@${user.username}</a>`
      : user.first_name || "Unknown";

    // Early ack
    try {
      await ctx.answerCallbackQuery({
        text:
          action === "leave"
            ? CALLBACK_MESSAGES.NOT_COMING
            : "Записываем вас на игру...",
      });
    } catch {}

    // Late cancellation warning (only for leave)
    if (action === "leave" && msg.text) {
      const gameInfo = GameDataManager.extractGameDataFromMessage(msg.text);
      if (gameInfo) {
        const lc = GameDataManager.isLateCancellation(gameInfo);
        if (lc.isLate && lc.hoursRemaining !== null) {
          try {
            await ctx.answerCallbackQuery({
              text: CALLBACK_MESSAGES.LATE_CANCELLATION_WARNING(lc.hoursRemaining),
              show_alert: true,
            });
          } catch {}
          return; // Stop processing to avoid removing registration
        }
      }
    }
    try {
      const dbResult = await handleDatabaseRegistration(
        messageId,
        user.id,
        displayName,
        action,
        chatId
      );

      if (!dbResult.success) {
        if (dbResult.error) {
          await ctx.answerCallbackQuery({ text: dbResult.error, show_alert: true });
        }
        return;
      }

      if (dbResult.updatedMessage) {
        const replyMarkup: InlineKeyboardMarkup = {
          inline_keyboard: AdminUtils.getButtonsForUser().map((row) =>
            row.map((b) => ({ text: b.text, callback_data: b.callback_data }))
          ),
        };
        await ctx.api.editMessageText(chatId, messageId, dbResult.updatedMessage, {
          parse_mode: "HTML",
          link_preview_options: { is_disabled: true },
          reply_markup: replyMarkup,
        });
      }

      if (dbResult.notification) {
        await ctx.api.sendMessage(chatId, dbResult.notification, {
          parse_mode: "HTML",
          link_preview_options: { is_disabled: true },
        });
      }
    } catch (err) {
      console.error("grammY handler error:", err);
    }
  }
});

// Simple mention reply (preserves existing behavior)
bot.on("message", async (ctx) => {
  const msg = ctx.message;
  const text = msg?.text || "";
  const isDirectMention = text.includes("@padel_dubai_bot");
  const isReplyToBot =
    msg?.reply_to_message?.from?.username === "padel_dubai_bot" ||
    msg?.reply_to_message?.via_bot?.username === "padel_dubai_bot";

  if (!isDirectMention && !isReplyToBot) return;
  // Keep minimal echo to avoid coupling with OpenAI here
  try {
    if (msg?.pinned_message) return;
    const promptText =
      isReplyToBot && msg.reply_to_message?.text
        ? `Предыдущее сообщение: ${msg.reply_to_message.text}\nОтвет игрока: ${text}`
        : text;

    const joke = await OpenAIUtils.generateJoke(promptText);
    await ctx.api.sendMessage(msg.chat.id, joke, {
      reply_to_message_id: msg.message_id,
      link_preview_options: { is_disabled: true },
    });
  } catch {}
});

// Welcome new chat members
bot.on("message:new_chat_members", async (ctx) => {
  try {
    const chatId = ctx.chat?.id;
    const newMembers = ctx.message?.new_chat_members;
    if (!chatId || !newMembers?.length) return;

    for (const member of newMembers) {
      if (member.is_bot) continue;
      const firstName = member.first_name || "друг";
      const welcome = MessageFormatter.formatWelcomeMessage(firstName);
      await ctx.api.sendMessage(chatId, welcome, {
        parse_mode: "HTML",
        link_preview_options: { is_disabled: true },
      });
    }
  } catch (error) {
    console.error("Error sending welcome message:", error);
  }
});
