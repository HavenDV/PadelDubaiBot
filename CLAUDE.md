# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Development Commands

### Primary Commands
- `npm run dev` - Start development server with Turbopack
- `npm run build` - Build production bundle
- `npm run lint` - Run ESLint for code quality

### Supabase Database Commands
- `npm run supabase:start` - Start local Supabase instance
- `npm run supabase:stop` - Stop local Supabase instance
- `npm run supabase:reset` - Reset local database
- `npm run supabase:types` - Generate TypeScript types from local schema
- `npm run supabase:types:remote` - Generate TypeScript types from remote schema
- `npm run migration:new` - Create new migration file
- `npm run migration:up` - Apply pending migrations

### Development Tools
- `npm run tunnel` - Expose local dev server via devtunnel (for webhook testing)
- `npm run tunnel2` - Expose local dev server via ngrok (alternative)

## Architecture Overview

### Core Structure
This is a **Telegram Bot for Padel Game Organization** built with:
- **Next.js 15** with App Router (Server Components by default)
- **TypeScript** for type safety
- **Supabase** for authentication and database
- **Telegram Bot API** for chat interactions
- **OpenAI GPT-4.1 Nano** for AI-powered responses
- **Edge Runtime** for zero cold-start webhook responses

### Key Directories
- `src/app/api/telegram/` - Telegram webhook and API endpoints
- `src/app/lib/telegram/` - Core Telegram bot logic and utilities
- `src/app/lib/supabase/` - Database client and queries
- `src/app/components/` - React components for admin interface
- `src/app/hooks/` - Custom React hooks including Telegram event handling
- `src/app/contexts/` - React context providers for global state
- `supabase/` - Database schema, migrations, and RLS policies

### Telegram Bot Architecture
The bot uses a **data-first architecture** with clear separation:

1. **TelegramAPI** (`api.ts`) - Low-level Telegram API wrapper with retry logic
2. **GameDataManager** (`game-data.ts`) - Parses and manages game state from messages
3. **MessageFormatter** (`message-formatter.ts`) - Formats messages and handles player registration
4. **AdminUtils** (`constants.ts`) - Admin permissions and controls
5. **Types** (`types.ts`) - TypeScript interfaces for all data structures

### Key Features
- **Skill-based registration** (E, D, D+, C-, C, C+)
- **Automatic waitlist management** (4 players max per game)
- **Admin controls** via private messages (cancel/restore games, statistics)
- **Late cancellation penalties** (24-hour rule enforcement)
- **Calendar integration** (Google Calendar links)
- **Location mapping** (Google Maps integration)
- **AI responses** when bot is mentioned
- **Welcome messages** for new group members
- **Dynamic theme support** (responds to Telegram theme changes in real-time)
- **Telegram Mini App integration** (custom hooks for event handling)

## Database Schema (Supabase)

### Core Tables
- `users` - User profiles with Telegram data
- `locations` - Padel club locations
- `bookings` - Game bookings and registration
- `registrations` - Player registrations per game

### Row Level Security (RLS)
All tables use RLS policies for secure data access. Admin users have elevated permissions.


## Environment Variables Required

```bash
TELEGRAM_BOT_TOKEN=<bot_token_from_botfather>
CHAT_ID=<telegram_group_chat_id>
OPENAI_API_KEY=<openai_api_key>
NEXT_PUBLIC_SUPABASE_URL=<supabase_project_url>
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_DEFAULT_KEY=<supabase_anon_key>
```

## Deployment (Vercel)

- Uses `vercel.json` for configuration
- Edge Runtime for webhook endpoints
- Cron job runs weekly at 8 AM Dubai time (`0 8 * * 1`)
- 60-second timeout for webhook processing

## Admin Configuration

Admin user IDs are configured in `src/app/lib/telegram/constants.ts`:
```typescript
export const ADMIN_USER_IDS = [
  // Add Telegram user IDs here
] as const;
```

## Telegram Mini App Hooks

Custom React hooks for clean Telegram WebApp event handling:

### Core Event Hook
```typescript
import { useTelegramEvent } from "@/app/hooks/useTelegramEvent";

// Basic usage
useTelegramEvent("themeChanged", () => {
  console.log("Theme changed!");
});

// With options
useTelegramEvent("mainButtonClicked", handleClick, webApp, {
  enabled: isReady,
  debug: true
});
```

### Specialized Hooks
```typescript
// Theme changes with data
useTelegramThemeEvent(({ themeParams, colorScheme }) => {
  setAppTheme(themeParams);
  setColorScheme(colorScheme);
});

// Viewport changes
useTelegramViewportEvent(({ height, is_expanded }) => {
  adjustLayout(height, is_expanded);
});

// Multiple events
useTelegramEvents([
  { eventType: "backButtonClicked", handler: goBack },
  { eventType: "settingsButtonClicked", handler: openSettings }
]);
```

### Available Events
- `themeChanged` - Theme/color scheme changes
- `viewportChanged` - Viewport size changes  
- `mainButtonClicked` - Main button clicks
- `backButtonClicked` - Back button clicks
- `settingsButtonClicked` - Settings button clicks
- `invoiceClosed` - Payment invoice closed
- `popupClosed` - Popup closed
- And more...

## Code Conventions

- Use Server Components by default (mark Client Components with `'use client'`)
- Follow Next.js App Router patterns
- Place Telegram logic in `src/app/lib/telegram/`
- Use Telegram event hooks for WebApp event handling
- Use TypeScript interfaces from `types.ts`
- Handle errors gracefully with proper logging
- Implement rate limiting for Telegram API calls
- Use Supabase RLS for data security

## Key Files to Understand

- `src/app/api/telegram/webhook/route.ts` - Main webhook handler
- `src/app/lib/telegram/constants.ts` - Configuration and admin settings
- `src/app/lib/telegram/game-data.ts` - Game state management
- `supabase/migrations/` - Database schema changes
- `vercel.json` - Deployment and cron configuration