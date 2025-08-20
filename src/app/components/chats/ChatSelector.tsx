"use client";

import { useActiveChats } from "@lib/hooks/db";

interface ChatSelectorProps {
  selectedChatId?: number;
  onChatSelect: (chatId?: number) => void;
  styles: Record<string, any>; // eslint-disable-line @typescript-eslint/no-explicit-any
  disabled?: boolean;
  compact?: boolean; // New prop for minimal display
}

export default function ChatSelector({
  selectedChatId,
  onChatSelect,
  styles,
  disabled = false,
  compact = false,
}: ChatSelectorProps) {
  const { data: chats = [], isLoading } = useActiveChats();

  if (isLoading) {
    return compact ? null : (
      <div style={{ color: styles.hint_color, fontSize: "12px" }}>
        Loading chats...
      </div>
    );
  }

  if (chats.length === 0) {
    return compact ? null : (
      <div style={{ color: styles.hint_color, fontSize: "12px" }}>
        No chats available.
      </div>
    );
  }

  if (compact) {
    return (
      <select
        value={selectedChatId || ""}
        onChange={(e) =>
          onChatSelect(e.target.value ? parseInt(e.target.value) : undefined)
        }
        disabled={disabled}
        style={{
          fontSize: "12px",
          padding: "4px 6px",
          borderRadius: "4px",
          border: `1px solid ${styles.hint_color}`,
          backgroundColor: styles.bg_color,
          color: styles.text_color,
          maxWidth: "120px",
          marginRight: "8px",
        }}
        title="Select chat to post to"
      >
        <option value="">Select chat</option>
        {chats.map((chat) => (
          <option key={chat.id} value={chat.id}>
            {chat.name || chat.title || chat.username || `${chat.id}`}
          </option>
        ))}
      </select>
    );
  }

  return (
    <div>
      <label
        style={{
          fontSize: "14px",
          fontWeight: "500",
          color: styles.text_color,
          marginBottom: "8px",
          display: "block",
        }}
      >
        Select Chat:
      </label>
      <select
        value={selectedChatId || ""}
        onChange={(e) =>
          onChatSelect(e.target.value ? parseInt(e.target.value) : undefined)
        }
        disabled={disabled}
        style={{
          width: "100%",
          padding: "8px",
          borderRadius: "6px",
          border: `1px solid ${styles.hint_color}`,
          backgroundColor: styles.bg_color,
          color: styles.text_color,
          fontSize: "14px",
        }}
      >
        <option value="">Select chat</option>
        {chats.map((chat) => (
          <option key={chat.id} value={chat.id}>
            {chat.name || chat.title || `Chat ${chat.id}`}
          </option>
        ))}
      </select>
      {selectedChatId && (
        <div
          style={{
            fontSize: "12px",
            color: styles.hint_color,
            marginTop: "4px",
          }}
        >
          {chats.find((c) => c.id === selectedChatId)?.description}
        </div>
      )}
    </div>
  );
}
