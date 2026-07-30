# Phase 10 — Automated Tests and Production Verification

**Status:** Pending  
**Application root:** `vanilla/`  
**Depends on:** Phases 0–9 complete

## Objective

Add browser-level regression coverage, accessibility scanning, visual baselines, focused cross-browser smokes, and final production evidence.

## Expected outcome

Build, behavior, accessibility, visual regression, Chromium coverage, Firefox/WebKit smokes, and production preview all pass through documented commands.

## Source of truth

- `SPEC.md` testing requirements and AC-001 through AC-020.
- `PLAN.md` sections 14–15 and Phase 10.
- Approved Phase 8 visual comparisons.

## Locked decisions

- Chromium runs the full suite and owns visual snapshots.
- Firefox and WebKit run a focused initial-select-submit-success smoke flow.
- Playwright is the only test runner.
- Axe must report no serious or critical violations.
- Visual snapshots use strict regression defaults, not broad diff tolerances.

## Tasks

- [ ] Add `@playwright/test` and `@axe-core/playwright`.
- [ ] Configure a fixed localhost base URL and strict Vite port.
- [ ] Reuse an existing server outside CI and retain traces/screenshots on failure.
- [ ] Add a Chromium full-suite project.
- [ ] Add Firefox and WebKit smoke projects restricted to the smoke spec.
- [ ] Install Chromium, Firefox, and WebKit binaries.
- [ ] Add exact scripts named `test`, `test:headed`, `test:update-snapshots`, and `test:smoke`.
- [ ] Make `check` run build, Chromium tests, and Firefox/WebKit smokes.
- [ ] Add `tests/rating-flow.spec.ts`.
- [ ] Test initial state, all values, single selection, changing selection, concurrent hover, validation, focus, dynamic result, reload, storage, and network behavior.
- [ ] Add `tests/accessibility.spec.ts`.
- [ ] Test landmarks, heading count, native controls, shared name, legend, option names, keyboard flow, focus, and decorative images.
- [ ] Run axe and fail on serious or critical violations.
- [ ] Add `tests/visual.spec.ts`.
- [ ] Cover mobile/desktop rating, mobile/desktop thank-you, selected-3/hovered-4, and validation.
- [ ] Generate baselines only from the Phase 8-approved UI.
- [ ] Add a focused Firefox/WebKit smoke spec.
- [ ] Run `pnpm build`, Chromium tests, browser smokes, and `pnpm check`.
- [ ] Run `pnpm preview` and complete the flow against production output.
- [ ] Inspect production console and network activity.
- [ ] Update `vanilla/REVIEW.md` with commands, versions, results, and remaining limitations.

## Verification

```bash
cd vanilla
pnpm build
pnpm test
pnpm test:smoke
pnpm check
pnpm preview
```

## Required evidence

- Full command output and browser versions.
- Passing Playwright report.
- Axe results.
- Committed Chromium snapshot inventory.
- Production preview console/network notes.
- Completed final `vanilla/REVIEW.md`.

## Exit criteria

- [ ] Production build passes.
- [ ] Full Chromium suite passes.
- [ ] Firefox and WebKit smoke flows pass.
- [ ] Axe has no serious or critical violations.
- [ ] Approved visual snapshots pass unchanged.
- [ ] Production preview has no console errors or submission requests.
- [ ] Every `SPEC.md` acceptance criterion has automated or recorded manual evidence.

## Relevant acceptance criteria

- Automates or verifies AC-001 through AC-020.
- Specifically closes AC-015 permanent assets, AC-019 no persistence, and AC-020 production build.

## Non-goals

- Deployment or CI workflow creation.
- Additional unit-test framework.
- Broad cross-browser visual snapshots.
- Relaxed screenshot tolerances that hide real drift.
