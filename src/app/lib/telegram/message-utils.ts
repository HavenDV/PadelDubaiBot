// Message formatting utilities

export interface UserRegistration {
  userName: string;
  selectedTime: string;
}

export class MessageUtils {
  /**
   * Updates a voting message by adding or updating user registrations
   */
  static updateMessageWithUserSelection(
    currentText: string,
    displayName: string,
    selectedTime: string
  ): string {
    // Split the message into parts
    const lines = currentText.split("\n");
    const baseMessageEndIndex = lines.findIndex((line) =>
      line.includes("Сегодня с нами:")
    );

    if (baseMessageEndIndex === -1) {
      return currentText; // Fallback if message format is unexpected
    }

    // Get the base message part
    const baseMessage = lines.slice(0, baseMessageEndIndex + 1).join("\n");

    // Parse existing registrations
    const registrations = this.parseExistingRegistrations(
      lines,
      baseMessageEndIndex
    );

    const key = this.normalizeName(displayName);

    // Update or add user registration
    if (selectedTime === "not_coming") {
      registrations.delete(key);
    } else {
      registrations.set(key, { displayName, time: selectedTime });
    }

    // Build the updated message
    return this.buildUpdatedMessage(baseMessage, registrations);
  }

  /**
   * Parses existing user registrations from message lines
   */
  private static parseExistingRegistrations(
    lines: string[],
    baseMessageEndIndex: number
  ): Map<string, { displayName: string; time: string }> {
    const registrations = new Map<
      string,
      { displayName: string; time: string }
    >();
    const existingLines = lines.slice(baseMessageEndIndex + 1);

    // Parse existing registrations
    for (const line of existingLines) {
      if (line.trim()) {
        // Match patterns like "👤 <a href=...>@nick</a> (Время: 20:30)" or "👤 @nick (Время: 20:30)"
        const timeMatch = line.match(/^(?:👤\s*)?(.+?)\s*\(Время:\s*(.+?)\)$/);
        if (timeMatch) {
          const [, rawName, time] = timeMatch;
          const key = this.normalizeName(rawName.trim());
          registrations.set(key, {
            displayName: rawName.trim(),
            time: time.trim(),
          });
        }
      }
    }

    return registrations;
  }

  /** Normalizes a display name to a unique key (prefer username without @) */
  private static normalizeName(name: string): string {
    // If anchor markup: extract username part
    const anchorMatch = name.match(/<a[^>]+\/([^"'>]+)"[^>]*>/);
    if (anchorMatch) return anchorMatch[1].toLowerCase();

    // If @mention
    const mentionMatch = name.match(/^@([A-Za-z0-9_]+)/);
    if (mentionMatch) return mentionMatch[1].toLowerCase();

    // Fallback: strip HTML tags and return lowercase text
    return name.replace(/<[^>]+>/g, "").toLowerCase();
  }

  /**
   * Builds the updated message with user registrations
   */
  private static buildUpdatedMessage(
    baseMessage: string,
    registrations: Map<string, { displayName: string; time: string }>
  ): string {
    let updatedMessage = baseMessage;

    if (registrations.size > 0) {
      updatedMessage += "\n";
      for (const { displayName, time } of registrations.values()) {
        updatedMessage += `\n👤 ${displayName} (Время: ${time})`;
      }
    }

    return updatedMessage;
  }

  /**
   * Gets all registered users from a message
   */
  static getRegisteredUsers(messageText: string): UserRegistration[] {
    const lines = messageText.split("\n");
    const baseMessageEndIndex = lines.findIndex((line) =>
      line.includes("Сегодня с нами:")
    );

    if (baseMessageEndIndex === -1) {
      return [];
    }

    const registrations = this.parseExistingRegistrations(
      lines,
      baseMessageEndIndex
    );

    return Array.from(registrations.values()).map(({ displayName, time }) => ({
      userName: displayName,
      selectedTime: time,
    }));
  }

  /**
   * Gets the current time string in Moscow timezone
   */
  static getCurrentMoscowTime(): string {
    const now = new Date();
    return now.toLocaleTimeString("ru-RU", {
      timeZone: "Europe/Moscow",
      hour: "2-digit",
      minute: "2-digit",
    });
  }
}
