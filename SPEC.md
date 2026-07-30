# Interactive Rating Component — Functional and Technical Specification

**Document:** `SPEC.md`  
**Status:** Ready for implementation planning  
**Last reviewed:** 2026-07-30  
**Design source:** [Figma node `314:75`](https://www.figma.com/design/bPv2sIvgnlNMRaAkxk7RcR/-Test-02--Material-Theme-Builder-playground--Copy-?node-id=314-75)  
**Design definition:** `DESIGN.md`  
**Target:** Responsive client-side web application built with Vite, TypeScript, semantic HTML, and maintainable CSS

## 1. Purpose

This specification converts the visual and UX definition in `DESIGN.md` into testable functional, interaction, responsive, accessibility, content, and technical requirements.

The application lets a user:

1. Choose one rating from 1 to 5.
2. Submit the selected rating.
3. See a confirmation view containing the exact submitted value.

The product is intentionally limited to this single interaction. It does not require authentication, a backend, analytics, persistence, or network requests.

## 2. Scope

### 2.1 In scope

- A rating view.
- A thank-you view.
- Selection of one value from 1 through 5.
- Pointer, touch, and keyboard interaction.
- Validation when no rating has been selected.
- Responsive mobile and desktop layouts.
- Accessible semantics, focus behavior, and announcements.
- Dynamic confirmation copy using the submitted value.
- Local, permanent copies of the Figma assets.
- Visual states shown in Figma, completed with required focus and validation states.

### 2.2 Out of scope

- User accounts or authentication.
- Backend submission or database storage.
- Analytics or tracking.
- Multiple questions or configurable rating scales.
- Free-text feedback.
- Editing a rating after successful submission.
- A “rate again” control.
- Loading, retry, offline-queue, or server-error states.
- Localization beyond the supplied English content.
- URL-addressable thank-you state.
- Persisting a rating through refresh, navigation, or a new browser session.

## 3. Source-of-truth rules

Requirements are derived from the latest available Figma frames and `DESIGN.md`.

When the sources differ, use this priority:

1. Current visible Figma content and component properties.
2. Confirmed measurements and design tokens recorded in `DESIGN.md`.
3. Explicit decisions in this specification.
4. Implementation details decided later in `PLAN.md`.

### 3.1 Current Figma state discrepancy

The current rating frames demonstrate two simultaneous interaction states:

- Rating `3` uses the orange checked/selected treatment.
- Rating `4` uses the white hover or focus-preview treatment.

The thank-you frames display the sample sentence “You selected 4 out of 5.” These frames are state demonstrations, not a coherent preconfigured user session.

Therefore:

- No rating is selected on initial load.
- Neither `3` nor `4` is a default value.
- The thank-you value must always come from the user’s submitted selection.
- The implementation must never hard-code the sample value `4`.

## 4. Product architecture decision

The app shall be a **single-route, two-view client-side application**.

The two user-facing pages are represented as mutually exclusive application views:

- `rating`
- `thank-you`

A router dependency is not required. Submitting a valid rating replaces the rating view with the thank-you view in the same document.

Consequences of this decision:

- Refreshing the browser resets the application to the rating view.
- The selected value is stored only in memory.
- Submission does not create a new browser-history entry.
- Browser Back behavior is unchanged by the view transition.
- There is no supported direct URL for the thank-you view.

This keeps the architecture proportional to the product while preserving the two-page experience shown in Figma.

## 5. Application state model

The minimum application state is:

```ts
type RatingValue = 1 | 2 | 3 | 4 | 5;

type AppView = "rating" | "thank-you";

type AppState = {
  view: AppView;
  selectedRating: RatingValue | null;
  validationMessage: string | null;
};
```

### 5.1 Initial state

```ts
{
  view: "rating",
  selectedRating: null,
  validationMessage: null
}
```

### 5.2 Valid submitted state

After submitting rating `n`:

```ts
{
  view: "thank-you",
  selectedRating: n,
  validationMessage: null
}
```

### 5.3 State invariants

- `selectedRating` is either `null` or one integer from `1` through `5`.
- Only one rating can be selected at a time.
- `view === "thank-you"` requires `selectedRating !== null`.
- A validation message may exist only while `view === "rating"`.
- Selecting a valid rating clears any existing validation message.

## 6. Content model

Visible copy must match the current Figma design exactly unless this specification adds accessibility or validation content.

### 6.1 Rating view copy

| Content role | Required text |
|---|---|
| Heading | `How did we do?` |
| Supporting text | `Please let us know how we did with your support request. All feedback is appreciated to help us improve our offering!` |
| Visible rating labels | `1`, `2`, `3`, `4`, `5` |
| Submit label | `SUBMIT` |
| Validation message | `Please select a rating before submitting.` |

The uppercase submit label must exist as uppercase source text. Do not produce it with CSS `text-transform`.

### 6.2 Thank-you view copy

| Content role | Required text |
|---|---|
| Result sentence | `You selected {rating} out of 5` |
| Heading | `Thank you!` |
| Supporting text | `We appreciate you taking the time to give a rating. If you ever need more support, don’t hesitate to get in touch!` |

`{rating}` must be interpolated from `selectedRating`.

### 6.3 Accessible rating names

The visible labels remain numeric, but each control must expose a complete accessible name:

- `1 out of 5`
- `2 out of 5`
- `3 out of 5`
- `4 out of 5`
- `5 out of 5`

## 7. Page responsibilities

## 7.1 Rating view

The rating view is responsible for:

- Presenting the prompt and supporting explanation.
- Presenting one accessible radio group with five values.
- Tracking the current selection.
- Showing idle, hover, focus, and checked visual states.
- Validating submission.
- Transitioning to the thank-you view after valid submission.

Required visual order:

1. Decorative star badge.
2. Main heading.
3. Supporting text.
4. Rating group.
5. Validation message, only when needed.
6. Submit button.

The validation message is an accessibility and usability completion not present in Figma. When absent, it must not reserve visible vertical space. When present, the card may grow intrinsically.

## 7.2 Thank-you view

The thank-you view is responsible for:

- Displaying the decorative confirmation illustration.
- Displaying the exact submitted value.
- Displaying the thank-you heading and supporting message.
- Receiving focus after the view transition.

Required visual order:

1. Decorative illustration.
2. Result badge.
3. Main heading.
4. Supporting text.

The view contains no interactive controls in the current scope.

## 8. Functional requirements

## 8.1 Rating selection

**FR-001** — The app shall render five rating options with values `1`, `2`, `3`, `4`, and `5`.

**FR-002** — No option shall be selected on initial load.

**FR-003** — Selecting an option shall set `selectedRating` to that option’s value.

**FR-004** — Selecting a new option shall replace the previous selection.

**FR-005** — At most one option may be checked at any time.

**FR-006** — The selected option shall use the orange checked treatment.

**FR-007** — An unchecked option under pointer hover shall use the white preview treatment on devices that support hover.

**FR-008** — Hovering another option shall not remove or visually replace the orange checked state from the selected option. The selected and hovered states may be visible simultaneously, as demonstrated by the latest Figma frames.

**FR-009** — An existing validation message shall clear immediately after the user selects a valid rating.

## 8.2 Submission

**FR-010** — The submit button shall remain enabled before a rating is selected. A disabled state is not used because the source design does not define one and an enabled action provides a clear validation path.

**FR-011** — Submitting with a selected rating shall transition to the thank-you view.

**FR-012** — The submitted value shall remain available for the thank-you result sentence.

**FR-013** — Submission shall not perform a network request.

**FR-014** — Submission shall not write to local storage, session storage, cookies, IndexedDB, or another persistent store.

**FR-015** — Repeated activation of the submit control during the synchronous transition shall not create duplicate content or throw an error.

## 8.3 Missing-selection validation

**FR-016** — Submitting while `selectedRating === null` shall prevent the view transition.

**FR-017** — The rating view shall display the inline message `Please select a rating before submitting.`

**FR-018** — The validation message shall be programmatically associated with the rating group.

**FR-019** — The validation message shall be announced when it appears.

**FR-020** — Focus shall move to the first rating input after invalid submission so the user can immediately correct the error.

**FR-021** — Invalid submission shall not clear other page content or visually mark an arbitrary rating as selected.

## 8.4 Confirmation

**FR-022** — The thank-you result sentence shall be `You selected {rating} out of 5`.

**FR-023** — The result shall support all five valid submitted values.

**FR-024** — The thank-you view shall not expose a stale Figma sample value.

**FR-025** — Refreshing the page from the thank-you view shall reset the app to the initial rating view.

## 9. Interaction-state requirements

## 9.1 Rating controls

State precedence from highest to lowest:

1. Focus-visible indicator.
2. Checked/selected surface.
3. Hover preview surface.
4. Idle surface.

| Semantic state | Surface | Text | Additional treatment |
|---|---|---|---|
| Idle, unchecked | `#262E38` | `#969FAD` | None |
| Hovered, unchecked | `#FFFFFF` | `#262E38` | None |
| Focused, unchecked | White preview or idle surface | Appropriate contrasting text | Visible focus outline |
| Checked | `#FC7614` | `#262E38` | Native checked semantics |
| Checked and focused | `#FC7614` | `#262E38` | Visible focus outline |

Hover styles must be applied only where pointer hover is available, for example through an equivalent of `@media (hover: hover)`.

A checked option remains orange while hovered. The white preview is for unchecked controls.

## 9.2 Submit button

| State | Surface | Text | Requirement |
|---|---|---|---|
| Default | `#FC7614` | `#131518` | Matches Figma `Regular` |
| Hover | `#FFFFFF` | `#131518` | Matches Figma `Active` |
| Pressed | `#FFFFFF` | `#131518` | No translation or layout shift |
| Focus visible | Current state | Current text | Separate visible outline |

The button must not scale, jump, or change dimensions across states.

## 9.3 Focus treatment

Because Figma does not define keyboard focus, the implementation shall add:

- A `2px` solid white outline.
- A `3px` outline offset.
- A focus-visible treatment on rating labels and the submit button.
- A forced-colors-compatible fallback using system focus colors where applicable.

Focus must remain distinguishable from both white hover and orange checked states.

## 9.4 Motion

Motion is optional and not required for acceptance.

When implemented:

- Color transitions must be between `120ms` and `180ms`.
- Transitions must not animate layout-affecting dimensions.
- `prefers-reduced-motion: reduce` must remove or minimize nonessential transitions.
- The view transition must not delay focus management or announcements.

## 10. Semantic HTML requirements

## 10.1 Document landmarks

- The application content shall be contained in one `<main>` landmark.
- Each view shall expose one primary `<h1>`.
- Decorative wrappers shall not introduce unnecessary ARIA roles.

## 10.2 Rating form

The rating view shall use:

- A native `<form>`.
- A native `<fieldset>` for the rating group.
- A meaningful `<legend>`, visually hidden when necessary to preserve the Figma composition.
- Five native `<input type="radio">` controls sharing the same `name`.
- Five associated `<label>` elements providing the visible circles.
- One native `<button type="submit">`.

The implementation shall not use clickable generic elements as substitutes for radio controls or the submit button.

A suitable legend is:

> Choose a rating from 1 to 5

## 10.3 Radio implementation contract

- Inputs may be visually hidden but must remain focusable and operable.
- Hiding techniques must not use `display: none`, `visibility: hidden`, or the `hidden` attribute.
- Each label’s full `44px` or `52px` circle is the interactive target.
- DOM order must be `1` through `5`.
- The visual order must match DOM order.

## 10.4 Thank-you focus target

The `Thank you!` heading shall be programmatically focusable, normally with `tabindex="-1"`, and shall receive focus immediately after a successful transition.

The focus action must not add the heading to normal sequential tab order.

## 11. Keyboard requirements

**KB-001** — Tab shall move focus into the radio group according to native browser radio behavior.

**KB-002** — Arrow keys shall move selection among radio options according to native browser behavior.

**KB-003** — Space shall select the focused radio option.

**KB-004** — Tab shall move from the rating group to the submit button.

**KB-005** — Enter or Space on the submit button shall submit the form.

**KB-006** — Keyboard operation shall not require pointer hover.

**KB-007** — Every keyboard-focused interactive element shall have a visible focus indicator.

**KB-008** — After successful submission, focus shall move to the thank-you heading.

**KB-009** — After invalid submission, focus shall move to the first radio option.

## 12. Screen-reader and announcement requirements

**SR-001** — The rating group shall expose the label `Choose a rating from 1 to 5`.

**SR-002** — Each option shall expose its value as `{n} out of 5` and its checked state.

**SR-003** — The validation message shall be referenced by the rating group while visible.

**SR-004** — The validation message shall use an immediate announcement mechanism, such as `role="alert"`, without causing duplicate announcements.

**SR-005** — The thank-you heading receiving focus shall communicate the successful view change.

**SR-006** — The result sentence shall be ordinary readable text, not provided only through an image or pseudo-element.

**SR-007** — The star and confirmation illustration shall be decorative and hidden from assistive technology through `alt=""`, `aria-hidden="true"`, or the appropriate equivalent.

## 13. Responsive requirements

## 13.1 Supported viewport range

The app shall support viewport widths from `320px` upward.

Reference widths:

- Mobile source: `375px`.
- Desktop source: `768px`.

## 13.2 Breakpoint

The desktop design shall apply at `48rem` (`768px`) and above.

The mobile design shall apply below `48rem`.

This breakpoint is a specification decision derived from the supplied reference widths. It may be revised only through an explicit documentation update after visual review.

## 13.3 Page layout

- The page shall use at least the available visual viewport height, preferably through `min-height: 100svh` with a suitable fallback.
- The card shall be horizontally centered.
- The card shall be vertically centered when content and viewport height permit.
- The page shall provide `24px` safe padding on narrow viewports.
- On short viewports, content shall remain scrollable instead of being clipped.
- The page shall not rely on absolute offsets copied from Figma.

## 13.4 Mobile card

Below `48rem`:

- Card maximum width: `327px`.
- Card width: `100%` of available space up to `327px`.
- Card radius: `15px`.
- Card horizontal content inset: `24px`.
- Rating-card reference height with no validation: `353px`.
- Thank-you-card reference height: `360px`.
- Heights shall remain intrinsic and may grow with validation, text resizing, or fallback fonts.

## 13.5 Desktop card

At `48rem` and above:

- Card width: `412px`.
- Card radius: `30px`.
- Rating-card content width: `351px`.
- Thank-you-card content width: `340px`.
- Rating-card reference height with no validation: `412px`.
- Thank-you-card reference height: `416px`.
- Heights shall remain intrinsic.

## 13.6 Responsive component sizes

| Component | Mobile | Desktop |
|---|---:|---:|
| Star badge | `40 × 40px` | `48 × 48px` |
| Rating control | `44 × 44px` | `52 × 52px` |
| Submit button height | `45px` | `45px` |
| Thank-you illustration | `144 × 96px` | `162 × 108px` |
| Result badge height | `32px` | `32px` |
| Major vertical gap | `24px` | `32px` |
| Heading | `24px / 30px` | `28px / 35px` |
| Body | `14px / 22px` | `15px / 24px` |

## 13.7 Rating-row layout

- All five controls shall remain on one row.
- The row shall use equal distribution across the available content width.
- Controls shall not overlap.
- Interactive hit areas shall not overlap.
- The row shall not cause horizontal overflow at `320px` viewport width.

## 13.8 Result badge sizing

The result badge shall use intrinsic width with:

- `32px` fixed height at the supplied text sizes.
- Sufficient horizontal padding to reproduce approximately `168px` mobile width and `193px` desktop width for the sample English sentence.
- No hard-coded width that clips a valid rating value or resized text.

## 14. Visual token requirements

The implementation shall expose reusable CSS custom properties for the design system.

Minimum color tokens:

```css
--color-orange-500: #fc7614;
--color-grey-950: #131518;
--color-grey-900: #262e38;
--color-grey-500: #969fad;
--color-white: #ffffff;
--color-card-start: #232a34;
--color-card-end: #181e27;
```

Minimum spacing tokens:

```css
--space-0: 0;
--space-100: 0.5rem;
--space-200: 1rem;
--space-300: 1.5rem;
--space-400: 2rem;
--space-500: 2.5rem;
```

The card gradient shall be represented by an explicit CSS token or reusable rule. It must not depend on the empty Figma variable `colors/gradient/1`.

The implementation shall use the Overpass font with weights `400`, `600`, and `700`, plus a resilient system fallback stack.

## 15. Asset requirements

**ASSET-001** — The star artwork shall match the Figma source.

**ASSET-002** — The thank-you illustration shall match the Figma source.

**ASSET-003** — Figma MCP URLs shall not be committed as runtime asset URLs because they expire.

**ASSET-004** — Assets shall be downloaded and committed locally, preferably as SVG files.

**ASSET-005** — The illustration shall preserve its `1.5:1` aspect ratio.

**ASSET-006** — The multi-layer thank-you illustration shall be used as one exported asset rather than manually reconstructed from generated fragments.

**ASSET-007** — Asset loading failure shall not remove essential information because both assets are decorative.

## 16. Accessibility and resilience requirements

## 16.1 WCAG target

The implementation should conform to WCAG 2.2 Level AA for the scope of this component.

At minimum:

- Text contrast shall meet AA.
- Interactive elements shall be keyboard accessible.
- Focus shall be visible.
- Touch targets shall be at least `44 × 44px` on mobile.
- Meaning shall not depend on color alone.
- Content shall reflow without loss at narrow effective widths.

## 16.2 Text resizing and zoom

At `200%` browser text zoom:

- No text shall overlap controls.
- No content shall be clipped.
- Cards may grow vertically.
- The page shall scroll when required.
- The result badge may grow intrinsically.

At an effective `320px` CSS viewport, including a `400%` zoom reflow scenario from a wider viewport:

- No horizontal page scrolling shall be caused by the component.
- All content and controls shall remain available.

## 16.3 Forced colors

In forced-colors or high-contrast mode:

- Native controls may remain visually hidden only if their associated labels preserve clear state.
- Focus indicators shall use system colors when authored colors are overridden.
- Checked state shall remain perceivable beyond the orange fill.

## 16.4 Reduced motion

The app shall remain fully understandable with all optional motion removed.

## 17. Validation presentation requirements

The validation state is not supplied by Figma and must be integrated conservatively.

Required presentation:

- Text: `Please select a rating before submitting.`
- Placement: immediately after the rating group and before the submit button.
- Typography: mobile body size (`14px / 22px`) at all breakpoints unless visual testing demonstrates a better fit.
- Color: `#FC7614`.
- Alignment: left-aligned with rating-view content.
- No icon required.
- No persistent reserved space while hidden.
- Card height expands naturally while visible.

The error must not change the rating-row dimensions or move controls onto multiple rows.

## 18. Edge cases

### 18.1 No selection

Submitting without a selection shows validation, keeps the rating view visible, and focuses the first radio.

### 18.2 Selection after validation

Choosing any rating clears the message and updates the checked state without requiring another action.

### 18.3 Changing a selection

Choosing a different value moves the orange checked state to the new value. The previous value returns to idle unless it is currently hovered or focused.

### 18.4 Selected option under hover

Hovering the checked option does not replace its orange surface with white.

### 18.5 Touch devices

Touch devices must not depend on hover. A tap selects the value directly.

### 18.6 Refresh

Refreshing from either view returns the app to the unselected rating view.

### 18.7 Short viewport

The page scrolls and keeps the card accessible rather than clipping its top or bottom.

### 18.8 Long or enlarged text

The card and result badge expand intrinsically. Fixed reference heights must not clip content.

### 18.9 Font-loading failure

The system fallback font is used. Layout may differ slightly but must remain usable and non-overlapping.

### 18.10 Decorative asset failure

The experience remains understandable because text communicates the prompt and confirmation independently.

## 19. Non-functional requirements

**NFR-001** — The implementation shall use TypeScript for application behavior.

**NFR-002** — The implementation shall use semantic HTML and plain maintainable CSS.

**NFR-003** — Styling shall use CSS custom properties for shared design tokens.

**NFR-004** — Tailwind or another styling framework shall not be added.

**NFR-005** — Inline styles shall be avoided unless a runtime-calculated value has no clean class or custom-property alternative.

**NFR-006** — The implementation shall not copy raw Figma-generated React/Tailwind code.

**NFR-007** — The solution shall not require a UI framework or router solely for this interaction.

**NFR-008** — Application behavior shall not produce uncaught errors for any supported rating or repeated interaction.

**NFR-009** — The page shall have no horizontal overflow at supported widths.

**NFR-010** — The app shall be functional after a production Vite build.

## 20. Testing requirements

## 20.1 Functional tests

Test at least:

- Initial state contains no checked rating.
- Each value from 1 through 5 can be selected.
- Only one value remains checked.
- Selection can be changed.
- Invalid submit remains on the rating view.
- Invalid submit shows the required message.
- Selecting after validation clears the message.
- Valid submit renders the thank-you view.
- The confirmation sentence contains the submitted value for all five values.
- Refresh resets state.

## 20.2 Interaction tests

Test at least:

- Unchecked pointer hover becomes white.
- Checked option remains orange while another option is hovered.
- Checked option remains orange under its own hover.
- Submit hover becomes white.
- Pressed styles do not move elements.
- Touch selection works without hover.

## 20.3 Keyboard tests

Test at least:

- Tab order.
- Arrow-key radio navigation.
- Space selection.
- Submit activation with Enter and Space.
- Focus-visible styling.
- Focus movement after invalid submission.
- Focus movement after successful submission.

## 20.4 Accessibility tests

Test with browser accessibility tools and at least one screen reader where practical:

- Group label and option names.
- Checked-state announcement.
- Validation announcement.
- Thank-you focus announcement.
- Decorative assets excluded from the accessibility tree.
- Color contrast against the lightest card-gradient area.
- Forced-colors behavior.

Automated accessibility checks must report no critical or serious issues for the component.

## 20.5 Responsive visual tests

Compare against Figma at:

- `375 × 667px` rating view.
- `768 × 800px` rating view.
- `375 × 667px` thank-you view.
- `768 × 800px` thank-you view.

Also test:

- `320px` width.
- A width immediately below `768px`.
- `768px` exactly.
- A common desktop width such as `1440px`.
- A short landscape viewport.
- `200%` text zoom.

## 21. Acceptance criteria

### AC-001 — Initial experience

Given a fresh load, the rating view is visible, no value is selected, no validation message is visible, and the submit button reads `SUBMIT`.

### AC-002 — Single selection

When the user selects any value from 1 through 5, exactly that radio is checked and uses the orange selected treatment.

### AC-003 — Concurrent selected and hover states

Given rating `3` is selected, when the user hovers unchecked rating `4`, `3` remains orange and `4` becomes white, matching the latest Figma state demonstration.

### AC-004 — Change selection

Given one value is selected, selecting a different value moves the checked state and orange treatment to the new value.

### AC-005 — Invalid submission

Given no rating is selected, when the form is submitted, the rating view remains visible, the specified validation message appears, it is announced, and focus moves to the first rating option.

### AC-006 — Validation recovery

Given the validation message is visible, when the user selects a rating, the message disappears and the selected control receives the correct checked treatment.

### AC-007 — Valid submission

Given rating `n` is selected, when the form is submitted, the thank-you view replaces the rating view and displays `You selected n out of 5`.

### AC-008 — Dynamic values

The valid submission flow succeeds for `1`, `2`, `3`, `4`, and `5`; no value is hard-coded.

### AC-009 — Focus after success

After valid submission, keyboard and screen-reader focus is placed on the `Thank you!` heading.

### AC-010 — Keyboard operation

The complete select-and-submit flow can be completed without a pointer, using native radio keyboard behavior and the submit button.

### AC-011 — Mobile fidelity

At `375 × 667px`, the card, type scale, spacing, control sizes, radii, and artwork sizes match the mobile Figma frames within normal rendering tolerance.

### AC-012 — Desktop fidelity

At `768 × 800px`, the card, type scale, spacing, control sizes, radii, and artwork sizes match the desktop Figma frames within normal rendering tolerance.

### AC-013 — Narrow viewport resilience

At `320px` width, the app has no horizontal overflow, all five ratings remain on one row, and all controls remain operable.

### AC-014 — Zoom resilience

At `200%` text zoom, no text or control is clipped or overlapped, and the page can scroll when necessary.

### AC-015 — Permanent assets

The production app uses local committed assets and contains no expiring Figma MCP asset URLs.

### AC-016 — Semantic controls

The rating options are native radio controls, and the primary action is a native submit button.

### AC-017 — Visible focus

Every interactive control has a visible focus indicator distinguishable from hover and selected states.

### AC-018 — State reset

Refreshing the app from either view returns to the initial unselected rating view.

### AC-019 — No unsupported persistence

Submitting a rating creates no network request and stores no rating in persistent browser storage.

### AC-020 — Production build

The app builds successfully with the repository’s Vite production command and the resulting application completes the specified flow without console errors.

## 22. Decisions deferred to `PLAN.md`

`PLAN.md` shall determine implementation structure without changing this behavior contract, including:

- Exact source-file organization.
- Whether view rendering uses DOM templates, small rendering functions, or reusable component modules.
- Where application state is owned.
- How focus references are managed.
- Test runner and test-file structure.
- Exact CSS naming convention.
- Asset paths and export process.
- Visual-regression workflow.

Any plan that changes the single-route state model, validation behavior, persistence rules, breakpoint, or accessibility contract requires an explicit revision to this specification.
