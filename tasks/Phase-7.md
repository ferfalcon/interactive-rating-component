# Phase 7 — Implement the Thank-You Transition

**Status:** Pending  
**Application root:** `vanilla/`  
**Depends on:** Phase 6 complete

## Objective

Replace the rating card with the thank-you card after valid submission while preserving the stable landmark, dynamic value, and accessible focus.

## Expected outcome

All five ratings produce the correct thank-you message, focus moves to the heading, and refreshing resets the in-memory experience.

## Source of truth

- Figma thank-you nodes `314:140` and `314:149`.
- `SPEC.md` thank-you content, state, and focus requirements.
- `PLAN.md` sections 7.5, 8.4, and Phase 7.

## Locked decisions

- Only the active card is replaced.
- Dynamic result content is assigned with `textContent`.
- The heading has `tabindex="-1"`.
- Focus uses `preventScroll: true`.
- No route, history entry, storage, or request is created.

## Tasks

- [ ] Create the controlled thank-you template.
- [ ] Render the permanent illustration with empty alt text and explicit dimensions.
- [ ] Add `p.rating-result` for the dynamic sentence.
- [ ] Add the exact `Thank you!` heading and supporting paragraph.
- [ ] Validate the submitted rating again before transitioning.
- [ ] Set state view to `thank-you` and clear validation.
- [ ] Replace only the card within the existing `<main>`.
- [ ] Assign `You selected n out of 5` through `textContent`.
- [ ] Focus the rendered heading synchronously with `focus({ preventScroll: true })`.
- [ ] Use one queued microtask only if browser smoke testing proves synchronous focus unreliable.
- [ ] Implement mobile illustration `144 × 96` and card minimum `327 × 360`.
- [ ] Implement desktop illustration `162 × 108` and card minimum `412 × 416`.
- [ ] Verify result-pill and message wrapping.
- [ ] Verify ratings `1` through `5`.
- [ ] Reload from the thank-you state and confirm initial state returns.
- [ ] Inspect storage and network activity during submission.

## Verification

- Complete the flow separately for every rating value.
- Assert the active element is the thank-you heading.
- Reload and inspect unchecked initial state.
- Confirm localStorage/sessionStorage lengths are unchanged.
- Confirm submission creates no fetch/XHR or mutation request.

## Required evidence

- Mobile and desktop thank-you screenshots.
- Results for all five dynamic values.
- Focus and reset assertions.
- Storage and network inspection.

## Exit criteria

- [ ] No sample rating is hard-coded.
- [ ] Every valid value renders correctly.
- [ ] Focus moves to the thank-you heading.
- [ ] Refresh resets the app.
- [ ] No persistence, navigation, or submission request occurs.

## Relevant acceptance criteria

- AC-007 valid submission.
- AC-008 dynamic values.
- AC-009 focus after success.
- AC-018 state reset.
- AC-019 no unsupported persistence.

## Non-goals

- Rate-again control.
- Browser routing or history.
- Backend submission.
- Page-transition animation.
