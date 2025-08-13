// Shared types for Telegram auth API between server (route) and client (context)

export interface TelegramAuthResponse {
  access_token: string;
  refresh_token: string;
  expires_in: number;
}

export interface TelegramAuthErrorResponse {
  error: string;
}
