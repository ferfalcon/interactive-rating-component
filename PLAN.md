# Interactive Rating Component — Implementation Plan

**Document:** `PLAN.md`  
**Status:** Ready for implementation  
**Last reviewed:** 2026-07-30  
**Design source:** [Figma node `314:75`](https://www.figma.com/design/bPv2sIvgnlNMRaAkxk7RcR/-Test-02--Material-Theme-Builder-playground--Copy-?node-id=314-75)  
**Design definition:** `DESIGN.md`  
**Functional specification:** `SPEC.md`  
**Repository:** `ferfalcon/interactive-rating-component`  
**Application root:** `vanilla/`

## 1. Purpose

This plan defines how to implement the interactive rating application described by `DESIGN.md` and `SPEC.md` in the repository’s existing Vite and TypeScript project.

The plan is intentionally incremental. Each phase should leave the project understandable, buildable, and easy to review. The implementation must preserve the product decisions already established in `SPEC.md`:

- One browser route.
- Two mutually exclusive application views: `rating` and `thank-you`.
- No rating selected on initial load.
- Native radio controls and a native submit button.
- Orange checked state and white hover/focus-preview state.
- Enabled submit button with inline validation for a missing selection.
- In-memory state only.
- Dynamic confirmation copy.
- No backend, router, persistence, analytics, or UI framework.

This document decides source structure, rendering strategy, state ownership, styling architecture, asset handling, testing tools, implementation order, and review gates. It does not change the behavior contract in `SPEC.md`.

## 2. Planning principles

### 2.1 Keep the architecture proportional

The app has one small synchronous interaction. It does not need React, a router, a state-management library, custom elements, or a component framework.

Use:

- Vite.
- TypeScript.
- Semantic HTML.
- Native browser form behavior.
- Plain CSS with custom properties.
- Small rendering and event-handling functions.

### 2.2 Preserve native behavior where it helps accessibility

Native radio inputs should own:

- Single-selection semantics.
- Checked state.
- Arrow-key movement.
- Space-key selection.
- Form participation.
- Screen-reader announcements.

CSS should style associated labels rather than replacing radio semantics with custom JavaScript controls.

### 2.3 Render only when the view changes

Do not rebuild the complete rating view whenever the selected radio changes. Selection should update through native input state and CSS selectors.

Re-render only for the major transition from the rating view to the thank-you view. This avoids unnecessary DOM churn, preserves focus, and keeps arrow-key behavior reliable.

### 2.4 Separate confirmed requirements from visual tuning

Implement semantic structure and behavior before pixel-level refinement. A visually accurate but inaccessible custom control is not an acceptable intermediate destination.

### 2.5 Avoid unrelated migration work

The Vite project currently lives in `vanilla/`. Keep it there during this implementation.

Moving the application to the repository root could simplify hosting configuration, but it would create a broad file-move diff unrelated to the rating experience. Treat repository flattening as a later, separate decision.

Deployment systems must therefore use `vanilla/` as the project or root directory unless the repository is flattened later.

## 3. Current repository baseline

The existing implementation is the Vite vanilla TypeScript starter.

### 3.1 Confirmed stack

- Vite `8.x`.
- TypeScript `6.x`.
- ES modules.
- `pnpm` lockfile.
- No application framework.
- No testing dependency.
- Production command: `tsc && vite build`.

### 3.2 Current files that will be replaced or cleaned

The starter currently includes:

- `vanilla/src/main.ts` with Vite demonstration markup.
- `vanilla/src/style.css` with starter-page styles.
- `vanilla/src/counter.ts`.
- Vite, TypeScript, and hero demonstration assets.
- `vanilla/public/icons.svg` for starter social icons.
- A Vite favicon.
- Document title `vanilla`.
- Package name `vanilla`.

These files do not provide reusable application behavior. Preserve the Vite and TypeScript configuration, but remove the starter UI and unused assets.

### 3.3 TypeScript constraints that affect implementation

The current `tsconfig.json` enables:

- `verbatimModuleSyntax`.
- `noUnusedLocals`.
- `noUnusedParameters`.
- `erasableSyntaxOnly`.
- Bundler module resolution.

Consequences:

- Use `import type` for type-only imports.
- Avoid TypeScript `enum`; use literal unions and `as const` data.
- Do not leave unused helper functions or references.
- Keep runtime code valid as ordinary JavaScript after type erasure.

## 4. Architecture decision

## 4.1 Overall model

Use one mounted application with one stable `<main>` landmark. The card inside the landmark changes between two view templates.

Conceptual structure:

```text
#app
└── main.rating-app
    └── current view card
        ├── rating form
        └── OR thank-you content
```

The `<main>` element should remain mounted while the view changes. This keeps the document landmark stable and limits replacement to the card content.

## 4.2 Rendering strategy

Use small template-producing functions with static, controlled HTML strings:

- `renderRatingView()` creates and binds the rating form.
- `renderThankYouView(rating)` creates the confirmation card.
- `renderCurrentView()` selects the correct view from application state.

Using static templates is appropriate because:

- The markup is small.
- The content is controlled by the application.
- The only dynamic visible value is a validated `RatingValue` union.
- A framework would add more structure than the interaction needs.

Do not interpolate unchecked user-controlled strings into `innerHTML`. Set the dynamic result sentence with `textContent`, even though the rating has already been narrowed to `1 | 2 | 3 | 4 | 5`.

## 4.3 State ownership

Own application state in `rating-app.ts` within the mounted app closure.

```ts
type RatingValue = 1 | 2 | 3 | 4 | 5;
type AppView = 'rating' | 'thank-you';

type AppState = {
  view: AppView;
  selectedRating: RatingValue | null;
  validationMessage: string | null;
};
```

Do not expose mutable global state on `window`.

The DOM and state responsibilities are:

- Native radio `checked` state controls the current visual selection.
- The `change` handler mirrors the valid selected value into `AppState`.
- `validationMessage` controls the inline error’s visibility and ARIA state.
- `view` controls the only full view replacement.

## 4.4 Why not model hover in state

Hover and focus-preview are transient presentation states. They should be expressed through CSS pseudo-classes, not persisted in `AppState`.

This is required to preserve the simultaneous state shown in the latest Figma rating frames:

- Rating `3` can remain checked and orange.
- Rating `4` can independently be hovered and white.

## 5. Proposed file structure

```text
vanilla/
├── index.html
├── package.json
├── pnpm-lock.yaml
├── tsconfig.json
├── playwright.config.ts
├── public/
│   └── favicon.svg
├── src/
│   ├── main.ts
│   ├── rating-app.ts
│   ├── rating-types.ts
│   ├── style.css
│   ├── assets/
│   │   ├── icon-star.svg
│   │   └── illustration-thank-you.svg
│   └── styles/
│       ├── reset.css
│       ├── tokens.css
│       └── app.css
└── tests/
    ├── rating-flow.spec.ts
    ├── accessibility.spec.ts
    └── visual.spec.ts
```

### 5.1 Files to delete

Remove after replacement code is working:

```text
vanilla/src/counter.ts
vanilla/src/assets/hero.png
vanilla/src/assets/typescript.svg
vanilla/src/assets/vite.svg
vanilla/public/icons.svg
```

Do not keep unused starter assets “just in case.” They obscure the production asset inventory and increase review noise.

### 5.2 Why this structure is not split further

The app does not need one file per visual fragment. `RatingOption`, `SubmitButton`, and `ResultBadge` are useful conceptual components, but separate TypeScript modules for each would add indirection without independent behavior or reuse.

Keep:

- Types in one small type module.
- Application rendering and behavior in one app module.
- Shared design tokens separate from component styling.
- End-to-end tests organized by concern.

If `rating-app.ts` grows beyond a reasonable small-module size during implementation, split templates into `rating-view.ts` and `thank-you-view.ts`. Do not pre-emptively introduce that split.

## 6. Module responsibilities

## 6.1 `src/main.ts`

Responsibilities:

- Import the Overpass font weights.
- Import `style.css`.
- Resolve `#app` safely.
- Mount the rating application.

It should contain no application markup and no rating business rules.

Failure to find `#app` should throw a clear initialization error rather than rely on a non-null assertion scattered through the app.

## 6.2 `src/rating-types.ts`

Responsibilities:

- Define `RATING_VALUES` as `[1, 2, 3, 4, 5] as const`.
- Derive `RatingValue` from that tuple.
- Define `AppView` and `AppState`.
- Export a narrow `isRatingValue()` type guard.

Avoid an enum because `erasableSyntaxOnly` is enabled.

## 6.3 `src/rating-app.ts`

Responsibilities:

- Create initial application state.
- Create the stable `<main>` shell.
- Render the rating view.
- Bind `change` and `submit` events.
- Validate submitted values.
- Show and clear inline validation.
- Render the thank-you view.
- Move focus after invalid and successful submission.

Suggested public API:

```ts
export function mountRatingApp(root: HTMLElement): void
```

All other functions should remain module-private unless tests reveal a strong need for direct exports.

## 6.4 `src/style.css`

This remains the single CSS entry imported by TypeScript.

```css
@import './styles/reset.css';
@import './styles/tokens.css';
@import './styles/app.css';
```

The imports make token and reset responsibilities explicit without creating many runtime style entry points.

## 7. Markup plan

## 7.1 Stable application shell

Create one `<main class="rating-app">` inside `#app`. The current card is rendered inside this landmark.

Each view contains one `<h1>`.

## 7.2 Rating view markup

Use this semantic hierarchy:

```text
article.card.card--rating
├── decorative star badge
└── form.rating-form
    ├── h1
    ├── supporting paragraph
    ├── fieldset.rating-fieldset
    │   ├── legend.sr-only
    │   └── five radio option wrappers
    ├── p#rating-error[role=alert][hidden]
    └── button[type=submit]
```

The star can appear before the `<form>` inside the card. The heading remains the primary page heading.

The `fieldset` border, margin, and padding must be reset so it participates only semantically and does not alter Figma spacing.

## 7.3 Rating-option markup

For each value:

```text
div.rating-option
├── input.rating-option__input[type=radio]
└── label.rating-option__label
    ├── visible number, aria-hidden
    └── visually hidden “n out of 5” text
```

The visible number should be hidden from the accessibility name so the control is not announced redundantly as “3, 3 out of 5.”

Inputs must remain focusable. Do not use `display: none`, `visibility: hidden`, or the `hidden` attribute on the radio inputs.

## 7.4 Validation markup and ARIA

The error paragraph exists in the DOM from initial render but is hidden.

- `id="rating-error"`.
- `role="alert"`.
- Text exactly: `Please select a rating before submitting.`
- `hidden` while inactive.

The fieldset should reference it using `aria-describedby="rating-error"`.

On invalid submission:

- Set `state.validationMessage`.
- Remove `hidden`.
- Set `aria-invalid="true"` on the fieldset.
- Focus the first radio input.

On a valid radio change:

- Clear `state.validationMessage`.
- Restore `hidden`.
- Remove or set `aria-invalid="false"`.

Do not reserve empty vertical space for the error.

## 7.5 Thank-you view markup

Use this hierarchy:

```text
article.card.card--thank-you
└── div.thank-you-content
    ├── decorative illustration
    ├── p.rating-result
    └── div.thank-you-message
        ├── h1[tabindex=-1]
        └── supporting paragraph
```

The heading receives programmatic focus immediately after rendering. It must not enter normal sequential tab order.

## 8. Event and state flow

## 8.1 Initial mount

1. Validate the root element.
2. Create initial `AppState`.
3. Create the stable `<main>` shell.
4. Render the rating view.
5. Bind rating-view events.
6. Leave all radios unchecked.
7. Do not focus a control automatically on page load.

## 8.2 Radio change

1. Read the changed input’s numeric value.
2. Validate it with `isRatingValue()`.
3. Update `state.selectedRating`.
4. Clear validation state if present.
5. Do not re-render the form.

The browser updates `checked` state and native keyboard behavior. CSS reads `:checked` directly.

## 8.3 Invalid submit

1. Prevent normal form submission.
2. Confirm that `state.selectedRating === null`.
3. Set the required validation message in state.
4. Reveal the alert text.
5. Mark the group invalid.
6. Focus the first radio.
7. Keep the rating view mounted.

Repeated invalid submission must remain stable. Do not duplicate error elements or listeners.

## 8.4 Valid submit

1. Prevent normal form submission.
2. Narrow the selected value to `RatingValue`.
3. Set `state.view = 'thank-you'`.
4. Clear validation state.
5. Render the thank-you view once.
6. Set the dynamic result using `textContent`.
7. Focus the `Thank you!` heading.

Use `queueMicrotask()` or `requestAnimationFrame()` only if needed for reliable focus after the DOM replacement. Prefer the simplest method that works consistently in the supported browsers.

Use `focus({ preventScroll: true })` when supported so the centered card does not jump unnecessarily. Confirm that this does not hide focused content in short viewports.

## 9. CSS architecture

## 9.1 Naming convention

Use descriptive, component-scoped class names with a light BEM-style structure:

- `.rating-app`
- `.card`
- `.card--rating`
- `.card--thank-you`
- `.star-badge`
- `.rating-form`
- `.rating-fieldset`
- `.rating-options`
- `.rating-option`
- `.rating-option__input`
- `.rating-option__label`
- `.rating-form__error`
- `.submit-button`
- `.thank-you-content`
- `.rating-result`
- `.thank-you-message`
- `.sr-only`

Avoid selectors tied to Figma node names or generated class strings.

## 9.2 Reset layer

`reset.css` should contain only broadly useful normalization:

- `box-sizing: border-box` inheritance.
- Remove default body margin.
- Remove default heading, paragraph, fieldset, and legend spacing where explicitly restyled.
- Inherit font on buttons and form controls.
- Make images block-level with `max-width: 100%`.
- Preserve `[hidden]` behavior.

Do not import a large third-party reset for this component.

## 9.3 Token layer

Define semantic custom properties rather than mirroring Figma slash names:

```text
Colors
--color-page
--color-card-highlight
--color-card-base
--color-surface
--color-text-primary
--color-text-secondary
--color-accent

Spacing
--space-0
--space-1
--space-2
--space-3
--space-4
--space-5

Typography
--font-family-base
--font-size-heading
--line-height-heading
--font-size-body
--line-height-body
--font-size-control
--line-height-control

Component dimensions
--card-max-width
--card-radius
--card-major-gap
--rating-control-size
--star-badge-size
--illustration-width
--illustration-height
```

Use `rem` values derived from the Figma pixel values so the default rendering remains exact at a `16px` root size while still responding to user font preferences.

Use pixels only where fractional scaling is undesirable, such as `1px` borders and `2px` outlines.

## 9.4 Global page layout

Recommended layout behavior:

```text
body
- min-height: 100svh
- display: flex
- center content
- padding: 24px
- dark page background

#app and .rating-app
- width: 100%
- flex or grid centering
```

Use `min-height`, not a fixed viewport height. The body must be allowed to grow when validation, zoom, or a short viewport increases content height.

Do not use absolute positioning to place the card at the Figma frame coordinates.

## 9.5 Shared card surface

`.card` should provide:

- Tokenized radial or elliptical gradient.
- `width: min(100%, var(--card-max-width))`.
- `box-sizing: border-box`.
- No border or shadow.
- Breakpoint-specific radius.
- Relative positioning only if needed for artwork.

Start with the semantic gradient documented in `DESIGN.md`, then tune its size and stop distribution against the Figma screenshots. Do not embed the generated data-URI SVG gradient.

## 9.6 Rating-card sizing strategy

Preserve Figma measurements without hard-coding a fixed height:

Mobile:

- Card maximum width: `327px`.
- Padding: `24px`.
- Content width: available width.
- Natural content height produces the `353px` reference height.

Desktop:

- Card width: `412px`.
- Block padding: `32px`.
- Minimum inline padding: `24px`.
- Inner content width: `351px`.
- Center the inner content so the effective side inset becomes `30.5px`.

This is preferable to adding an arbitrary `30.5px` spacing token.

## 9.7 Thank-you-card sizing strategy

Use `min-height` plus centered content rather than a fixed height:

Mobile:

- Width: `327px`.
- Minimum height: `360px`.
- Padding: `32px 24px`.
- Inner content width: `279px`.
- Center content vertically and horizontally.

Desktop:

- Width: `412px`.
- Minimum height: `416px`.
- Padding: `40px 32px`.
- Inner content width: `340px`.
- Center content vertically and horizontally.

With the supplied copy, the unused space inside the minimum height recreates the measured effective top and bottom spacing. If text grows, the card grows instead of clipping.

## 9.8 Rating-row layout

Use a single row with five equal control tracks:

- `display: grid`.
- `grid-template-columns: repeat(5, var(--rating-control-size))`.
- `justify-content: space-between`.
- No wrapping.

At `320px` viewport width, the card and content shrink while controls remain `44px`. The row has very small but non-negative gaps. Test this explicitly.

Do not use fixed gap values because Figma distributes remaining width differently at mobile and desktop sizes.

## 9.9 Interaction-state selectors

Order selectors so state precedence matches `SPEC.md`:

1. Idle label style.
2. Unchecked hover style inside `@media (hover: hover)`.
3. Unchecked focus-preview surface.
4. Checked surface.
5. Focus-visible outline.

The hover rule must include `:not(:checked)` so hovering a checked option never replaces orange with white.

The focus outline must be independent from the surface color:

- `2px` solid white.
- `3px` offset.

For an unchecked focused radio, use the white preview surface plus the outline. For a checked focused radio, retain orange plus the outline.

## 9.10 Motion

Do not add view-transition animation in the first implementation pass.

A short color transition may be added only after all interaction and focus states pass review:

- `120–180ms`.
- Color/background only.
- No transforms or size changes.
- Removed under `prefers-reduced-motion: reduce`.

This avoids motion becoming a source of focus timing bugs.

## 10. Font plan

Use `@fontsource/overpass` so the required weights are bundled locally and the application does not depend on a runtime font CDN.

Import only:

- Weight `400`.
- Weight `600`.
- Weight `700`.

Use the normal style only.

Benefits:

- Reliable local production build.
- Exact family and weight availability.
- No render-blocking third-party stylesheet request.
- Clear package-managed provenance.

Trade-off:

- Adds one production dependency for typography.

Set `font-display: swap` behavior supplied by the package and retain the documented system fallback stack. Test the layout with the font request disabled to satisfy the fallback edge case.

## 11. Asset plan

## 11.1 Required production assets

Export and commit exactly two design assets:

- Star glyph from the star component, without the dark circular container.
- Complete thank-you illustration as one SVG.

The star badge circle should be CSS so it responds naturally to the mobile and desktop size tokens.

## 11.2 Export workflow

At implementation time:

1. Export the star vector from the Figma star glyph node as SVG.
2. Export node `314:198` as a single SVG illustration.
3. Download immediately because Figma connector asset URLs expire.
4. Save under `src/assets/` with stable semantic names.
5. Inspect SVG dimensions and view boxes.
6. Remove editor-only metadata only when doing so does not change rendering.
7. Do not manually redraw or approximate the illustration.
8. Import assets through Vite so production paths are hashed and valid.

## 11.3 Decorative semantics

Render both assets with empty alternative text.

- `alt=""`.
- Explicit intrinsic width and height.
- `aria-hidden="true"` may be added defensively where it does not conflict with image semantics.

The experience must remain understandable if either image fails.

## 11.4 Favicon

Replace the Vite favicon with a small project-specific SVG, preferably based on the star glyph. This is polish, not a blocker for the interaction.

Do not use the complex thank-you illustration as a favicon.

## 12. Responsive implementation plan

## 12.1 Baseline

Implement mobile styles first using the `375 × 667px` frames.

The card width rule must allow it to shrink below `327px` when the viewport is narrower, while the page retains `24px` side padding.

## 12.2 Breakpoint

Use one desktop breakpoint at `48rem` (`768px`) as defined in `SPEC.md`.

At the breakpoint, update:

- Card maximum width.
- Card radius.
- Heading and body typography.
- Major vertical gap.
- Rating-control size.
- Star-badge size.
- Illustration size.
- View-specific padding and content widths.

Do not add intermediate breakpoints unless an actual failure is found during the `320–767px` review.

## 12.3 Viewport behavior

Test and preserve:

- Horizontal centering at all widths.
- Vertical centering when content fits.
- Natural document growth and scrolling when content does not fit.
- No fixed card height on the rating view.
- Minimum rather than fixed height on the thank-you view.
- No horizontal page overflow.

## 12.4 Exact reference checks

Perform primary visual comparison at:

- Rating: `375 × 667px`.
- Rating: `768 × 800px`.
- Thank you: `375 × 667px`.
- Thank you: `768 × 800px`.

Perform resilience checks at:

- `320px` width.
- `767px` width.
- `768px` width.
- `1440px` width.
- Short mobile landscape.
- `200%` browser zoom.

## 13. Accessibility implementation plan

## 13.1 Keyboard behavior

Rely on native radio behavior and verify it in a real browser:

- Tab enters the group.
- Arrow keys change selection.
- Space selects.
- Tab moves to submit.
- Enter or Space submits.

Do not add custom arrow-key handlers unless testing proves a browser compatibility defect. Custom handlers could duplicate or conflict with native behavior.

## 13.2 Focus after invalid submission

Focus the first radio input after revealing the error.

Do not focus the error paragraph because the immediate corrective action is selecting a rating. The alert role provides the announcement while radio focus puts the user at the repair point.

## 13.3 Focus after success

The thank-you `<h1>` receives `tabindex="-1"` and programmatic focus.

Verify that:

- The heading is announced.
- It is not in the normal tab sequence afterward.
- The page does not unexpectedly jump.

## 13.4 Forced-colors behavior

Add a dedicated `@media (forced-colors: active)` block.

Requirements:

- Every rating label retains a visible boundary.
- Checked state uses a system-color border or outline, not background alone.
- Focus uses a system highlight color and remains distinct from checked state.
- Submit remains visibly button-like.

Do not disable forced-color adjustments across the whole component.

## 13.5 Zoom and reflow

Use intrinsic height and rem-based sizing so text can grow.

Manually verify `200%` zoom because browser zoom is not perfectly represented by simply changing CSS font size in an automated test.

At enlarged text:

- The validation message may increase card height.
- The thank-you result pill may widen.
- The page may scroll.
- The five controls remain on one row.

## 14. Dependency and script changes

## 14.1 Production dependency

Add:

```text
@fontsource/overpass
```

## 14.2 Development dependencies

Add:

```text
@playwright/test
@axe-core/playwright
```

Use Playwright as the single automated test runner. The application logic is too small to justify a second unit-test framework, and real-browser tests are more valuable for native radio keyboard behavior, focus, hover media queries, and responsive screenshots.

## 14.3 Package scripts

Update scripts to include:

```json
{
  "dev": "vite",
  "build": "tsc && vite build",
  "preview": "vite preview",
  "test": "playwright test",
  "test:headed": "playwright test --headed",
  "test:update-snapshots": "playwright test --update-snapshots",
  "check": "pnpm build && pnpm test"
}
```

Rename the package from `vanilla` to `interactive-rating-component`.

The implementation should remain runnable using the existing `pnpm` workflow.

## 15. Testing plan

## 15.1 Playwright configuration

Configure Playwright with:

- Vite dev server started from `vanilla/`.
- Stable local base URL.
- Automatic server reuse outside CI.
- Trace or screenshot capture on failure.
- Chromium as the visual-snapshot reference browser.
- Chromium, Firefox, and WebKit for core behavior when CI/runtime budget permits.

If multi-browser execution is too heavy for the initial repository, keep all core tests browser-agnostic and run Chromium in automation, then complete documented Firefox and WebKit manual smoke tests. Do not silently claim cross-browser coverage that was not run.

## 15.2 `tests/rating-flow.spec.ts`

Automate:

- Initial unselected state.
- Selection of each value.
- Only one checked option.
- Changing selection.
- Checked option remaining orange while another is hovered.
- Checked option remaining orange under its own hover.
- Invalid submission.
- Error visibility and recovery.
- Focus moving to the first radio after invalid submission.
- Valid submission for values `1` through `5`.
- Dynamic result text.
- Focus moving to the thank-you heading.
- Reload returning to initial state.
- No local/session storage written.
- No application network submission.

## 15.3 `tests/accessibility.spec.ts`

Automate:

- One `<main>` landmark.
- One `<h1>` in the active view.
- Native radio inputs.
- Shared radio name.
- Accessible group legend.
- Full accessible option names.
- Native submit button.
- Keyboard-only completion flow.
- Visible focus classes or computed outline behavior where reliably testable.
- Axe scan with no serious or critical violations.
- Decorative images excluded from accessible naming.

Do not treat axe as a substitute for manual screen-reader testing.

## 15.4 `tests/visual.spec.ts`

After manual Figma approval, establish screenshots for:

- Mobile rating view.
- Desktop rating view.
- Mobile thank-you view.
- Desktop thank-you view.
- Selected `3` plus hovered `4` state shown in current Figma.
- Validation state as the approved implementation extension.

A screenshot baseline proves regression stability only after the first version has been visually compared to Figma. It does not independently prove design fidelity.

Use reasonable tolerances for browser font rasterization. Do not hide genuine layout drift behind a large pixel threshold.

## 15.5 Manual review

Manually test:

- NVDA with Chrome or Firefox on Windows, where available.
- VoiceOver with Safari when available.
- `200%` browser zoom.
- Forced-colors or Windows High Contrast.
- Touch behavior through an actual or emulated touch device.
- Font loading disabled.
- Short landscape viewport.
- Production preview, not only the dev server.

Record unresolved findings in `REVIEW.md` rather than silently accepting them.

## 16. Implementation sequence

Each phase should be reviewed before moving to the next. Avoid combining the complete feature into one opaque change.

## Phase 0 — Baseline and documentation check

Tasks:

1. Confirm `DESIGN.md`, `SPEC.md`, and this plan describe the same current Figma state.
2. Run the current Vite starter.
3. Run the current production build.
4. Note existing console warnings or configuration issues.
5. Confirm Node and pnpm versions satisfy Vite requirements.

Exit criteria:

- Starter runs.
- Production build succeeds before modification.
- No hidden repository issue is mistaken for an implementation regression.

## Phase 1 — Replace starter scaffold

Tasks:

1. Rename the package.
2. Update document title and metadata.
3. Replace `main.ts` with a minimal app bootstrap.
4. Add `rating-types.ts` and `rating-app.ts` shells.
5. Replace starter CSS entry with the reset/token/app imports.
6. Remove counter code and starter assets.
7. Keep a minimal placeholder card long enough to verify the new structure builds.

Exit criteria:

- No Vite demonstration content remains.
- `pnpm build` succeeds.
- No unused starter imports or assets remain.

## Phase 2 — Add permanent assets and typography

Tasks:

1. Export the star glyph and full thank-you illustration from Figma.
2. Commit stable SVG files.
3. Add Overpass through `@fontsource`.
4. Import only weights `400`, `600`, and `700`.
5. Replace the favicon.
6. Verify asset dimensions and fallback behavior.

Exit criteria:

- No expiring Figma URLs appear in source.
- Assets render at intended aspect ratios.
- Overpass weights render correctly.
- App remains understandable with images blocked.

## Phase 3 — Build tokens and global layout

Tasks:

1. Implement reset rules.
2. Implement semantic color, spacing, typography, radius, and component-size tokens.
3. Implement full-viewport page layout.
4. Implement shared card gradient and responsive width/radius.
5. Verify `320px`, `375px`, and desktop centering before adding complex content.

Exit criteria:

- Page has no horizontal overflow.
- Card surface and page background are visibly distinct.
- Mobile and desktop card widths switch correctly at `48rem`.

## Phase 4 — Implement static rating view

Tasks:

1. Add star badge.
2. Add exact heading and body copy.
3. Add semantic form, fieldset, legend, radio inputs, and labels.
4. Add submit button.
5. Implement mobile layout first.
6. Add desktop token overrides.
7. Verify control sizes and distributed row spacing.

Exit criteria:

- DOM is semantic before JavaScript interaction is added.
- All five radio targets are keyboard focusable.
- Static mobile and desktop layouts closely match Figma.
- No rating is checked initially.

## Phase 5 — Implement radio states and selection

Tasks:

1. Add idle state.
2. Add unchecked hover preview under hover-capable media query.
3. Add orange checked state.
4. Add focus-preview and focus outline.
5. Bind the change handler and state update.
6. Clear validation state on a valid change.
7. Confirm selected and hovered states coexist.

Exit criteria:

- Native radio keyboard behavior works.
- Exactly one rating is selected.
- Checked state remains orange during hover.
- Focus is visible and independent of color.

## Phase 6 — Implement validation

Tasks:

1. Add hidden alert element.
2. Add fieldset association.
3. Handle invalid submit.
4. Reveal exact validation copy.
5. Focus the first radio.
6. Clear error on selection.
7. Confirm card grows without affecting the rating row.

Exit criteria:

- Invalid submission never changes view.
- Error is announced.
- Focus moves to the repair target.
- Repeated invalid submissions do not duplicate UI.

## Phase 7 — Implement thank-you transition

Tasks:

1. Create thank-you template.
2. Add illustration and result badge.
3. Add exact heading and body copy.
4. Insert submitted rating with `textContent`.
5. Replace only the active card inside the stable main landmark.
6. Focus the thank-you heading.
7. Verify all five values.

Exit criteria:

- No sample value is hard-coded.
- Focus announces success.
- Refresh restores the initial view.
- No storage or network call occurs.

## Phase 8 — Responsive and visual refinement

Tasks:

1. Compare mobile rating view with Figma.
2. Compare desktop rating view with Figma.
3. Compare both thank-you views.
4. Tune gradient geometry.
5. Tune content widths, wrapping, and distributed spacing.
6. Check breakpoint boundary at `767px` and `768px`.
7. Check short viewport and `320px` width.
8. Check validation state separately because it is not in Figma.

Exit criteria:

- Reference frames match within normal browser-rendering tolerance.
- No visual fix introduces fixed-height clipping.
- Narrow and short layouts remain usable.

## Phase 9 — Accessibility hardening

Tasks:

1. Verify accessible names.
2. Verify group name and error association.
3. Verify focus order and focus movement.
4. Add forced-colors overrides.
5. Add reduced-motion override if transitions exist.
6. Test `200%` zoom.
7. Test font failure.
8. Run manual screen-reader smoke test.

Exit criteria:

- Complete flow works without pointer input.
- No serious or critical automated accessibility violations.
- Checked, hover, and focus states remain distinguishable.
- Zoom and high-contrast modes preserve function.

## Phase 10 — Automated tests and production verification

Tasks:

1. Add Playwright and axe dependencies.
2. Add Playwright configuration.
3. Add functional flow tests.
4. Add accessibility tests.
5. Add approved visual snapshots.
6. Run production build.
7. Run production preview smoke test.
8. Run the full `check` command.

Exit criteria:

- `pnpm build` succeeds.
- Automated tests pass.
- Production preview completes the flow without console errors.
- All acceptance criteria have evidence in tests or the manual review record.

## 17. Suggested commit sequence

Keep commits narrow and reviewable:

1. `chore: remove Vite starter UI`
2. `chore: add rating assets and Overpass font`
3. `style: add rating design tokens and card layout`
4. `feat: add accessible rating form`
5. `feat: add rating selection states`
6. `feat: add missing-rating validation`
7. `feat: add thank-you view and focus transition`
8. `style: refine responsive Figma fidelity`
9. `test: add rating flow and accessibility coverage`
10. `test: add approved visual snapshots`

Do not force this exact commit count when a phase is too small, but avoid one large implementation commit.

## 18. Risks, trade-offs, and mitigations

## 18.1 Current app is nested under `vanilla/`

Risk:

- Hosting tools may default to the repository root and fail to find `package.json`.

Decision:

- Keep the current app root for this feature.

Mitigation:

- Document `vanilla/` as the deployment root.
- Consider repository flattening in a separate migration after implementation.

## 18.2 Template strings and DOM replacement

Risk:

- String templates can become difficult to maintain or unsafe if uncontrolled content is added later.

Decision:

- Use them because the markup is small and content is controlled.

Mitigation:

- Validate the rating through a type guard.
- Apply the dynamic result using `textContent`.
- Re-render only on the major view transition.
- Split templates into separate modules if complexity grows.

## 18.3 Visually hidden native radios

Risk:

- Incorrect hiding can remove controls from keyboard or accessibility APIs.

Mitigation:

- Use a proven visually-hidden technique.
- Never use `display: none` or `visibility: hidden`.
- Test native keyboard behavior in real browsers.
- Style labels via adjacent selectors.

## 18.4 Validation is not shown in Figma

Risk:

- The card becomes taller after invalid submission and has no pixel-perfect reference.

Mitigation:

- Add the error only when needed.
- Place it exactly where `SPEC.md` requires.
- Use the existing body type scale and orange token.
- Keep intrinsic card height.
- Review the validation state as an intentional product extension.

## 18.5 Gradient mismatch

Risk:

- A semantic CSS radial gradient may not initially match Figma’s generated SVG gradient.

Mitigation:

- Start from the documented color stops.
- Tune gradient size, origin, and stop positions through screenshot comparison.
- Keep gradient values tokenized.
- Do not adopt an opaque data URI merely to avoid calibration.

## 18.6 Fractional desktop spacing

Risk:

- Directly encoding `30.5px` and `44.5px` creates awkward one-off spacing values.

Mitigation:

- Recreate those effective values through centered fixed-width content, minimum card heights, and the documented base paddings.
- Use layout relationships rather than new global spacing tokens.

## 18.7 Font dependency

Risk:

- Adding `@fontsource/overpass` increases dependency surface.

Benefit:

- Reliable local font rendering and no runtime CDN.

Mitigation:

- Import only required weights.
- Retain system fallbacks.
- Keep the dependency specifically scoped to visual fidelity.

## 18.8 Single end-to-end test runner

Risk:

- Playwright tests are heavier than DOM unit tests.

Benefit:

- Tests execute real native radio behavior, focus, hover media queries, and layout.
- Avoids maintaining two test frameworks for minimal application logic.

Mitigation:

- Keep test files focused.
- Run one browser locally by default if needed; use broader browser projects in CI or review.

## 18.9 Fixed 48rem breakpoint

Risk:

- The visual change is abrupt and intermediate tablet widths use the mobile layout.

Decision:

- Preserve the explicit specification and supplied reference widths.

Mitigation:

- Test `767px` and `768px` directly.
- Revise `SPEC.md` before changing the breakpoint based on preference alone.

## 18.10 Focus timing after view replacement

Risk:

- Focusing too early can fail; delaying too long can weaken announcement timing.

Mitigation:

- Insert the view synchronously.
- Focus synchronously first.
- Use one microtask or animation frame only if browser testing requires it.
- Avoid animated view delays.

## 19. Review gates

## Gate 1 — Structure review

Before detailed styling:

- File structure matches this plan.
- Starter files are removed.
- Build passes.
- No framework or router has been added.

## Gate 2 — Semantic review

Before visual interaction styling:

- Native form, fieldset, legend, radios, labels, and button exist.
- DOM order is correct.
- Controls work without custom keyboard code.

## Gate 3 — Behavior review

Before pixel refinement:

- Selection state works.
- Invalid submission works.
- Valid transition works.
- Dynamic result works for all values.
- Focus moves correctly.

## Gate 4 — Visual review

Before automated snapshots:

- Four reference frames are compared with Figma.
- Typography and text wrapping match.
- Gradient is calibrated.
- Hover and checked state demonstration matches.
- Validation state is approved as an extension.

## Gate 5 — Accessibility review

Before final completion:

- Keyboard flow passes.
- Screen-reader smoke test passes.
- Axe reports no serious or critical findings.
- Forced colors and zoom remain usable.

## Gate 6 — Production review

Before merge or deployment:

- Production build passes.
- Production preview passes.
- No expiring asset URLs exist.
- No console errors occur.
- Acceptance criteria are checked against `SPEC.md`.

## 20. Definition of done

Implementation is complete when:

- The Vite starter interface has been fully replaced.
- The initial view has no selected rating.
- All five ratings use native radio semantics.
- Checked, hover, and focus states follow the defined precedence.
- The submit button remains enabled and validates a missing selection.
- The error is associated, announced, and cleared correctly.
- Valid submission renders the thank-you view with the exact submitted value.
- Focus moves to the thank-you heading.
- Refresh resets the app.
- No network or persistent storage is used.
- Mobile and desktop reference frames match Figma within normal tolerance.
- The layout has no horizontal overflow at `320px`.
- The layout remains usable at `200%` zoom and in short viewports.
- Assets are local, stable, and decorative to assistive technology.
- Production build and automated tests pass.
- Manual review findings are resolved or explicitly recorded in `REVIEW.md`.

## 21. Explicit non-goals for implementation

Do not add during this plan:

- A second route.
- Browser-history integration.
- A “rate again” button.
- Rating persistence.
- A backend endpoint.
- Analytics.
- A loading spinner.
- A disabled submit state.
- React, Vue, Svelte, Astro, or another UI framework.
- Tailwind or another styling framework.
- A generalized design-system package.
- Custom radio keyboard logic.
- Complex page-transition animation.
- Repository-root migration.

Any of these additions requires a specification change or a separate follow-up scope.

## 22. Final implementation checklist

### Project

- [ ] Work is contained under `vanilla/`.
- [ ] Package and document titles are updated.
- [ ] Vite starter assets and code are removed.
- [ ] Build command still works.

### Structure

- [ ] `main.ts` only bootstraps.
- [ ] State and rendering live in `rating-app.ts`.
- [ ] Rating types use literal unions, not enums.
- [ ] CSS is separated into reset, tokens, and app layers.

### Rating view

- [ ] No initial selection.
- [ ] Semantic fieldset and legend.
- [ ] Five focusable native radios.
- [ ] Accessible names are “n out of 5.”
- [ ] Orange checked state.
- [ ] White unchecked hover/focus preview.
- [ ] Checked state survives hover.
- [ ] Visible independent focus outline.
- [ ] Enabled `SUBMIT` button.

### Validation

- [ ] Exact error copy.
- [ ] Error appears after the group.
- [ ] Error is associated and announced.
- [ ] First radio receives focus.
- [ ] Selection clears the error.
- [ ] Card grows without clipping.

### Thank-you view

- [ ] Exact illustration.
- [ ] Dynamic result sentence.
- [ ] Exact heading and supporting copy.
- [ ] Heading receives focus.
- [ ] No interactive control is added outside scope.

### Responsive and visual

- [ ] `375 × 667px` rating comparison.
- [ ] `768 × 800px` rating comparison.
- [ ] `375 × 667px` thank-you comparison.
- [ ] `768 × 800px` thank-you comparison.
- [ ] `320px` no-overflow check.
- [ ] `767/768px` breakpoint check.
- [ ] Short landscape check.
- [ ] `200%` zoom check.

### Quality

- [ ] Permanent local assets.
- [ ] Overpass weights `400`, `600`, and `700`.
- [ ] Forced-colors behavior.
- [ ] Reduced-motion behavior if transitions exist.
- [ ] Automated flow tests.
- [ ] Automated accessibility scan.
- [ ] Approved visual snapshots.
- [ ] Production preview smoke test.
