# Phase 5 — Implement Selection and Visual States

**Status:** Pending  
**Application root:** `vanilla/`  
**Depends on:** Phase 4 complete

## Objective

Add browser-native selection behavior, application-state synchronization, and the complete visual-state precedence for ratings and submit.

## Expected outcome

Exactly one rating can be selected, native keyboard behavior works, and checked, hover, and focus states coexist without re-rendering the form.

## Source of truth

- Current Figma demonstration: `3` checked and `4` hovered.
- `SPEC.md` interaction, keyboard, and state-precedence requirements.
- `PLAN.md` sections 4.3–4.4, 8.2, and 9.9.

## Locked decisions

- Native `checked` state drives CSS.
- State mirrors the selected value but does not drive selection rendering.
- Hover is CSS-only and never stored.
- Checked overrides hover; focus outline is independent.
- No animations or transitions.

## Tasks

- [ ] Initialize `AppState` with rating view, null selection, and null validation.
- [ ] Bind one rating-form `change` handler.
- [ ] Ignore change events not originating from a rating radio.
- [ ] Parse the changed value and narrow it with `isRatingValue()`.
- [ ] Update `state.selectedRating` without re-rendering.
- [ ] Add idle grey surface and secondary text styles.
- [ ] Add white unchecked hover under `@media (hover: hover)`.
- [ ] Ensure the hover selector uses `:not(:checked)`.
- [ ] Add white preview for an unchecked focused radio.
- [ ] Add orange surface for `:checked`.
- [ ] Preserve orange when a checked radio is hovered.
- [ ] Add a `2px` independent focus-visible outline with `3px` offset.
- [ ] Style submit orange by default and white on hover/active.
- [ ] Give submit its own visible focus outline.
- [ ] Verify touch does not depend on hover.

## Verification

- Select every value with a pointer.
- Focus the group and use arrows and Space.
- Confirm only one input is checked after changing selection.
- Select `3`, hover `4`, and inspect both computed surfaces.
- Hover the checked value and confirm it remains orange.
- Test submit focus, hover, and active states.

## Required evidence

- Selected-3/hovered-4 screenshot.
- Keyboard-operation notes.
- Checked-state DOM assertions.
- Computed focus outline.

## Exit criteria

- [ ] Exactly one rating can be checked.
- [ ] Selection can change without re-rendering.
- [ ] Native pointer, touch, arrow, and Space behavior works.
- [ ] Checked state survives hover.
- [ ] Focus is visible independently of surface color.

## Relevant acceptance criteria

- AC-002 single selection.
- AC-003 concurrent selected and hover states.
- AC-004 change selection.
- Supports AC-010 keyboard operation and AC-017 visible focus.

## Non-goals

- Missing-selection validation.
- Thank-you transition.
- Motion or custom keyboard handlers.
- Visual snapshot baselines.
