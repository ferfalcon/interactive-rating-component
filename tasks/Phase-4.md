# Phase 4 — Implement the Static Rating View

**Status:** Pending  
**Application root:** `vanilla/`  
**Depends on:** Phase 3 complete

## Objective

Render the complete semantic rating form and match its static mobile and desktop composition before adding selection or submission behavior.

## Expected outcome

The initial view contains exact copy, five unchecked native radios, a submit button, and the correct responsive card geometry.

## Source of truth

- Figma rating nodes `314:119` and `314:129`.
- `SPEC.md` content, form semantics, and responsive requirements.
- `PLAN.md` markup plan and Phase 4.

## Locked decisions

- Exact heading: `How did we do?`
- Exact supporting and button copy from `SPEC.md`.
- Legend: `Choose a rating from 1 to 5`.
- Shared radio name: `rating`.
- Accessible option names: `n out of 5`.
- No value is checked initially.

## Tasks

- [ ] Render `article.card.card--rating`.
- [ ] Add the decorative star image inside a CSS circular badge.
- [ ] Use empty alt text and explicit intrinsic dimensions for the star.
- [ ] Add a native `<form novalidate>`.
- [ ] Add one `<h1>` and the exact supporting paragraph.
- [ ] Add a reset native `<fieldset>` and visually hidden `<legend>`.
- [ ] Render values from `RATING_VALUES` in DOM order.
- [ ] Give each radio a stable id, shared name, numeric value, and `required`.
- [ ] Associate every input with a `<label for>`.
- [ ] Put the visible number in an `aria-hidden` span.
- [ ] Put the full `n out of 5` name in visually hidden label text.
- [ ] Add `p#rating-error[role="alert"][hidden]` after the group.
- [ ] Associate the fieldset with `rating-error`.
- [ ] Add a native `<button type="submit">SUBMIT</button>`.
- [ ] Implement mobile dimensions: `327 × 353` reference, `40px` badge, `44px` controls.
- [ ] Implement desktop dimensions: `412 × 412` reference, `48px` badge, `52px` controls.
- [ ] Use `space-between` distribution for the five-control row.
- [ ] Confirm every full label circle is clickable and focusable through its input.

## Verification

- Inspect the accessibility tree for one main, one heading, one named group, five radios, and one button.
- Tab into the radio group and then to submit.
- Confirm no radio is checked after a fresh load.
- Compare static screenshots at `375 × 667` and `768 × 800`.
- Run `pnpm build`.

## Required evidence

- DOM/accessibility-tree inspection.
- Initial-state screenshots.
- Keyboard focus-order notes.
- Build output.

## Exit criteria

- [ ] Exact visible copy is present.
- [ ] Five native radios expose complete accessible names.
- [ ] No rating is initially selected.
- [ ] The rating row remains on one line.
- [ ] Static mobile and desktop layouts match the Figma structure.

## Relevant acceptance criteria

- AC-001 initial experience.
- AC-016 semantic controls.
- Supports AC-010 keyboard operation and AC-017 visible focus.

## Non-goals

- Change or submit handlers.
- Hover, checked, or final focus styling.
- Validation behavior.
- Thank-you markup.
