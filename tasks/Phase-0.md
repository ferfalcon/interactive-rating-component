# Phase 0 — Baseline and Source-of-Truth Audit

**Status:** Pending  
**Application root:** `vanilla/`  
**Depends on:** None

## Objective

Establish a reproducible baseline before implementation and record which design sources are authoritative. This phase must not change application or design-reference files.

## Expected outcome

The existing Vite starter runs and builds in a supported WSL toolchain, existing repository changes are preserved, and later phases have an unambiguous Figma baseline.

## Source of truth

1. Current Figma nodes `314:119`, `314:129`, `314:140`, and `314:149`.
2. `SPEC.md`, especially its source-priority rules and acceptance criteria.
3. Confirmed measurements and tokens in `DESIGN.md`.
4. Implementation decisions in `PLAN.md`.

The local rating screenshots are historical references only: they show rating `4` selected and `Placeholder`, while current Figma shows rating `3` checked, rating `4` hovered, and `SUBMIT`. Do not overwrite anything in `docs/design/`.

## Tasks

- [ ] Capture `git status --short` and note the existing untracked `docs/ai/` directory.
- [ ] Confirm no task targets or modifies user-owned changes.
- [ ] Run all project commands from `vanilla/` inside WSL.
- [ ] Confirm Vite requires Node `^20.19.0 || >=22.12.0`.
- [ ] Use Node `22.17.1` and pnpm `11.10.0`; if WSL still lacks Node, use a temporary Linux runtime under `/tmp` rather than Windows pnpm over the UNC path.
- [ ] Record `node --version` and `pnpm --version`.
- [ ] Run `pnpm install --frozen-lockfile` only if dependencies are missing or inconsistent.
- [ ] Run the unmodified Vite starter and load it in a browser.
- [ ] Check the browser console for errors and warnings.
- [ ] Run `pnpm build`.
- [ ] Record the build result and generated bundle summary.
- [ ] Confirm the four current Figma frame dimensions:
  - Mobile rating: `375 × 667`, card `327 × 353`.
  - Desktop rating: `768 × 800`, card `412 × 412`.
  - Mobile thank-you: `375 × 667`, card `327 × 360`.
  - Desktop thank-you: `768 × 800`, card `412 × 416`.
- [ ] Confirm no tracked file changed during the audit.

## Verification

```bash
git status --short
cd vanilla
node --version
pnpm --version
pnpm build
```

Manually verify that the starter loads and that browser console output is recorded.

## Required evidence

- Initial and final Git status.
- Node and pnpm versions.
- Successful baseline build output.
- Browser console findings.
- Written acknowledgement of the stale rating screenshots.

## Exit criteria

- [ ] The unmodified starter runs.
- [ ] The production build succeeds.
- [ ] No baseline warning is mistaken for an implementation regression.
- [ ] Current Figma and `SPEC.md` are locked as authoritative.
- [ ] `docs/ai/` and `docs/design/` remain untouched.

## Relevant acceptance criteria

This is a prerequisite phase for all `SPEC.md` acceptance criteria; it does not satisfy a product criterion by itself.

## Non-goals

- Updating documentation or screenshots.
- Replacing starter code.
- Installing application or testing dependencies.
- Creating production assets.
