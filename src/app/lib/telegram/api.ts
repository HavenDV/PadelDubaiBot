// Telegram API utilities

export interface TelegramResponse {
  ok: boolean;
  result?: {
    message_id?: number;
    poll?: {
      id: string;
    };
    [key: string]: unknown;
  };
  error_code?: number;
  description?: string;
}

export interface SendMessageParams {
  chat_id: string | number;
  text: string;
  parse_mode?: string;
  disable_web_page_preview?: boolean;
  reply_to_message_id?: number;
  reply_markup?: {
    inline_keyboard: Array<Array<{ text: string; callback_data: string }>>;
  };
}

export interface EditMessageParams {
  chat_id: string | number;
  message_id: number;
  text: string;
  parse_mode?: string;
  disable_web_page_preview?: boolean;
  reply_markup?: {
    inline_keyboard: Array<Array<{ text: string; callback_data: string }>>;
  };
}

export interface AnswerCallbackQueryParams {
  callback_query_id: string;
  text?: string;
}

// NEW CODE: parameters for pinChatMessage
export interface PinMessageParams {
  chat_id: string | number;
  message_id: number;
  disable_notification?: boolean;
}

export class TelegramAPI {
  private static get botToken(): string {
    const token = process.env.TELEGRAM_BOT_TOKEN;
    if (!token) {
      throw new Error("TELEGRAM_BOT_TOKEN environment variable is required");
    }
    return token;
  }

  private static get baseUrl(): string {
    return `https://api.telegram.org/bot${this.botToken}`;
  }

  static async sendMessage(
    params: SendMessageParams
  ): Promise<TelegramResponse> {
    const response = await fetch(`${this.baseUrl}/sendMessage`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(params),
    });

    return response.json();
  }

  static async editMessageText(
    params: EditMessageParams
  ): Promise<TelegramResponse> {
    const response = await fetch(`${this.baseUrl}/editMessageText`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(params),
    });

    return response.json();
  }

  static async answerCallbackQuery(
    params: AnswerCallbackQueryParams
  ): Promise<TelegramResponse> {
    const response = await fetch(`${this.baseUrl}/answerCallbackQuery`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(params),
    });

    return response.json();
  }

  // NEW CODE: pinChatMessage method
  static async pinChatMessage(
    params: PinMessageParams
  ): Promise<TelegramResponse> {
    const response = await fetch(`${this.baseUrl}/pinChatMessage`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(params),
    });

    return response.json();
  }
}
