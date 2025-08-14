// Shared types for Telegram auth API between server (route) and client (context)

export interface TelegramAuthResponse {
  access_token: string;
  refresh_token: string;
  expires_in: number;
}

export interface TelegramAuthErrorResponse {
  error: string;
}

// EN: Payload returned by Telegram Login Widget (outside of WebApp)
export interface TelegramLoginPayload {
  id: number;
  first_name: string;
  last_name?: string;
  username?: string;
  photo_url?: string;
  auth_date: number | string; // unix timestamp
  hash: string; // HMAC-SHA256 signature (hex)
}
