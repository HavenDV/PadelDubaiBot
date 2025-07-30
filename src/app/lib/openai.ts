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
        model: "gpt-4.1-nano-2025-04-14",
        messages: [
          {
            role: "system",
            content:
              "Ты весёлый бот клуба мафии LaFamilia. Отвечай на сообщения короткой шуткой или дружеской подколкой на русском языке. ",
          },
          {
            role: "user",
            content: userText,
          },
        ],
        max_tokens: 60,
        temperature: 0.9,
      }),
    });

    if (!res.ok) {
      console.error("OpenAI API error", await res.text());
      return "😅";
    }

    const data = await res.json();
    return data.choices?.[0]?.message?.content?.trim() ?? "🤣";
  }
}
