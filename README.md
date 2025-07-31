# PadelDubaiBot 🏓

A Telegram bot for organizing Padel games in Dubai with weekly schedules and skill-based registration system. Built with Next.js 15 and deployed on Vercel.

## Features

- **Weekly Schedule**: Automatically posts weekly padel game schedule every Monday at 8 AM (Dubai time)
- **Individual Game Messages**: Each game gets its own message with registration buttons
- **Skill-Based Registration**: Players can register with their official skill level (E, D, D+, C-, C, C+)
- **Automatic Waitlist**: When 4+ players register, additional players go to waitlist
- **Smart Player Management**: Automatic promotion from waitlist when someone cancels
- **Notification System**: Tagged messages when players move between main list and waitlist
- **Automatic Formatting**: Numbered lists with player names and skill levels
- **Calendar Integration**: Direct links to add games to Google Calendar
- **Location Links**: Clickable Google Maps links for easy navigation
- **Multi-timezone Support**: Configured for Dubai timezone
- **Cancellation Support**: Games can be marked as cancelled
- **Robust Error Handling**: Automatic retry with exponential backoff for API errors
- **Rate Limit Protection**: Handles Telegram's 429 errors with proper delays
- **Welcome Messages**: Automatic personalized welcome messages for new group members
- **Penalty System**: Warns about sanctions for cancellations less than 24 hours before game time
- **AI-Powered Responses**: OpenAI integration for generating responses when the bot is mentioned

## Setup

### Getting Required Credentials

#### 1. Telegram Bot Token

1. Open Telegram and search for `@BotFather`
2. Start a chat and send `/newbot`
3. Follow the prompts to choose a name and username for your bot
4. Copy the bot token (format: `123456789:ABC-DEF1234ghIkl-zyx57W2v1u123ew11`)

#### 2. Telegram Chat ID

To get the chat ID where the bot will send daily polls:

1. Right-click on any message inside your target group/channel
2. Select "Copy Link"
3. The link will look like: `https://t.me/c/1234567890/123`
4. Take the number after `/c/` (e.g., `1234567890`)
5. Add `-100` prefix to get the chat ID: `-1001234567890`

#### 3. OpenAI API Key

1. Visit [OpenAI Platform](https://platform.openai.com/api-keys)
2. Create an account or sign in
3. Click "Create new secret key"
4. Copy the API key (starts with `sk-`)

### Environment Variables

Create a `.env.local` file with:

```bash
TELEGRAM_BOT_TOKEN=123456789:ABC-DEF1234ghIkl-zyx57W2v1u123ew11
CHAT_ID=-1001234567890
OPENAI_API_KEY=sk-your-openai-api-key-here
```

### Development

```bash
npm install
npm run dev
```

The bot webhook will be available at `http://localhost:3000/api/telegram/webhook`

### Production Deployment

Deploy to Vercel with the included `vercel.json` configuration:

```json
{
  "functions": {
    "app/api/telegram/webhook/route.ts": { "maxDuration": 60 }
  },
  "crons": [
    {
      "path": "/api/telegram/create-poll",
      "schedule": "0 8 * * 1"
    }
  ]
}
```

#### Vercel Configuration:

1. **Environment Variables**: Set the required variables in Vercel dashboard
2. **Webhook Timeout**: 60-second timeout for processing Telegram updates
3. **Cron Jobs**: Weekly schedule messages sent at 8 AM Dubai time every Monday (`0 8 * * 1`)
4. **Edge Runtime**: Zero cold-start latency for instant responses

#### Telegram Bot Setup:

After deployment, set your webhook URL:

```bash
curl -X POST "https://api.telegram.org/bot<YOUR_BOT_TOKEN>/setWebhook" \
  -H "Content-Type: application/json" \
  -d '{"url": "https://your-vercel-app.vercel.app/api/telegram/webhook"}'
```

## Architecture

Built on Next.js 15 with:

- **Edge Runtime**: Zero cold-start for instant responses
- **Telegram Bot API**: Type-safe wrapper for all bot operations
- **OpenAI Integration**: GPT-powered humor generation in Russian
- **Vercel Cron**: Automated weekly scheduling
- **Message State Management**: Complex parsing for user registration tracking

## Bot Commands

- Users click skill level buttons to register for padel games
- Mention `@padel_dubai_bot` for AI-generated responses
- Reply to bot messages for contextual humor responses

## Registration System

Players can register for games by selecting their official skill level:

- **E (First time)**: Complete beginner, first time playing padel
- **D (Learning rallies)**: Starting to play rallies and understand positioning
- **D+ (Control direction)**: Can control direction and understand rules
- **C- (Defense & attack)**: Moving between defense and attack positions
- **C (Defense to attack)**: Transitioning from defense to attack to finish points
- **C+ (Change pace & play)**: Advanced strategies, changing pace and play variations

### Waitlist System

- **Main Game**: Maximum 4 players per game
- **Waitlist**: Players 5+ automatically go to waitlist
- **Always Visible**: Waitlist section always shown, displays "_Пусто_" when empty
- **Automatic Promotion**: When someone cancels, first waitlist player moves to main game
- **Notifications**: Tagged messages notify both canceling and promoted players

**Example notifications:**

```
🔄 @user1 отменил участие, @user2 переходит в основной состав с Waitlist!
❌ @user1 отменил участие
```

_Note: No notifications are sent when players cancel from waitlist_

## Welcome Messages

When new members join the Telegram group, the bot automatically sends them a personalized welcome message that includes:

### Welcome Message Content

- **Personalized greeting**: Uses the new member's first name
- **Community introduction**: Overview of the padel community and atmosphere
- **Game information**: Details about playing schedule and club locations in Dubai
- **Skill levels**: Information about different playing levels available
- **Rules reference**: Link to community rules and guidelines
- **Contact information**: How to get help and ask questions
- **Encouraging tone**: Welcoming message to make new players feel included

### Example Welcome Message

```
Привет Елизавета 🎾!
Добро пожаловать в наш padel чат!
У нас дружелюбная команда, и мы всегда рады новым участникам

🏓 Немного о нас:
— Играем несколько раз в неделю в лучших клубах Дубая
— Атмосфера — лёгкая, без негатива, играем с удовольствием
— Отношение друг к другу — уважительное и поддерживающее
— Есть разные уровни игры, чтобы всем было комфортно и интересно

🎯 Перед первой игрой, пожалуйста, ознакомься с нашими правилами...
🤝 Если ты не уверен, подходит ли тебе уровень — ничего страшного...
💬 Если есть вопросы — не стесняйся писать в чат или в личку...

До встречи на корте! 🏆
```

## Penalty System for Late Cancellations

The bot automatically detects when players try to cancel less than 24 hours before game time and warns them about penalty sanctions.

### How It Works

1. **Time Detection**: Bot parses game date and time from the message
2. **Cancellation Check**: When player clicks to cancel (❌ Не приду or same skill level), calculates time remaining
3. **24-Hour Rule**: If less than 24 hours remain, shows penalty warning instead of processing cancellation
4. **Warning Message**: Displays popup alert with penalty information

### Penalty Warning Message

When a late cancellation is attempted, players see:

```
⚠️ ВНИМАНИЕ! До игры осталось [X] часов.

Согласно правилам группы, отмена менее чем за 24 часа до игры влечет штрафные санкции.

Подробности в правилах участия в группе.

Вы все еще хотите отменить участие?
```

### Features

- **Automatic Detection**: No manual intervention required
- **Precise Timing**: Calculates exact hours remaining using Dubai timezone
- **Clear Warning**: Shows remaining time and references group rules
- **Prevention Focus**: Warning shown instead of immediate cancellation
- **Flexible Implementation**: Can be easily modified for different time thresholds

### Technical Details

- **Time Parsing**: Extracts date/time from game messages using regex
- **Timezone Handling**: Properly handles Dubai (UTC+4) timezone conversion
- **Error Handling**: Gracefully handles malformed messages
- **Performance**: Efficient parsing with minimal overhead

## Calendar & Location Integration

### Google Calendar Links

Each game message includes a direct link to add the event to Google Calendar with:

- **Correct timing**: Automatically converted from Dubai timezone to UTC
- **Event title**: "Padel - [Club Name]"
- **Location**: Club name for easy reference

### Interactive Maps

Club names are clickable links that open Google Maps:

- **SANDDUNE PADEL CLUB Al Qouz**: [Maps Link](https://maps.app.goo.gl/GZgQCpsX1uyvFwLB7?g_st=ipc)
- **Oxygen Padel Sport Academy**: [Maps Link](https://maps.app.goo.gl/cH1EZrrpbuYVWsMY6?g_st=ipc)

### Adding New Locations

To add a new club location, update the `CLUB_LOCATIONS` object in `src/app/lib/telegram/constants.ts`:

```typescript
export const CLUB_LOCATIONS = {
  "SANDDUNE PADEL CLUB Al Qouz":
    "https://maps.app.goo.gl/GZgQCpsX1uyvFwLB7?g_st=ipc",
  "Oxygen Padel Sport Academy":
    "https://maps.app.goo.gl/cH1EZrrpbuYVWsMY6?g_st=ipc",
  "New Club Name": "https://maps.app.goo.gl/your-new-link",
} as const;
```

## Customizing Game Schedule

The bot automatically generates dates for the upcoming week. To update the weekly games template, modify the `getWeeklyGames()` function in `src/app/api/telegram/create-poll/route.ts`:

```typescript
function getWeeklyGames() {
  const dates = getUpcomingWeekDates();

  return [
    {
      day: "Вторник",
      date: dates.tuesday, // Automatically calculated
      time: "8:00-09:30",
      club: "SANDDUNE PADEL CLUB Al Qouz",
      price: "65 aed/чел",
      courts: 2,
      note: "Optional note",
      cancelled: false, // Set to true to mark as cancelled
    },
    // Add more games...
  ];
}
```

**Dynamic Date Generation**: The bot automatically calculates dates for the upcoming week:

- Tuesday = Next Monday + 1 day
- Thursday = Next Monday + 3 days
- Saturday = Next Monday + 5 days

## Error Handling & Resilience

The bot includes robust error handling for common Telegram API issues:

### Rate Limiting (429 Errors)

- **Automatic Retry**: Respects `retry_after` parameter from Telegram
- **Exponential Backoff**: Progressive delays for subsequent retries
- **Max Retries**: Up to 3 attempts before giving up

### Network Errors

- **Retry Logic**: Automatic retry for network timeouts and server errors
- **Graceful Degradation**: Bot continues working even if some operations fail
- **Comprehensive Logging**: All errors are logged for debugging

### Message Delays

- **500ms delays** between consecutive messages to avoid rate limits
- **Smart batching** of operations where possible

## AI Integration

The bot uses OpenAI's [GPT-4.1 Nano](https://platform.openai.com/docs/models/gpt-4.1-nano) model for humor generation with the following configuration:

- **Model**: `gpt-4.1-nano-2025-04-14`
- **System Prompt**: "Ты весёлый бот клуба мафии LaFamilia. Отвечай на сообщения короткой шуткой или дружеской подколкой на русском языке."
- **Parameters**:
  - `max_tokens`: 60
  - `temperature`: 0.9

The bot provides contextual responses by including previous message content when users reply to bot messages, enabling more relevant humor generation.
