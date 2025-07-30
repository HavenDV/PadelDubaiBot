# PadelDubaiBot 🏓

A Telegram bot for organizing Padel games in Dubai with weekly schedules and skill-based registration system. Built with Next.js 15 and deployed on Vercel.

## Features

- **Weekly Schedule**: Automatically posts weekly padel game schedule every Monday at 8 AM (Dubai time)
- **Individual Game Messages**: Each game gets its own message with registration buttons
- **Skill-Based Registration**: Players can register with their skill level (D-, D, D+, C-)
- **Automatic Waitlist**: When 4+ players register, additional players go to waitlist
- **Smart Player Management**: Automatic promotion from waitlist when someone cancels
- **Notification System**: Tagged messages when players move between main list and waitlist
- **Automatic Formatting**: Numbered lists with player names and skill levels
- **Multi-timezone Support**: Configured for Dubai timezone
- **Cancellation Support**: Games can be marked as cancelled
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

Players can register for games by selecting their skill level:

- **D- (Beginner)**: New to padel
- **D (Intermediate)**: Basic skills
- **D+ (Advanced)**: Good technique
- **C- (Expert)**: High skill level

### Waitlist System

- **Main Game**: Maximum 4 players per game
- **Waitlist**: Players 5+ automatically go to waitlist
- **Automatic Promotion**: When someone cancels, first waitlist player moves to main game
- **Notifications**: Tagged messages notify both canceling and promoted players

**Example notifications:**

```
🔄 @user1 отменил участие, @user2 переходит в основной состав с Waitlist!
❌ @user1 отменил участие
```

_Note: No notifications are sent when players cancel from waitlist_

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

## AI Integration

The bot uses OpenAI's [GPT-4.1 Nano](https://platform.openai.com/docs/models/gpt-4.1-nano) model for humor generation with the following configuration:

- **Model**: `gpt-4.1-nano-2025-04-14`
- **System Prompt**: "Ты весёлый бот клуба мафии LaFamilia. Отвечай на сообщения короткой шуткой или дружеской подколкой на русском языке."
- **Parameters**:
  - `max_tokens`: 60
  - `temperature`: 0.9

The bot provides contextual responses by including previous message content when users reply to bot messages, enabling more relevant humor generation.
