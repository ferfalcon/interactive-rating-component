# Repository Guidelines

## Project Structure & Module Organization

This repository contains an interactive rating component project. The runnable app lives in `vanilla/`, a Vite + TypeScript project. Source files are under `vanilla/src/`, with `main.ts` as the browser entry point and `style.css` for global styling. Static public assets belong in `vanilla/public/`; source-imported assets belong in `vanilla/src/assets/`. Design references, screenshots, and supporting documentation are in `docs/`, with product notes in `SPEC.md`, `DESIGN.md`, and `PLAN.md`.

## Build, Test, and Development Commands

Run commands from `vanilla/`.

- `pnpm install` installs dependencies from `pnpm-lock.yaml`.
- `pnpm dev` starts the Vite development server with hot module reload.
- `pnpm build` runs TypeScript checking, then creates a production build.
- `pnpm preview` serves the production build locally for verification.

## Coding Style & Naming Conventions

Use TypeScript modules and keep browser behavior in `src/*.ts`. Prefer clear function names such as `setupRatingForm` and descriptive DOM ids/classes tied to component roles. Follow the existing style: two-space indentation in JSON, single quotes in TypeScript imports, semicolon-free TypeScript, CSS custom properties in `:root`, and mobile-first responsive CSS. Keep assets named with lowercase, hyphenated filenames such as `icon-star.svg`.

## Testing Guidelines

No automated test framework is currently configured. Before submitting changes, run `pnpm build` and manually verify the rating flow: responsive layout, hover/focus states, rating selection, submit behavior, and thank-you state. If tests are added later, place them near the relevant source or in a dedicated `tests/` directory, and document the new test command here.

## Commit & Pull Request Guidelines

Recent history mostly uses concise Conventional Commit-style messages, for example `feat: add Vite, and TypeScript support` and `doc: add functional and technical specification`. Use `feat:`, `fix:`, `doc:`, or similar prefixes with a short imperative summary. Pull requests should include a brief description, verification steps, linked issues when applicable, and screenshots or screen recordings for visual changes across desktop and mobile.

## Agent-Specific Instructions

Do not overwrite design references in `docs/design/`. Keep generated implementation changes scoped to `vanilla/` unless documentation updates are explicitly part of the task.
