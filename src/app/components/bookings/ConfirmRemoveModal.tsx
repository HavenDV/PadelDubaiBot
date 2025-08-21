"use client";

import { useTelegramTheme } from "@/app/hooks/telegram";

export type RemovePayload = { id: number; bookingId: number } | null;

export default function ConfirmRemoveModal({
  payload,
  onCancel,
  onConfirm,
}: {
  payload: RemovePayload;
  onCancel: () => void;
  onConfirm: (payload: { id: number; bookingId: number }) => void;
}) {
  const { styles } = useTelegramTheme();
  if (payload === null) return null;
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
            Remove player
          </div>
          <div className="text-sm" style={styles.secondaryText}>
            Are you sure you want to remove this player&apos;s registration?
          </div>
          <div className="flex items-center justify-end gap-2 pt-2">
            <button
              className="px-3 py-1.5 rounded-md text-sm font-medium transition-colors"
              style={styles.secondaryButton}
              onClick={onCancel}
            >
              Cancel
            </button>
            <button
              className="px-3 py-1.5 rounded-md text-sm font-medium transition-colors hover:brightness-110"
              style={{
                backgroundColor: "transparent",
                color: styles.destructiveText.color,
                borderWidth: "1px",
                borderColor: styles.destructiveText.color,
              }}
              onClick={() => onConfirm(payload)}
            >
              Remove
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
