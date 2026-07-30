# Phase 8 — Responsive and Visual Refinement

**Status:** Pending  
**Application root:** `vanilla/`  
**Depends on:** Phase 7 complete

## Objective

Calibrate both views against current Figma and verify resilient behavior at breakpoint boundaries, narrow widths, short heights, and zoom.

## Expected outcome

The implementation matches all four authoritative frames within normal browser rendering differences without sacrificing intrinsic sizing or accessibility.

## Source of truth

- Current Figma nodes `314:119`, `314:129`, `314:140`, and `314:149`.
- `SPEC.md` responsive and visual acceptance criteria.
- Measurements in `DESIGN.md`.

## Locked decisions

- Do not use stale local rating screenshots for fidelity decisions.
- Do not overwrite `docs/design/`.
- Preserve the single `48rem` breakpoint.
- Do not add fixed rating-card height or absolute viewport offsets.
- Validation is an approved extension governed by `SPEC.md`.

## Tasks

- [ ] Obtain fresh screenshots of the four Figma frame nodes.
- [ ] Capture implementation screenshots at `375 × 667` and `768 × 800`.
- [ ] Compare card position, size, radius, gradient, and page background.
- [ ] Compare heading/body fonts, line heights, weights, and wrapping.
- [ ] Compare badge, illustration, controls, button, and result-pill dimensions.
- [ ] Tune gradient origin, size, and stop distribution.
- [ ] Tune content widths and effective fractional desktop insets through centering.
- [ ] Verify distributed radio spacing without fixed gaps.
- [ ] Compare the selected-3/hovered-4 demonstration.
- [ ] Review the custom validation state at both reference widths.
- [ ] Test `320px`, `767px`, `768px`, and `1440px`.
- [ ] Test a short mobile landscape viewport.
- [ ] Manually test `200%` browser zoom.
- [ ] Test `400%` zoom/effective `320px` reflow.
- [ ] Confirm no text, control, or focus outline clips or overlaps.
- [ ] Confirm the document scrolls vertically when required.

## Verification

- Use side-by-side or overlay comparison for the four reference frames.
- Check `scrollWidth` against `clientWidth` at each resilience width.
- Exercise both normal and validation states.
- Run `pnpm build`.

## Required evidence

- Four implementation screenshots and corresponding Figma captures.
- Measurement/comparison notes.
- Breakpoint-boundary screenshots.
- Zoom, landscape, and no-overflow results.

## Exit criteria

- [ ] Both views match current Figma at reference sizes.
- [ ] The `767px`/`768px` switch is correct.
- [ ] No horizontal overflow exists at `320px`.
- [ ] Zoom and short viewports preserve all content and controls.
- [ ] No fidelity fix introduces fixed-height clipping.

## Relevant acceptance criteria

- AC-011 mobile fidelity.
- AC-012 desktop fidelity.
- AC-013 narrow viewport resilience.
- AC-014 zoom resilience.

## Non-goals

- Replacing design-reference files.
- Adding intermediate breakpoints.
- Approving regression snapshots before visual comparison.
- Changing product copy or interaction behavior.
