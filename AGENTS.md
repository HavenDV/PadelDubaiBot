# Repository Guidelines

## Project Structure & Module Organization
- Root: Next.js + TypeScript app with Supabase and Jest.
- Source: `src/app/` (route folders, `layout.tsx`, `page.tsx`, styles in `globals.css`).
- Tests: `__tests__/**/*.test.ts` for unit/integration tests.
- Config: `eslint.config.mjs`, `jest.config.js`, `tsconfig.json`, `next.config.ts`.
- Assets: `public/` for static files.
- Database: `supabase/` (migrations in `supabase/migrations`, schemas in `supabase/schemas`).

## Build, Test, and Development Commands
- `npm run dev`: Start local Next.js dev server on `http://localhost:3000`.
- `npm run build`: Create production build.
- `npm start`: Run the production server.
- `npm run lint`: Lint using Next.js ESLint config; fix issues before PRs.
- `npm test` | `npm run test:watch` | `npm run test:coverage`: Run Jest tests, watch mode, or coverage report.
- Supabase: `npm run supabase:start` | `supabase:stop` | `supabase:reset` | `supabase:types` for local DB/dev.

## Coding Style & Naming Conventions
- Language: TypeScript; 2-space indentation.
- Linting: ESLint (`next/core-web-vitals`, `next/typescript`). Keep imports ordered: libs, components, local.
- Components: PascalCase for files/components (e.g., `AddLocationModal.tsx`).
- Tests: Mirror source behavior; colocate in `__tests__/` with `*.test.ts`.
- Imports: Prefer absolute paths from project root when practical.

## Testing Guidelines
- Framework: Jest with `ts-jest` (`testEnvironment: node`).
- Location/Pattern: `__tests__/**/*.test.ts`.
- Coverage: Outputs to `coverage/` (text, lcov, html). No strict thresholds; cover core logic and edge cases.
- Practices: Make tests deterministic; avoid network calls—mock Supabase/external APIs.

## Commit & Pull Request Guidelines
- Commits: Use Conventional Commits (`feat:`, `fix:`, `refactor:`). Keep messages imperative and scoped.
- PRs: Provide clear description, link issues, add screenshots for UI changes, and include testing notes.
- Checks: Run `npm run lint` and `npm test` locally before opening a PR.

## Security & Configuration
- Secrets: Store in `.env` (e.g., `TELEGRAM_BOT_TOKEN`, `TELEGRAM_CHAT_ID`, `OPENAI_API_KEY`). Never commit secrets.
- Webhooks/Tunneling: Use `npm run tunnel` or `npm run tunnel2` to expose `localhost:3000` when needed.
