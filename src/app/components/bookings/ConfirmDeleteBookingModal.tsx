"use client";

import { useTelegramTheme } from "@/app/hooks/telegram";

export default function ConfirmDeleteBookingModal({
  bookingId,
  isPending,
  onCancel,
  onConfirm,
}: {
  bookingId: number | null;
  isPending: boolean;
  onCancel: () => void;
  onConfirm: (bookingId: number) => void;
}) {
  const { styles } = useTelegramTheme();
  if (bookingId === null) return null;
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
            Delete booking
          </div>
          <div className="text-sm" style={styles.secondaryText}>
            This will permanently delete the booking and all registrations. This action cannot be undone.
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
                color: styles.destructiveText.color,
                borderWidth: "1px",
                borderColor: styles.destructiveText.color,
                opacity: isPending ? 0.85 : 1,
              }}
              onClick={() => onConfirm(bookingId)}
              disabled={isPending}
            >
              {isPending ? "Deleting..." : "Delete"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

