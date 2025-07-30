# Testing Guide for Padel Dubai Bot

This document outlines the testing strategy and best practices for the Padel Dubai Bot Next.js project.

## Testing Structure

We follow Next.js testing best practices with a simplified, reliable structure:

```
__tests__/
├── example-simple.test.ts           # ✅ 10 working examples of major features
├── core-functionality.test.ts       # ✅ 15 comprehensive business logic tests
├── constants.test.ts                # ✅ 14 tests for constants and helpers
├── integration-workflow.test.ts     # ✅ 7 end-to-end integration tests
├── TESTING.md                       # 📖 Comprehensive testing guide
└── README.md                        # 📋 Test suite overview
```

**Total: 46/46 tests passing** ✅

### Design Philosophy

- **Relative imports** (`../src/`) instead of complex module mapping for reliability
- **Working examples first** - start with simple, demonstrable functionality
- **Comprehensive coverage** - from basic units to complete workflows
- **Performance testing** - ensure production-ready efficiency
- **Error resilience** - handle edge cases and malformed inputs

## Test Types

### 1. Example Tests (`example-simple.test.ts`)

- **10 working examples** that demonstrate all major bot features
- **HTML restoration** from Telegram webhooks
- **Player registration** and basic functionality
- **Performance requirements** (100+ operations < 100ms)
- **Error handling** with malformed inputs

### 2. Core Functionality Tests (`core-functionality.test.ts`)

- **15 comprehensive tests** for critical business logic
- **HTML formatting restoration** (preventing double `<b><b>` tags)
- **Player registration system** (main list + waitlist)
- **Cancellation logic** (clicking same skill level = cancel)
- **Constants and helper functions**
- **Edge cases and special characters**

### 3. Constants Tests (`constants.test.ts`)

- **14 tests** for Telegram constants, templates, and helper functions
- **Skill level buttons** (D-, D, D+, C-, cancel button)
- **Club locations** with valid Google Maps URLs
- **Calendar link generation** with proper timezone conversion
- **Message templates** for games and weekly schedules

### 4. Integration Workflow Tests (`integration-workflow.test.ts`)

- **7 end-to-end tests** for complete user workflows
- **HTML restoration workflow** - from webhook to final message
- **Player promotion** - waitlist to main list with notifications
- **Performance testing** - large datasets and repeated operations
- **Edge cases** - malformed messages, special characters

## Key Testing Areas & Recent Fixes

### HTML Formatting Restoration ✅ FIXED

**Issue**: Double HTML formatting (`<b><b>` tags) when restoring lost formatting.
**Solution**: Added conditional checks to prevent double-formatting.

```typescript
// Test that HTML formatting is restored without double-formatting
test("should preserve existing HTML formatting when already present", () => {
  const messageWithHTML = `🎾 <b>Вторник, 07.01, 8:00-09:30</b>
📍 <b>Место:</b> SANDDUNE PADEL CLUB Al Qouz`;

  const result = MessageUtils.updateMessageWithUserSelection(
    messageWithHTML,
    "@testuser",
    "D+"
  );

  expect(result.updatedMessage).not.toContain("<b><b>"); // No double formatting
});
```

### Player Cancellation Logic ✅ FIXED

**Issue**: Players couldn't cancel by clicking the same skill level button.
**Solution**: Enhanced cancellation detection to recognize same-skill clicks as cancellation.

```typescript
test("should handle player cancellation from main list", () => {
  const gameWithPlayers = `<b>Записавшиеся игроки:</b>
1. @player1 (D+)
2. @player2 (D)
3. @player3 (D+)`;

  // Cancel by clicking same skill level
  const result = MessageUtils.updateMessageWithUserSelection(
    gameWithPlayers,
    "@player2",
    "D" // Same skill level = cancellation
  );

  expect(result.updatedMessage).not.toContain("2. @player2 (D)");
});
```

### Waitlist Management ✅ ENHANCED

**Feature**: Proper emoji format and promotion notifications.

```typescript
test("should handle promotion and notification workflow", () => {
  // Full game + waitlist scenario
  const result = MessageUtils.updateMessageWithUserSelection(
    fullGameMessage,
    "@player2",
    "D" // Cancel main player
  );

  expect(result.updatedMessage).toContain("🎾 @waitlist1 (D+)"); // Emoji format
  expect(result.notification).toContain("переходит в основной состав");
});
```

### Telegram API Resilience

Test retry logic and error handling:

```typescript
test("should retry on 429 error with retry_after", async () => {
  const mockResponse429 = {
    ok: false,
    status: 429,
    json: async () => ({ parameters: { retry_after: 1 } }),
  };

  global.fetch
    .mockResolvedValueOnce(mockResponse429)
    .mockResolvedValueOnce({ ok: true, json: async () => ({ ok: true }) });

  const result = await api.sendMessage("chat", "message");
  expect(global.fetch).toHaveBeenCalledTimes(2);
});
```

## Testing Utilities

### Mock Helpers

```typescript
// Create mock Telegram API responses
export const mockTelegramResponse = (
  success: boolean = true,
  data: any = {}
) => ({
  ok: success,
  json: async () =>
    success
      ? { ok: true, result: data }
      : { ok: false, error_code: 400, description: "Test error" },
});

// Create mock callback queries
export const createMockCallbackQuery = (data: string, messageText: string) => ({
  id: "test_callback_id",
  from: { id: 123456, username: "testuser" },
  message: { chat: { id: -123456789 }, text: messageText },
  data,
});
```

### Game Message Builders

```typescript
// Create test game messages with players and waitlist
export const createGameMessage = (
  club: "SANDDUNE" | "Oxygen",
  players: Array<{ name: string; skill: string }>,
  waitlist: Array<{ name: string; skill: string }>
) => {
  // Returns properly formatted game message
};
```

### Performance Testing

```typescript
// Measure function performance
export const measurePerformance = async <T>(
  fn: () => T | Promise<T>,
  maxDurationMs: number = 100
): Promise<{ result: T; duration: number }> => {
  const startTime = Date.now();
  const result = await fn();
  const duration = Date.now() - startTime;

  expect(duration).toBeLessThan(maxDurationMs);
  return { result, duration };
};
```

## Running Tests

```bash
# Run all tests (46 tests across 4 files)
npm test

# Run tests in watch mode
npm run test:watch

# Run tests with coverage
npm run test:coverage

# Run specific test files
npm test __tests__/example-simple.test.ts          # 10 basic examples
npm test __tests__/core-functionality.test.ts      # 15 comprehensive tests
npm test __tests__/constants.test.ts               # 14 constants tests
npm test __tests__/integration-workflow.test.ts    # 7 integration tests

# Run tests matching pattern
npm test -- --testNamePattern="HTML restoration"
npm test -- --testNamePattern="cancellation"
npm test -- --testNamePattern="performance"
```

### Expected Output

```
Test Suites: 4 passed, 4 total
Tests:       46 passed, 46 total
Snapshots:   0 total
Time:        ~0.2s
```

## Coverage Requirements

We aim for high test coverage across critical areas:

- **Message Processing**: 90%+ coverage
- **Player Registration Logic**: 95%+ coverage
- **HTML Restoration**: 100% coverage
- **API Error Handling**: 85%+ coverage
- **Date/Time Functions**: 90%+ coverage

## Mocking Strategy

### External APIs

- Mock Telegram API responses for all HTTP interactions
- Mock OpenAI API for GPT responses
- Use Jest's `jest.fn()` for function mocking

### Environment Variables

- Set test environment variables in `jest.setup.js`
- Use different values for test vs production

### Time-Dependent Functions

- Mock `Date.now()` and `new Date()` for consistent testing
- Use fixed dates for calendar link generation tests

## Best Practices

1. **Test Names**: Use descriptive test names that explain the scenario
2. **Arrange-Act-Assert**: Structure tests clearly with setup, execution, and verification
3. **Mock Isolation**: Mock external dependencies to test units in isolation
4. **Edge Cases**: Test error conditions, edge cases, and boundary values
5. **Performance**: Include performance tests for critical paths
6. **Clean Setup**: Use `beforeEach` and `afterEach` for test isolation

## Debugging Tests

### Common Issues

1. **Module Resolution**: Ensure path aliases are configured correctly
2. **Mock Timing**: Use `jest.clearAllMocks()` between tests
3. **Async Operations**: Use `async/await` properly in tests
4. **Environment Variables**: Verify test environment setup

### Debug Commands

```bash
# Debug specific test
node --inspect-brk node_modules/.bin/jest --runInBand specific.test.ts

# Verbose output
npm test -- --verbose

# Debug with console logs
npm test -- --no-coverage
```

## Recent Improvements & Lessons Learned

### What We Fixed ✅

1. **Double HTML Formatting Issue**: Added conditional checks to prevent `<b><b>` tags
2. **Player Cancellation Logic**: Enhanced to recognize same-skill clicks as cancellation
3. **Waitlist Display Format**: Fixed to use 🎾 emoji format instead of numbered lists
4. **Module Resolution Issues**: Switched to reliable relative imports (`../src/`)

### Testing Philosophy Evolution

- **Started with complex module mapping** → **Simplified to relative imports**
- **Attempted comprehensive API mocking** → **Focused on core business logic**
- **Built elaborate test utilities** → **Prioritized working, readable examples**

### Current Status: 46/46 Tests Passing 🎉

- **Example Tests**: 10/10 ✅ - Basic functionality demonstrations
- **Core Functionality**: 15/15 ✅ - Critical business logic (issues fixed!)
- **Constants Tests**: 14/14 ✅ - Telegram constants and helpers
- **Integration Workflow**: 7/7 ✅ - End-to-end user scenarios

### Key Takeaway

When tests fail due to **configuration issues**, fix the configuration, don't delete the tests. The test logic was valuable and should have been preserved. This approach led to a much stronger, more comprehensive test suite.

This testing structure ensures comprehensive coverage of the bot's functionality while following Next.js and Jest best practices.
