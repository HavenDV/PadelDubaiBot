import type {
  TelegramAuthResponse,
  TelegramAuthErrorResponse,
  TelegramLoginPayload,
} from "../../types/telegram-auth";

export async function exchangeTelegramAuthViaInitData(
  initDataRaw: string
): Promise<TelegramAuthResponse> {
  const response = await fetch("/api/telegram/auth", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ initDataRaw }),
  });

  if (!response.ok) {
    const errorData: TelegramAuthErrorResponse = await response.json();
    throw new Error(errorData.error || "Authentication failed");
  }

  return (await response.json()) as TelegramAuthResponse;
}

export async function exchangeTelegramAuthViaLoginPayload(
  loginPayload: TelegramLoginPayload
): Promise<TelegramAuthResponse> {
  const response = await fetch("/api/telegram/auth", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ loginPayload }),
  });

  if (!response.ok) {
    const errorData: TelegramAuthErrorResponse = await response.json();
    throw new Error(errorData.error || "Authentication failed");
  }

  return (await response.json()) as TelegramAuthResponse;
}
