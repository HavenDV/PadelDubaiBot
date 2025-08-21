"use client";

import { useEffect, useState } from "react";
import { useTelegramTheme } from "@/app/hooks/telegram";
import { useActiveChats } from "@/app/lib/hooks/db";
import type { Booking } from "../../../../database.types";

export default function PostToDialog({
  initialChatId,
  onClose,
  onPost,
}: {
  booking: Booking;
  initialChatId?: number;
  onClose: () => void;
  onPost: (chatId: number) => void;
}) {
  const { styles } = useTelegramTheme();
  const { data: chats = [], isLoading } = useActiveChats();
  const [selectedId, setSelectedId] = useState<number | undefined>(
    initialChatId
  );

  useEffect(() => {
    if (!selectedId) setSelectedId(initialChatId);
  }, [initialChatId, selectedId]);

  // Auto-select first chat whose name/title/username doesn't contain "test"
  useEffect(() => {
    if (selectedId || isLoading || chats.length === 0) return;
    const firstNonTest = chats.find((c) => {
      const label = (c.name || c.title || c.username || "").toLowerCase();
      return !label.includes("test");
    });
    if (firstNonTest) setSelectedId(firstNonTest.id);
  }, [chats, isLoading, selectedId]);

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ backgroundColor: "rgba(0,0,0,0.5)" }}
    >
      <div
        className="w-full max-w-md rounded-lg border shadow-sm"
        style={{ ...styles.card, ...styles.border }}
      >
        <div className="p-4 space-y-3">
          <div className="font-bold text-lg" style={styles.text}>
            Post to
          </div>
          <div className="text-sm" style={styles.secondaryText}>
            Choose a chat to post this booking to.
          </div>

          <div className="max-h-64 overflow-auto mt-2 space-y-2">
            {isLoading ? (
              <div
                className="text-sm"
                style={{ color: styles.secondaryText.color }}
              >
                Loading chats...
              </div>
            ) : chats.length === 0 ? (
              <div className="text-sm" style={styles.secondaryText}>
                No chats available.
              </div>
            ) : (
              chats.map((chat) => {
                const isSelected = selectedId === chat.id;
                return (
                  <button
                    key={chat.id}
                    type="button"
                    onClick={() => setSelectedId(chat.id)}
                    className="w-full text-left p-3 rounded-md border transition"
                    style={{
                      borderColor: isSelected
                        ? styles.primaryButton.backgroundColor
                        : (styles.border?.borderColor as string) || "#ccc",
                      backgroundColor: isSelected
                        ? (styles.selectedBg?.backgroundColor as string) ||
                          "rgba(59,130,246,0.1)"
                        : (styles.card?.backgroundColor as string),
                      color: styles.text.color,
                    }}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="font-medium">
                          {chat.name || chat.title || chat.username || chat.id}
                        </span>
                      </div>
                      <span
                        className={`w-4 h-4 rounded-full border inline-block ${
                          isSelected ? "bg-current" : ""
                        }`}
                        style={{
                          borderColor: styles.secondaryText.color,
                          color: styles.text.color,
                        }}
                      />
                    </div>
                    {chat.description && (
                      <div
                        className="text-xs mt-1"
                        style={styles.secondaryText}
                      >
                        {chat.description}
                      </div>
                    )}
                  </button>
                );
              })
            )}
          </div>

          <div className="flex items-center justify-end gap-2 pt-2">
            <button
              className="px-3 py-1.5 rounded-md text-sm font-medium transition-colors"
              style={styles.secondaryButton}
              onClick={onClose}
            >
              Cancel
            </button>
            <button
              className="px-3 py-1.5 rounded-md text-sm font-medium transition-colors hover:brightness-110"
              style={styles.primaryButton}
              onClick={() => selectedId && onPost(selectedId)}
              disabled={!selectedId}
              title={!selectedId ? "Select a chat" : "Post"}
            >
              Post
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
