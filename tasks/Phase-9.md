# Phase 9 — Accessibility Hardening

**Status:** Pending  
**Application root:** `vanilla/`  
**Depends on:** Phase 8 complete

## Objective

Harden the completed experience for keyboard, assistive technology, forced colors, touch, zoom, font failure, and image failure before automated accessibility tooling is added.

## Expected outcome

The complete interaction remains understandable and operable across supported accessibility and resilience modes, with manual evidence recorded.

## Source of truth

- `SPEC.md` sections 10, 11, 16, and 20.4.
- `PLAN.md` accessibility plan and Phase 9.
- WCAG 2.2 Level AA requirements within component scope.

## Locked decisions

- Native radio keyboard behavior remains untouched.
- Focus goes to the first radio after invalid submission and the heading after success.
- Forced-colors styling uses system colors.
- Automated axe claims belong to Phase 10.
- Manual gaps are recorded rather than silently claimed as passed.

## Tasks

- [ ] Complete the entire flow using only Tab, Shift+Tab, arrows, Space, and Enter.
- [ ] Inspect the accessibility tree for landmark and heading structure.
- [ ] Verify group name, option names, required state, and checked announcements.
- [ ] Verify validation alert announcement and error association.
- [ ] Verify thank-you heading announcement and focus order.
- [ ] Confirm decorative assets are excluded from accessible naming.
- [ ] Add `@media (forced-colors: active)`.
- [ ] Give every rating label a visible system-color boundary.
- [ ] Give checked state a system-color boundary distinct from focus.
- [ ] Use `Highlight` or equivalent system color for focus.
- [ ] Keep submit visibly button-like in forced colors.
- [ ] Do not disable forced-color adjustment globally.
- [ ] Test touch/emulated touch with no hover dependency.
- [ ] Block font files and check fallback wrapping and overflow.
- [ ] Block images and confirm all essential information remains.
- [ ] Recheck `200%` and `400%` zoom plus short viewports.
- [ ] Run an available screen-reader smoke test.
- [ ] Create `vanilla/REVIEW.md`.
- [ ] Record OS, browser versions, screen reader, test results, unavailable environments, and unresolved findings.

## Verification

- Keyboard-only manual pass.
- Browser accessibility-tree inspection.
- Forced-colors screenshots for idle, checked, focused, and submit states.
- Font/image-blocking and touch results.
- Review record inspection.

## Required evidence

- Completed `vanilla/REVIEW.md` entries.
- Forced-colors screenshots.
- Keyboard and accessibility-tree notes.
- Screen-reader result or explicit unavailable status.

## Exit criteria

- [ ] Complete flow works without a pointer.
- [ ] Names, states, errors, and success are exposed correctly.
- [ ] Checked and focus states remain distinguishable in forced colors.
- [ ] Zoom, font failure, image failure, and touch preserve function.
- [ ] Manual findings are resolved or recorded.

## Relevant acceptance criteria

- AC-009 focus after success.
- AC-010 keyboard operation.
- AC-014 zoom resilience.
- AC-016 semantic controls.
- AC-017 visible focus.

## Non-goals

- Claiming automated axe coverage.
- Custom keyboard logic.
- Product or visual redesign.
- Cross-browser automated test configuration.
