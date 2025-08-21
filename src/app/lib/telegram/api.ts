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
  parameters?: {
    retry_after?: number;
    [key: string]: unknown;
  };
}

export type InlineKeyboardCallbackButton = {
  readonly text: string;
  readonly callback_data: string;
};

export type InlineKeyboardUrlButton = {
  readonly text: string;
  readonly url: string;
};

export type InlineKeyboardWebAppButton = {
  readonly text: string;
  readonly web_app: { readonly url: string };
};

export type InlineKeyboardButton =
  | InlineKeyboardCallbackButton
  | InlineKeyboardUrlButton
  | InlineKeyboardWebAppButton;

export interface InlineKeyboardMarkupGeneric {
  inline_keyboard: ReadonlyArray<ReadonlyArray<InlineKeyboardButton>>;
}

export interface SendMessageParams {
  chat_id: string | number;
  text: string;
  parse_mode?: string;
  disable_web_page_preview?: boolean;
  reply_to_message_id?: number;
  reply_markup?: InlineKeyboardMarkupGeneric;
}

export interface EditMessageParams {
  chat_id: string | number;
  message_id: number;
  text: string;
  parse_mode?: string;
  disable_web_page_preview?: boolean;
  reply_markup?: InlineKeyboardMarkupGeneric;
}

export interface DeleteMessageParams {
  chat_id: string | number;
  message_id: number;
}

export interface ReplyMarkupInlineUrl {
  inline_keyboard: ReadonlyArray<ReadonlyArray<InlineKeyboardUrlButton>>;
}

export interface SendLocationParams {
  chat_id: string | number;
  latitude: number;
  longitude: number;
  horizontal_accuracy?: number;
  live_period?: number;
  heading?: number;
  proximity_alert_radius?: number;
  reply_to_message_id?: number;
  reply_markup?: ReplyMarkupInlineUrl;
}

export interface SendVenueParams {
  chat_id: string | number;
  latitude: number;
  longitude: number;
  title: string;
  address: string;
  foursquare_id?: string;
  foursquare_type?: string;
  google_place_id?: string;
  google_place_type?: string;
  reply_to_message_id?: number;
  reply_markup?: ReplyMarkupInlineUrl;
}

export interface AnswerCallbackQueryParams {
  callback_query_id: string;
  text?: string;
  show_alert?: boolean;
  url?: string;
  cache_time?: number;
}

// NEW CODE: parameters for pinChatMessage
export interface PinMessageParams {
  chat_id: string | number;
  message_id: number;
  disable_notification?: boolean;
}

export interface UnpinMessageParams {
  chat_id: string | number;
  message_id?: number; // when omitted, Bot API unpins the most recent pinned message? We'll target specific
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

  private static async delay(ms: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }

  private static async makeRequest(
    url: string,
    params: unknown,
    retries = 3
  ): Promise<TelegramResponse> {
    for (let attempt = 1; attempt <= retries; attempt++) {
      try {
        const response = await fetch(url, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(params),
        });

        const result = await response.json();

        // Handle rate limiting (429)
        if (response.status === 429) {
          const retryAfter = result.parameters?.retry_after || 1;
          console.warn(
            `Rate limited. Retrying after ${retryAfter}s (attempt ${attempt}/${retries})`
          );

          if (attempt < retries) {
            await this.delay(retryAfter * 1000);
            continue;
          }
        }

        // Handle other errors
        if (!response.ok) {
          console.error(`Telegram API error (${response.status}):`, result);

          if (attempt < retries && this.isRetryableError(response.status)) {
            const backoffDelay = Math.pow(2, attempt - 1) * 1000; // Exponential backoff
            console.warn(
              `Retrying in ${backoffDelay}ms (attempt ${attempt}/${retries})`
            );
            await this.delay(backoffDelay);
            continue;
          }
        }

        return result;
      } catch (error) {
        console.error(`Network error on attempt ${attempt}:`, error);

        if (attempt < retries) {
          const backoffDelay = Math.pow(2, attempt - 1) * 1000;
          await this.delay(backoffDelay);
          continue;
        }

        throw error;
      }
    }

    // This should never be reached, but TypeScript needs it
    throw new Error("Max retries exceeded");
  }

  private static isRetryableError(status: number): boolean {
    // Retry on server errors and rate limiting
    return status >= 500 || status === 429;
  }

  static async sendMessage(
    params: SendMessageParams
  ): Promise<TelegramResponse> {
    return this.makeRequest(`${this.baseUrl}/sendMessage`, params);
  }

  static async editMessageText(
    params: EditMessageParams
  ): Promise<TelegramResponse> {
    return this.makeRequest(`${this.baseUrl}/editMessageText`, params);
  }

  static async answerCallbackQuery(
    params: AnswerCallbackQueryParams
  ): Promise<TelegramResponse> {
    return this.makeRequest(`${this.baseUrl}/answerCallbackQuery`, params);
  }

  static async pinChatMessage(
    params: PinMessageParams
  ): Promise<TelegramResponse> {
    return this.makeRequest(`${this.baseUrl}/pinChatMessage`, params);
  }

  static async unpinChatMessage(
    params: UnpinMessageParams
  ): Promise<TelegramResponse> {
    return this.makeRequest(`${this.baseUrl}/unpinChatMessage`, params);
  }

  static async sendLocation(params: SendLocationParams): Promise<TelegramResponse> {
    return this.makeRequest(`${this.baseUrl}/sendLocation`, params);
  }

  static async sendVenue(params: SendVenueParams): Promise<TelegramResponse> {
    return this.makeRequest(`${this.baseUrl}/sendVenue`, params);
  }

  static async deleteMessage(
    params: DeleteMessageParams
  ): Promise<TelegramResponse> {
    return this.makeRequest(`${this.baseUrl}/deleteMessage`, params);
  }

  // Fetch chat info for enrichment
  static async getChat(chat_id: number | string): Promise<TelegramResponse> {
    return this.makeRequest(`${this.baseUrl}/getChat`, { chat_id });
  }

  // Fetch chat member count when needed
  static async getChatMemberCount(
    chat_id: number | string
  ): Promise<TelegramResponse> {
    // Bot API supports POST with { chat_id }
    return this.makeRequest(`${this.baseUrl}/getChatMemberCount`, { chat_id });
  }
}
