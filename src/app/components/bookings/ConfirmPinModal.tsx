"use client";

import { useTelegramTheme } from "@/app/hooks/telegram";

type PinPayload = { messageId: number; chatId: number } | null;

export default function ConfirmPinModal({
  payload,
  mode,
  isPending,
  onCancel,
  onConfirm,
}: {
  payload: PinPayload;
  mode: "pin" | "unpin";
  isPending: boolean;
  onCancel: () => void;
  onConfirm: (payload: { messageId: number; chatId: number }) => void;
}) {
  const { styles } = useTelegramTheme();
  if (payload === null) return null;

  const isUnpin = mode === "unpin";
  const title = isUnpin ? "Unpin message" : "Pin message";
  const actionLabel = isUnpin ? "Unpin" : "Pin";
  const description = isUnpin
    ? "This will remove the message from the pinned area in this chat."
    : "This will pin the message to the top of the chat for everyone.";

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ backgroundColor: "rgba(0,0,0,0.5)" }}
    >
      <div
        className="w-full max-w-sm rounded-lg border shadow-sm"
        style={{ ...styles.card, ...styles.border }}
      >
        <div className="p-4 space-y-3">
          <div className="font-bold" style={styles.text}>
            {title}
          </div>
          <div className="text-sm" style={styles.secondaryText}>
            {description}
          </div>
          <div className="flex items-center justify-end gap-2 pt-2">
            <button
              className={`px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${
                isPending ? "cursor-not-allowed opacity-70" : ""
              }`}
              style={styles.secondaryButton}
              onClick={() => (!isPending ? onCancel() : undefined)}
              disabled={isPending}
            >
              Cancel
            </button>
            <button
              className={`px-3 py-1.5 rounded-md text-sm font-medium transition-colors hover:brightness-110 ${
                isPending ? "cursor-not-allowed" : ""
              }`}
              style={{
                backgroundColor: "transparent",
                color: isUnpin ? styles.destructiveText.color : styles.text.color,
                borderWidth: "1px",
                borderColor: isUnpin
                  ? styles.destructiveText.color
                  : styles.text.color,
                opacity: isPending ? 0.85 : 1,
              }}
              onClick={() => onConfirm(payload)}
              disabled={isPending}
            >
              {isPending ? `${actionLabel}ning...` : actionLabel}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

