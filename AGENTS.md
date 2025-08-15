# Repository Guidelines

## Project Structure & Module Organization
- Root: Next.js + TypeScript app with Jest tests and Supabase.
- Source: `src/app/` (routes, `layout.tsx`, `page.tsx`, styles in `globals.css`).
- Tests: `__tests__/` with `*.test.ts` unit/integration tests.
- Config: `eslint.config.mjs`, `jest.config.js`, `tsconfig.json`, `next.config.ts`.
- Assets: `public/` for static files.
- Database: `supabase/` (migrations in `supabase/migrations`, schemas in `supabase/schemas`).

## Build, Test, and Development Commands
- `npm run dev`: Start local dev server (Next.js, port 3000).
- `npm run build`: Production build.
- `npm start`: Run production server.
- `npm run lint`: Lint with Next.js ESLint config.
- `npm test` | `npm run test:watch` | `npm run test:coverage`: Run Jest tests (ts-jest), watch mode, or coverage.
- Supabase (local dev): `npm run supabase:start`, `supabase:stop`, `supabase:reset`, `supabase:types`.

## Coding Style & Naming Conventions
- Language: TypeScript (`.ts`/`.tsx`). Indentation: 2 spaces.
- Linting: ESLint (`next/core-web-vitals`, `next/typescript`). Fix issues before PRs.
- Components: PascalCase for React components and files (e.g., `AddLocationModal.tsx`).
- Tests: Match source behavior; colocated in `__tests__` with `*.test.ts`.
- Imports: Prefer absolute paths from project root when applicable; keep groups ordered (libs, components, local).

## Testing Guidelines
- Framework: Jest with `ts-jest`, `testEnvironment: node`.
- Location/Pattern: `__tests__/**/*.test.ts`.
- Coverage: Reports generated to `coverage/` (text, lcov, html). No strict threshold enforced; cover core logic and edge cases.
- Run: `npm test` locally; ensure deterministic tests and avoid network calls.

## Commit & Pull Request Guidelines
- Commits: Conventional style observed (`feat:`, `fix:`, `refactor:`). Keep messages imperative and scoped.
- PRs: Include clear description, linked issues, screenshots for UI changes, and testing notes.
- Checks: Run `npm run lint` and `npm test` before opening a PR.

## Security & Configuration
- Secrets: Store in `.env` (e.g., `TELEGRAM_BOT_TOKEN`, `TELEGRAM_CHAT_ID`, `OPENAI_API_KEY`). Do not commit secrets.
- Tunneling (optional for webhooks): `npm run tunnel` or `npm run tunnel2` to expose `localhost:3000`.
