# Phase 1 — Replace the Vite Starter Scaffold

**Status:** Pending  
**Application root:** `vanilla/`  
**Depends on:** Phase 0 complete

## Objective

Remove the Vite demonstration UI and establish the final application module and CSS structure without implementing the rating experience.

## Expected outcome

The project builds an empty, stable rating-app shell with no starter imports, assets, counter behavior, or demo content.

## Source of truth

- `PLAN.md` sections 3–6 and Phase 1.
- `SPEC.md` architecture and technical constraints.
- Existing `tsconfig.json` settings.

## Locked decisions

- Public API: `mountRatingApp(root: HTMLElement): void`.
- `main.ts` only imports fonts/styles, resolves `#app`, and mounts the app.
- State and rendering live in `rating-app.ts`; types live in `rating-types.ts`.
- CSS entry order is reset, tokens, then app styles.
- No framework, router, or repository-root migration.

## Tasks

- [ ] Rename the package to `interactive-rating-component`.
- [ ] Add `packageManager: "pnpm@11.10.0"`.
- [ ] Add the Node engine constraint `^20.19.0 || >=22.12.0`.
- [ ] Preserve the existing Vite, TypeScript, and pnpm workflow.
- [ ] Update `<title>` to `Interactive rating component`.
- [ ] Add a concise meta description for the rating experience.
- [ ] Replace `src/main.ts` with safe `#app` resolution and a call to `mountRatingApp`.
- [ ] Throw a clear initialization error if `#app` is absent.
- [ ] Add `src/rating-types.ts` with `RATING_VALUES`, literal-union types, `AppState`, and `isRatingValue()`.
- [ ] Add `src/rating-app.ts` exporting only `mountRatingApp`.
- [ ] Mount one stable `<main class="rating-app">` inside `#app`.
- [ ] Add `src/styles/reset.css`, `tokens.css`, and `app.css`.
- [ ] Convert `src/style.css` into the single ordered CSS import entry.
- [ ] Remove `counter.ts`, starter markup, and all starter imports.
- [ ] Remove `hero.png`, `typescript.svg`, `vite.svg`, and `public/icons.svg` after confirming nothing references them.
- [ ] Add `test-results/`, `playwright-report/`, and `blob-report/` to `vanilla/.gitignore`.
- [ ] Run TypeScript checking and the production build.

## Verification

```bash
cd vanilla
pnpm build
rg -n "Get started|setupCounter|viteLogo|typescriptLogo|heroImg" src index.html
```

The search must return no starter references.

## Required evidence

- Build output.
- Final source tree under `vanilla/src/`.
- Search showing no starter text or imports.
- Git diff limited to Phase 1 targets.

## Exit criteria

- [ ] No Vite demonstration content remains.
- [ ] `main.ts` contains no markup or rating business rules.
- [ ] The stable main landmark mounts successfully.
- [ ] TypeScript reports no unused code.
- [ ] `pnpm build` succeeds.

## Relevant acceptance criteria

- Supports AC-016 semantic controls and AC-020 production build in later phases.

## Non-goals

- Rating or thank-you markup.
- Final visual styling.
- Fonts and production design assets.
- Playwright configuration or tests.
