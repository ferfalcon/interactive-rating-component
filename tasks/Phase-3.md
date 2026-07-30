# Phase 3 — Build Tokens and Global Layout

**Status:** Pending  
**Application root:** `vanilla/`  
**Depends on:** Phase 2 complete

## Objective

Create the reset, token system, page centering, card surface, and single responsive breakpoint used by both application views.

## Expected outcome

The empty card shell has the correct dark palette, gradient, responsive width, radius, safe padding, and overflow behavior from `320px` through desktop widths.

## Source of truth

- `DESIGN.md` color, spacing, typography, and card measurements.
- `SPEC.md` sections 13–16.
- Figma frame dimensions recorded in Phase 0.

## Locked decisions

- Mobile-first CSS with one breakpoint at `48rem`.
- Semantic custom-property names rather than Figma variable names.
- `rem` for scalable dimensions; pixels only for thin borders/outlines.
- No fixed rating-card height and no absolute Figma viewport positioning.
- Gradient starts at `#232A34` and ends at `#181E27`.

## Tasks

- [ ] Implement inherited `box-sizing`.
- [ ] Remove default body, heading, paragraph, fieldset, and legend spacing.
- [ ] Inherit font on controls and make images block-level.
- [ ] Add an explicit `[hidden] { display: none !important; }` safeguard.
- [ ] Define page, card, surface, text, accent, and white color tokens.
- [ ] Define spacing tokens from `0` through `2.5rem`.
- [ ] Define mobile heading, body, control, and button typography tokens.
- [ ] Define card width, radius, major gap, control, badge, and illustration tokens.
- [ ] Add desktop token overrides at exactly `48rem`.
- [ ] Use `min-height: 100vh` followed by `min-height: 100svh`.
- [ ] Center content with a full-width application shell and `24px` safe page padding.
- [ ] Allow natural vertical growth and document scrolling.
- [ ] Add the shared top-centered radial gradient without a data-URI SVG.
- [ ] Set mobile maximum card width to `327px` and radius to `15px`.
- [ ] Set desktop card width to `412px` and radius to `30px`.
- [ ] Verify layouts at `320`, `375`, `767`, `768`, and `1440px`.

## Verification

- Inspect computed card width/radius on both sides of the breakpoint.
- Check that `document.documentElement.scrollWidth === document.documentElement.clientWidth` at `320px`.
- Run `pnpm build`.

## Required evidence

- Computed dimensions for the five target widths.
- Mobile and desktop shell screenshots.
- No-overflow result at `320px`.
- Build output.

## Exit criteria

- [ ] Page and card surfaces are visibly distinct.
- [ ] The breakpoint switches only at `48rem`.
- [ ] The card shrinks safely below `327px`.
- [ ] Short viewports scroll instead of clipping.
- [ ] No horizontal overflow exists.

## Relevant acceptance criteria

- Foundations for AC-011, AC-012, AC-013, and AC-014.

## Non-goals

- Rating or thank-you content.
- Intermediate breakpoints.
- Fixed card heights.
- Pixel tuning against final screenshots.
