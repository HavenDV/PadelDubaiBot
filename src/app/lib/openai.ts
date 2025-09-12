import {
  toolDefinitions,
  addBookingTool,
  publishBookingTool,
  updateUserSkillTool,
  type ToolCallerContext,
} from "@/app/lib/assistant/tools";

export class OpenAIUtils {
  /**
   * Generates a short humorous reply in Russian to the provided input.
   */
  static async generateJoke(userText: string): Promise<string> {
    const apiKey = process.env.OPENAI_API_KEY;
    if (!apiKey) {
      console.error("OPENAI_API_KEY is not set");
      return "😅";
    }

    const res = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: "gpt-5-nano-2025-08-07",
        messages: [
          {
            role: "system",
            content:
              "Ты весёлый бот клуба падла Padel Dubai. Отвечай на сообщения короткой шуткой или дружеской подколкой на русском языке. ",
          },
          {
            role: "user",
            content: userText,
          },
        ],
      }),
    });

    if (!res.ok) {
      console.error("OpenAI API error", await res.text());
      return "😅";
    }

    const data = await res.json();
    try {
      console.log(
        `[OpenAI] raw response (generateJoke) ${new Date().toISOString()} ::`,
        JSON.stringify(data)
      );
    } catch {}
    const content: unknown = data?.choices?.[0]?.message?.content;
    const text =
      typeof content === "string"
        ? content.trim()
        : String(content ?? "").trim();
    return text.length > 0 ? text : "😅";
  }

  /**
   * Orchestrate tool-calling for Telegram commands like adding/publishing bookings.
   * Returns a plain text reply for the chat.
   */
  static async handleTelegramCommand(params: {
    messageText: string;
    chatId?: number;
    caller?: ToolCallerContext;
  }): Promise<string> {
    const apiKey = process.env.OPENAI_API_KEY;
    if (!apiKey) return "OpenAI API key missing.";

    // System prompt instructing the model to use tools for booking workflows
    const system = `You are an assistant for Padel Dubai booking operations.
When the user asks to create or publish a booking, use the provided tools strictly.
- For creating: call add_booking with structured fields.
- For publishing: call publish_booking with booking_id and optional chat.
If both are needed, first add_booking, then publish_booking using the returned booking_id.
Also support changing skill levels via update_user_skill; allow non-admins to update only their own skill.
Prefer using tools rather than free-form text when possible.
Keep messages concise. Return confirmations in Russian.`;

    // First call
    const initial = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: "gpt-5-mini-2025-08-07", // tools-capable model
        messages: [
          { role: "system", content: system },
          { role: "user", content: params.messageText },
        ],
        tools: toolDefinitions,
        tool_choice: "auto",
      }),
    });

    if (!initial.ok) {
      console.error("OpenAI tools call failed", await initial.text());
      return "Не получилось понять запрос.";
    }

    const data = await initial.json();
    try {
      console.log("[AI] tools raw response:", JSON.stringify(data));
    } catch {}
    const message = data?.choices?.[0]?.message;

    // Tool loop (single step or two-step chain)
    if (message?.tool_calls?.length) {
      let lastText = "";
      let lastBookingId: number | undefined;

      for (const call of message.tool_calls) {
        const name: string = call.function?.name;
        const rawArgs: string = call.function?.arguments || "{}";
        let args: any = {};
        try {
          args = JSON.parse(rawArgs);
        } catch {}

        console.log("[AI] Tool call:", name, rawArgs);
        if (name === "add_booking") {
          const res = await addBookingTool(args, params.caller);
          lastBookingId = res.booking_id;
          lastText = res.success
            ? `Готово! Создал бронь №${res.booking_id}.`
            : `Не удалось создать бронь: ${res.error || "ошибка"}`;
        } else if (name === "publish_booking") {
          const res = await publishBookingTool(
            {
              booking_id: args.booking_id ?? lastBookingId,
              chat: args.chat ?? params.chatId,
            },
            params.chatId,
            params.caller
          );
          lastText = res.success
            ? `Опубликовал. Сообщение №${res.message_id}.`
            : `Не удалось опубликовать: ${res.error || "ошибка"}`;
        } else if (name === "update_user_skill") {
          const res = await updateUserSkillTool(args, params.caller);
          lastText = res.success
            ? `Обновил уровень: ${res.new_skill}.`
            : `Не удалось обновить уровень: ${res.error || "ошибка"}`;
        }
      }

      if (lastText) return lastText;
    }

    // Fallback to short joke reply if no tools used
    console.log("[AI] No tools used, fallback to joke");
    return this.generateJoke(params.messageText);
  }
}
