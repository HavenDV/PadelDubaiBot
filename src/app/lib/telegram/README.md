# Telegram Bot Data-First Architecture

This directory contains the refactored Telegram bot code using a **data-first architecture**. Instead of fragile regex parsing and string manipulation, we now work with structured data that can be reliably parsed from message content.

## Architecture Overview

### Core Concepts

1. **Data-First**: All operations work on structured data types (`GameInfo`, `UserRegistration`, etc.)
2. **Message Parsing**: Game data is parsed directly from message content using structured regex patterns
3. **Immutable Operations**: Data transformations return new objects rather than mutating existing ones
4. **Type Safety**: Full TypeScript types for all data structures

### Key Files

- **`types.ts`**: Core data types and interfaces
- **`game-data.ts`**: Data management, parsing, and business logic
- **`message-formatter.ts`**: Converts data to display messages
- **`message-utils.ts`**: Legacy compatibility layer (deprecated)

## How It Works

### 1. Game Creation

```typescript
// Create structured game data
const gameInfo = GameDataManager.createGameInfo({
  day: "Вторник",
  date: "15.01",
  time: "8:00-09:30",
  club: "SANDDUNE PADEL CLUB Al Qouz",
  price: "65 aed/чел",
  courts: 2,
  chatId: -123456789,
});

// Generate message from structured data
const message = MessageFormatter.formatGameMessage(gameInfo);
```

### 2. User Registration

```typescript
// Parse data from message content
const gameInfo = GameDataManager.parseGameDataFromMessage(messageText);

// Update with user action
const { updatedGame, notification } = GameDataManager.updateGameWithUserAction(
  gameInfo,
  { id: 123456, userName: "@username" },
  "C+" // skill level
);

// Generate updated message
const updatedMessage = MessageFormatter.formatGameMessage(updatedGame);
```

### 3. Admin Actions

```typescript
// Cancel game
const cancelledGame = GameDataManager.cancelGame(gameInfo);
const cancelledMessage = MessageFormatter.formatGameMessage(cancelledGame);

// Restore game
const restoredGame = GameDataManager.restoreGame(gameInfo);
const restoredMessage = MessageFormatter.formatGameMessage(restoredGame);
```

## Benefits

### ✅ What We Gained

1. **Reliability**: Structured parsing that's more robust than legacy regex approaches
2. **Maintainability**: Clear separation between data, business logic, and presentation
3. **Type Safety**: Full TypeScript support with compile-time error checking
4. **Testability**: Pure functions that are easy to unit test
5. **Extensibility**: Easy to add new fields or modify data structures
6. **Data Integrity**: Structured data prevents inconsistencies
7. **Backwards Compatibility**: Legacy methods still work during transition
8. **Telegram Compatibility**: No HTML comments or embedded data that Telegram strips

### ❌ What We Removed

1. **Fragile Regex**: No more fragile string manipulation that breaks easily
2. **Embedded Data**: No more HTML comments that don't work in Telegram
3. **Manual Parsing**: No more manual message construction
4. **Data Loss**: Game state is preserved across all operations
5. **Inconsistent Formatting**: All messages use the same templates

## Data Flow

```
User Action → Parse Data → Transform Data → Format Message → Send Message
     ↑                                                         ↓
User sees formatted message ← Telegram displays ← Clean message content
```

## Example: Complete User Registration Flow

```typescript
// 1. User clicks skill level button
const callbackData = "skill_C+";
const messageText = callbackQuery.message.text;

// 2. Parse structured data from message
const gameInfo = GameDataManager.parseGameDataFromMessage(messageText);

// 3. Apply user action to data
const { updatedGame, notification } = GameDataManager.updateGameWithUserAction(
  gameInfo,
  { id: user.id, userName: displayName },
  "C+"
);

// 4. Generate updated message from data
const updatedMessage = MessageFormatter.formatGameMessage(updatedGame);

// 5. Send updated message
await TelegramAPI.editMessageText({
  chat_id: chatId,
  message_id: messageId,
  text: updatedMessage,
  parse_mode: "HTML",
});
```

## Migration Notes

The old `MessageUtils` class is now deprecated but still available for backwards compatibility. All methods are wrapped to use the new data-first architecture internally.

**Before (Old Way):**

```typescript
const result = MessageUtils.updateMessageWithUserSelection(
  currentText,
  displayName,
  selectedLevel
);
```

**After (New Way):**

```typescript
const gameInfo = GameDataManager.parseGameDataFromMessage(currentText);
const { updatedGame, notification } = GameDataManager.updateGameWithUserAction(
  gameInfo,
  { id: user.id, userName: displayName },
  selectedLevel
);
const updatedMessage = MessageFormatter.formatGameMessage(updatedGame);
```

## Testing

The new architecture makes testing much easier:

```typescript
// Test data transformation
const gameInfo = GameDataManager.createGameInfo({...});
const { updatedGame } = GameDataManager.updateGameWithUserAction(gameInfo, user, "C+");
expect(updatedGame.registeredPlayers).toHaveLength(1);

// Test message parsing
const message = MessageFormatter.formatGameMessage(gameInfo);
const parsedGameInfo = GameDataManager.parseGameDataFromMessage(message);
expect(parsedGameInfo.title).toEqual(gameInfo.title);

// Test message formatting
const message = MessageFormatter.formatGameMessage(gameInfo);
expect(message).toContain("🎾 <b>");
```

## Future Enhancements

With this data-first architecture, we can easily add:

- **Persistent Storage**: Save game data to database
- **Analytics**: Track user participation patterns
- **Notifications**: Send reminders based on game data
- **API Endpoints**: Expose game data via REST API
- **Real-time Updates**: WebSocket updates for live changes
- **Advanced Features**: Waiting list management, skill-based matching, etc.
