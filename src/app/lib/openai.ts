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

    // Iterative tool loop: allow the model to chain multiple tools
    const messages: Array<{
      role: string;
      content?: string;
      tool_call_id?: string;
      name?: string;
    }> = [
      { role: "system", content: system },
      { role: "user", content: params.messageText },
    ];

    let lastBookingId: number | undefined;
    for (let step = 0; step < 4; step++) {
      const resp = await fetch("https://api.openai.com/v1/chat/completions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${apiKey}`,
        },
        body: JSON.stringify({
          model: "gpt-5-2025-08-07", // advanced tools-capable model
          messages,
          tools: toolDefinitions,
          tool_choice: "auto",
        }),
      });
      if (!resp.ok) {
        console.error("OpenAI tools call failed", await resp.text());
        break;
      }
      const data2 = await resp.json();
      const msg = data2?.choices?.[0]?.message;
      try {
        console.log("[AI] tools raw response:", JSON.stringify(data2));
      } catch {}

      // If the model returns a final message with no tool calls, use it
      if (!msg?.tool_calls?.length) {
        const content = (
          typeof msg?.content === "string" ? msg.content : ""
        ).trim();
        if (content.length) return content;
        break;
      }

      // Execute each tool call and append tool results for the next round
      for (const call of msg.tool_calls) {
        const name: string = call.function?.name;
        const callId: string | undefined = call.id;
        const rawArgs: string = call.function?.arguments || "{}";
        let parsed: unknown = {};
        try {
          parsed = JSON.parse(rawArgs);
        } catch {}

        console.log("[AI] Tool call:", name, rawArgs);
        if (name === "add_booking") {
          const res = await addBookingTool(
            parsed as { [k: string]: unknown },
            params.caller
          );
          lastBookingId = res.booking_id ?? lastBookingId;
          messages.push({
            role: "tool",
            tool_call_id: callId,
            name,
            content: JSON.stringify(res),
          });
        } else if (name === "publish_booking") {
          const fallbackChat = (parsed as { chat?: number | string | null })
            .chat;
          const fallbackChatIdNum: number = (() => {
            if (typeof params.chatId === "number") return params.chatId;
            if (typeof fallbackChat === "number") return fallbackChat;
            return 0;
          })();
          const bookingIdVal =
            (parsed as { booking_id?: number }).booking_id ?? lastBookingId;
          const result =
            typeof bookingIdVal === "number"
              ? await publishBookingTool(
                  {
                    booking_id: bookingIdVal,
                    chat:
                      (parsed as { chat?: number | string | null }).chat ??
                      params.chatId,
                  },
                  fallbackChatIdNum,
                  params.caller
                )
              : { success: false, error: "booking_id missing" };
          messages.push({
            role: "tool",
            tool_call_id: callId,
            name,
            content: JSON.stringify(result),
          });
        } else if (name === "update_user_skill") {
          const res = await updateUserSkillTool(
            parsed as { [k: string]: unknown } as {
              skill: "E" | "D-" | "D" | "D+" | "D++" | "C-" | "C" | "C+";
              user_id?: number;
              username?: string | null;
            },
            params.caller
          );
          messages.push({
            role: "tool",
            tool_call_id: callId,
            name,
            content: JSON.stringify(res),
          });
        }
      }
    }

    // Fallback to joke if no final content was produced
    console.log("[AI] No tools used, fallback to joke");
    return this.generateJoke(params.messageText);
  }
}
