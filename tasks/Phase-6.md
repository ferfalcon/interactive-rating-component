# Phase 6 — Implement Validation

**Status:** Pending  
**Application root:** `vanilla/`  
**Depends on:** Phase 5 complete

## Objective

Provide one predictable, accessible missing-selection validation path that keeps the user in the rating view and places focus at the repair target.

## Expected outcome

Submitting without a selection reveals and announces the exact error, focuses the first radio, and clears cleanly when a value is selected.

## Source of truth

- `SPEC.md` validation presentation and AC-005/AC-006.
- `PLAN.md` sections 7.4, 8.3, and Phase 6.
- Modern form guidance for enabled submit buttons and post-interaction errors.

## Locked decisions

- Keep `<form novalidate>` and required radio semantics.
- Use the existing `role="alert"` paragraph.
- Focus the first radio, not the error.
- Do not reserve error space while hidden.
- Do not duplicate alerts, listeners, or markup.

## Tasks

- [ ] Bind one form submit handler and call `preventDefault()`.
- [ ] Read the selected rating from `FormData`.
- [ ] Validate the value with `isRatingValue()`.
- [ ] When absent, keep `state.view` as `rating`.
- [ ] Set `state.validationMessage` to `Please select a rating before submitting.`
- [ ] Reveal `#rating-error` without replacing the view.
- [ ] Apply `aria-invalid="true"` to all rating radios.
- [ ] Retain the fieldset’s `aria-describedby="rating-error"` association.
- [ ] Focus the first radio after revealing the alert.
- [ ] On a valid change, clear the state message and hide the alert.
- [ ] Remove `aria-invalid` from every radio when corrected.
- [ ] Use `8px` between the group and visible error.
- [ ] Use `16px` between the visible error and submit.
- [ ] Retain the original major group-to-submit gap when the error is hidden.
- [ ] Allow the card to grow intrinsically.
- [ ] Submit invalid state repeatedly and confirm stable DOM/listener counts.

## Verification

- Submit a fresh form and inspect visible text, alert semantics, invalid attributes, and active element.
- Select a value and confirm all error state clears immediately.
- Repeat invalid submission without page reload.
- Test at mobile and desktop widths and at enlarged text.
- Run `pnpm build`.

## Required evidence

- Invalid-state screenshots at mobile and desktop widths.
- Accessibility-tree/error association inspection.
- Focus assertion.
- Repeated-submission DOM count.

## Exit criteria

- [ ] Invalid submission never changes views.
- [ ] The exact error is visible and announced.
- [ ] The first radio receives focus.
- [ ] Selection clears all validation state.
- [ ] The card grows without clipping or wrapping the rating row.

## Relevant acceptance criteria

- AC-005 invalid submission.
- AC-006 validation recovery.

## Non-goals

- Server validation or submission.
- Disabled submit state.
- Error icon or persistent reserved space.
- Thank-you rendering.
