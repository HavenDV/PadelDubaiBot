"use client";

import { useTelegramTheme } from "@/app/hooks/telegram";

export default function ConfirmSelfCancelModal({
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
            Cancel your registration
          </div>
          <div className="text-sm" style={styles.secondaryText}>
            This will remove you from the players list. You can join again later if spots are available.
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
              Keep me registered
            </button>
            <button
              className={`px-3 py-1.5 rounded-md text-sm font-medium transition-colors hover:brightness-110 relative ${
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
              <span className={isPending ? "relative overflow-hidden" : ""}>
                {isPending ? "Cancelling..." : "Cancel registration"}
                {isPending && (
                  <>
                    <div
                      className="absolute inset-0 -skew-x-12"
                      style={{
                        background:
                          "linear-gradient(90deg, transparent, rgba(255,255,255,0.4), transparent)",
                        animation: "shimmer 1.5s infinite",
                      }}
                    />
                    <style jsx>{`
                      @keyframes shimmer {
                        0% { transform: translateX(-100%) skewX(-12deg); }
                        100% { transform: translateX(200%) skewX(-12deg); }
                      }
                    `}</style>
                  </>
                )}
              </span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

