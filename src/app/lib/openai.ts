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
}
