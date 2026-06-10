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
- NEVER use unknown/any - only strong typed code.

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

- Secrets: Store in `.env` (e.g., `TELEGRAM_BOT_TOKEN`, `OPENAI_API_KEY`). Never commit secrets.
- Webhooks/Tunneling: Use `npm run tunnel` or `npm run tunnel2` to expose `localhost:3000` when needed.

<!-- BEGIN GENERATED PORTFOLIO CONTEXT -->

## Generated Repository Context

This section was generated from the GitHub repository inventory and local checkout to support future Codex work and portfolio analysis.

### Repository Metadata
- Remote: https://github.com/HavenDV/PadelDubaiBot
- Visibility: public
- Type: original; active
- Primary language: TypeScript
- Topics: None detected
- Last pushed: 2025-12-01T22:46:16Z
- Local path: /Users/havendv/GitHub/HavenDV/PadelDubaiBot
- Local note: standard checkout
- Classification: Web or app project

### Working Summary
A Telegram bot for organizing Padel games in Dubai with weekly schedules and skill-based registration system. Built with Next.js 15 and deployed on Vercel.

### Detected Structure
- Top-level items: `.claude/`, `.cursor/`, `.github/`, `.swc/`, `docs/`, `public/`, `src/`, `supabase/`, `.env`, `.gitignore`, `AGENTS.md`, `CLAUDE.md`, `database.types.gen.ts`, `database.types.ts`, `eslint.config.mjs`, `LICENSE`
- Sampled file count: 135
- Common extensions: .ts (61), .tsx (25), .sql (24), .md (6), [no extension] (4), .json (4), .svg (4), .mjs (2)

### Manifests And Commands
- package.json
- .github/workflows
- vercel.json
- supabase

Suggested commands:
- npm run dev
- npm run build
- npm run start
- npm run lint

Testing signal:
- No automated test entry point was detected by the generator.

### Portfolio Signals
- Skills: Next.js, React, TypeScript, Telegram bot development, OpenAI API integration, Supabase, GitHub Actions, Vercel deployment
- Portfolio angle: Good evidence for practical AI product integration and agent/chat workflow implementation.

### Agent Notes
- Prefer README and manifest instructions over generated assumptions when they disagree.
- Keep generated context current when build tooling, test commands, or project scope changes.
- Review private or client-specific details before copying portfolio claims into public material.

<!-- END GENERATED PORTFOLIO CONTEXT -->
