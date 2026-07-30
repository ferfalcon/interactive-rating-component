# Interactive Rating Component — Design Definition

**Document:** `DESIGN.md`  
**Status:** Ready for specification review  
**Last reviewed:** 2026-07-29  
**Design source of truth:** [Figma node `314:75`](https://www.figma.com/design/bPv2sIvgnlNMRaAkxk7RcR/-Test-02--Material-Theme-Builder-playground--Copy-?node-id=314-75)  
**Implementation target:** Responsive Vite web application

## 1. Purpose

The app collects a simple satisfaction rating from 1 to 5 and confirms the submitted value. It is intentionally small and focused: one decision, one primary action, and one clear confirmation state.

The experience should feel:

- Fast and effortless.
- Friendly without being playful or distracting.
- Visually compact and calm.
- Clear at a glance on both mobile and desktop.
- Fully usable with a mouse, touch, or keyboard.

The product contains two application views:

1. **Rating view** — the user reads a short prompt, chooses one value from 1 to 5, and submits it.
2. **Thank-you view** — the app confirms the selected value and displays a short acknowledgement.

The Figma file presents these as separate page sections. It does not define whether the implementation should use separate routes or two states in one route. That architectural choice belongs in `SPEC.md` and `PLAN.md`.

## 2. Experience principles

### 2.1 One dominant task

The rating selection is the only decision on the first view. The submit button is the only primary action. No secondary navigation or unrelated controls should compete with them.

### 2.2 Progressive confirmation

A selected rating receives the orange accent before submission. After submission, the interface replaces the form with a confirmation view containing the exact selected value.

### 2.3 Strong hierarchy through contrast

The design uses a nearly black page background, a subtly lighter gradient card, white headings, muted grey supporting text, and one orange accent. The orange is reserved for meaningful feedback and primary action.

### 2.4 Compact, touch-friendly controls

The circular rating controls remain large enough for touch use. The mobile controls are exactly `44 × 44px`, meeting the common minimum target-size expectation without requiring invisible hit-area expansion.

## 3. Source frames and design inventory

### 3.1 Application views

| View | Figma node | Reference viewport | Card size |
|---|---:|---:|---:|
| Rating — mobile | `314:119` | `375 × 667px` | `327 × 353px` |
| Rating — desktop | `314:129` | `768 × 800px` | `412 × 412px` |
| Thank you — mobile | `314:140` | `375 × 667px` | `327 × 360px` |
| Thank you — desktop | `314:149` | `768 × 800px` | `412 × 416px` |

### 3.2 Local components

| Component | Figma node | Variants or purpose |
|---|---:|---|
| Submit button | `314:159` | `Regular`, `Active` |
| Star badge | `314:164` | Decorative icon container |
| Rating button | `314:166` | `Default`, `Selected`, `Active`; mobile and desktop layouts |
| Rating group | `314:185` | Mobile and desktop arrangements |
| Thank-you illustration | `314:198` | Decorative confirmation artwork |

### 3.3 Style-guide sections

The file includes local color, typography, and spacing guides. The application frames also reference Figma variables directly. The card gradient variable exists but has no reusable value in the variable definition; its actual fill is applied directly to the card layers.

## 4. Global visual foundation

## 4.1 Color palette

| Design role | Figma token or source | Value | Use |
|---|---|---:|---|
| Page background | `colors/grey/950` | `#131518` | Full viewport background; dark text on orange controls |
| Raised control surface | `colors/grey/900` | `#262E38` | Rating circles, star badge, result pill |
| Supporting text | `colors/grey/500` | `#969FAD` | Body copy and unselected rating numbers |
| Primary accent | `colors/orange/500` | `#FC7614` | Selected rating, star, submit button, result text |
| Primary text | `colors/white` | `#FFFFFF` | Headings and hover treatment |
| Card gradient start | Direct card fill | `#232A34` | Top/central highlight of card |
| Card gradient end | Direct card fill | `#181E27` | Outer/lower card surface |

### 4.1.1 Card gradient

The card uses a subtle radial or elliptical gradient originating near the top center:

```css
radial-gradient(ellipse at top, #232a34 0%, #181e27 100%)
```

This CSS expression is the intended semantic approximation of the Figma fill. The implementation should compare the rendered result against the screenshots and adjust the gradient size or stop positions if needed.

Create explicit implementation tokens for both gradient colors. Do not leave the card dependent on an empty `colors/gradient/1` token.

### 4.1.2 Contrast observations

Contrast ratios calculated from the defined colors are comfortably above WCAG AA for the intended text sizes:

| Foreground / background | Approximate ratio |
|---|---:|
| `#969FAD` on `#232A34` | `5.41:1` |
| `#969FAD` on `#181E27` | `6.27:1` |
| `#FFFFFF` on `#181E27` | `16.75:1` |
| `#131518` on `#FC7614` | `6.74:1` |
| `#262E38` on `#FC7614` | `5.06:1` |
| `#FC7614` on `#262E38` | `5.06:1` |

Because the card is a gradient, body-copy contrast should be validated against the lightest local point after implementation.

## 4.2 Typography

The application uses **Overpass** throughout.

Recommended fallback stack:

```css
font-family: "Overpass", system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
```

Required font weights are `400`, `600`, and `700`.

| Role | Mobile | Desktop |
|---|---|---|
| Heading | `24px / 30px`, weight `700` | `28px / 35px`, weight `700` |
| Body | `14px / 22px`, weight `400` | `15px / 24px`, weight `400` |
| Rating number | `16px / 24px`, weight `700`, `0.2px` tracking | Same |
| Button label | `14px / 24px`, weight `600`, `0.17px` tracking | Same |
| Result text | Body style, orange, centered | Body style, orange, centered |

Headings use no additional letter spacing. Body text uses no additional letter spacing.

The font-size change between mobile and desktop is discrete in Figma, not fluid. A breakpoint should switch between the mobile and desktop type styles.

## 4.3 Spacing scale

Figma variables define the following base spacing values:

| Token | Value |
|---|---:|
| `spacing/0` | `0px` |
| `spacing/100` | `8px` |
| `spacing/200` | `16px` |
| `spacing/300` | `24px` |
| `spacing/400` | `32px` |
| `spacing/500` | `40px` |

The visual system is primarily built from `16px`, `24px`, and `32px` relationships. Preserve these relationships rather than introducing arbitrary near-equivalent values.

Unique measured values such as the desktop rating-card content width (`351px`) and its resulting `30.5px` side inset are layout outputs, not additions to the global spacing scale.

## 4.4 Shape and radius

| Element | Mobile | Desktop |
|---|---:|---:|
| Main card | `15px` | `30px` |
| Rating control | Circle | Circle |
| Star badge | Circle | Circle |
| Submit button | Pill, `22.5px` reference radius | Pill, `22.5px` reference radius |
| Result badge | Pill, `22.5px` reference radius | Pill, `22.5px` reference radius |

Pill and circular components may use `border-radius: 999px` in code. Card radii should retain the explicit mobile and desktop values because the visible change is intentional.

## 5. Global page layout

The page is a full-viewport dark canvas with one centered card.

### 5.1 Alignment

- Center the card horizontally.
- Center the card vertically when the viewport has enough height.
- Preserve at least `24px` of page padding on narrow screens.
- Do not use absolute pixel offsets copied from the Figma viewport frames.

### 5.2 Short viewport and zoom behavior

The design screenshots show comfortable vertical space, but production layout must remain usable when:

- Browser UI reduces the visual viewport.
- The device is in landscape orientation.
- Text is zoomed.
- User font settings increase text size.

Use intrinsic content height. The card may move away from perfect vertical centering when the available height is insufficient. Page content must remain scrollable and must not be clipped.

The Figma card heights describe the expected result with the supplied English content; they should not become hard `height` constraints unless testing proves that no content can overflow.

## 6. Rating view

## 6.1 Visual anatomy

From top to bottom:

1. Decorative circular star badge.
2. Prompt heading.
3. Supporting description.
4. Horizontal 1–5 rating group.
5. Full-width submit button.

The first four items form the primary content area. The submit button is visually separated from the rating group by a larger major gap.

## 6.2 Content

**Heading**

> How did we do?

**Supporting text**

> Please let us know how we did with your support request. All feedback is appreciated to help us improve our offering!

**Rating values**

> 1, 2, 3, 4, 5

**Primary action**

> SUBMIT

The button label is uppercase in the current Figma source. Preserve the supplied visible casing rather than applying CSS `text-transform`, so assistive technologies and copied text receive the intended label.

## 6.3 Mobile reference layout

Reference frame: `375 × 667px`  
Card: `327 × 353px`, centered at `x: 24px`, `y: 156.5px`

| Measurement | Value |
|---|---:|
| Card width | `327px` |
| Card reference height | `353px` |
| Card inset | `24px` on all sides |
| Content width | `279px` |
| Star badge | `40 × 40px` |
| Gap after star | `24px` |
| Heading height | `30px` |
| Heading-to-body gap | `16px` |
| Body reference height | `66px` |
| Body-to-rating gap | `16px` |
| Rating controls | `44 × 44px` |
| Rating-row width | `279px` |
| Gap before submit | `24px` |
| Submit button | `279 × 45px` |

The rating row uses distributed spacing. Five `44px` controls occupy `220px`, leaving `59px` distributed across four gaps, approximately `14.75px` each.

## 6.4 Desktop reference layout

Reference frame: `768 × 800px`  
Card: `412 × 412px`, centered at `x: 178px`, `y: 194px`

| Measurement | Value |
|---|---:|
| Card width | `412px` |
| Card reference height | `412px` |
| Card top and bottom inset | `32px` |
| Content width | `351px` |
| Resulting side inset | `30.5px` |
| Star badge | `48 × 48px` |
| Gap after star | `32px` |
| Heading height | `35px` |
| Heading-to-body gap | `16px` |
| Body reference height | `72px` |
| Body-to-rating gap | `16px` |
| Rating controls | `52 × 52px` |
| Rating-row width | `351px` |
| Gap before submit | `32px` |
| Submit button | `351 × 45px` |

Five `52px` controls occupy `260px`, leaving `91px` distributed across four gaps, approximately `22.75px` each.

## 6.5 Rating-group design

The controls are circular, equal in size, and evenly distributed across the content width. They must remain on one row for the supported 1–5 scale.

The control size changes by breakpoint:

- Mobile: `44px`.
- Desktop: `52px`.

The number typography does not change between breakpoints.

## 7. Thank-you view

## 7.1 Visual anatomy

From top to bottom:

1. Decorative confirmation illustration.
2. Pill-shaped result badge.
3. Centered thank-you heading.
4. Centered supporting message.

Unlike the rating view, all thank-you content is center-aligned.

## 7.2 Dynamic content

**Result badge**

> You selected {rating} out of 5

The value shown must be the rating submitted in the previous view. The Figma example displays `4`, but `4` is sample state, not fixed content.

**Heading**

> Thank you!

**Supporting text**

> We appreciate you taking the time to give a rating. If you ever need more support, don’t hesitate to get in touch!

## 7.3 Mobile reference layout

Reference frame: `375 × 667px`  
Card: `327 × 360px`, centered at `x: 24px`, `y: 153px`

| Measurement | Value |
|---|---:|
| Card width | `327px` |
| Card reference height | `360px` |
| Content width | `279px` |
| Content reference height | `288px` |
| Content top and bottom space | `36px` |
| Illustration | `144 × 96px` |
| Major vertical gaps | `24px` |
| Result badge | `168 × 32px` |
| Heading height | `30px` |
| Heading-to-body gap | `16px` |
| Body reference height | `66px` |

The content-height calculation is exact in the reference:

```text
96 + 24 + 32 + 24 + 30 + 16 + 66 = 288px
```

## 7.4 Desktop reference layout

Reference frame: `768 × 800px`  
Card: `412 × 416px`, centered at `x: 178px`, `y: 192px`

| Measurement | Value |
|---|---:|
| Card width | `412px` |
| Card reference height | `416px` |
| Content width | `340px` |
| Content reference height | `327px` |
| Content top and bottom space | `44.5px` |
| Illustration | `162 × 108px` |
| Major vertical gaps | `32px` |
| Result badge | `193 × 32px` |
| Heading height | `35px` |
| Heading-to-body gap | `16px` |
| Body reference height | `72px` |

The content-height calculation is exact in the reference:

```text
108 + 32 + 32 + 32 + 35 + 16 + 72 = 327px
```

## 8. Component definitions

## 8.1 Card surface

The rating and thank-you views share the same visual card foundation:

- Dark radial gradient.
- No visible border.
- No drop shadow in the source design.
- `15px` mobile radius.
- `30px` desktop radius.
- Content positioned above the decorative gradient layer.

The two cards should share a reusable visual class or component, while allowing each view to control its own internal layout.

## 8.2 Star badge

- Decorative circular container.
- Surface: `#262E38`.
- Star: orange.
- Star artwork is approximately `16px` high in both layouts.
- Badge size: `40px` mobile, `48px` desktop.

The star does not communicate unique information and should be hidden from assistive technology.

## 8.3 Rating control

Figma defines three named states:

| Figma state | Surface | Number | Visual interpretation |
|---|---|---|---|
| `Default` | `#262E38` | `#969FAD` | Unselected and idle |
| `Selected` | `#FFFFFF` | `#262E38` | Hover or focus preview |
| `Active` | `#FC7614` | `#262E38` | Chosen/current rating |

The names do not map cleanly to web interaction semantics: the orange state is called `Active`, while the white state is called `Selected`. For implementation, use semantic state names and treat the Figma names only as visual references.

Recommended semantic mapping:

| Web state | Figma visual reference |
|---|---|
| Idle, unchecked | `Default` |
| Hovered, unchecked | `Selected` |
| Focused, unchecked | `Selected` plus a visible focus outline |
| Checked | `Active` |
| Checked and focused | `Active` plus a visible focus outline |

The selected value must not be indicated by color alone. Native checked state and accessible naming provide the semantic distinction; a visible focus outline must identify keyboard focus independently.

## 8.4 Submit button

| Figma state | Surface | Label |
|---|---|---|
| `Regular` | `#FC7614` | `#131518` |
| `Active` | `#FFFFFF` | `#131518` |

The white variant is most plausibly the pointer-hover or pressed visual. The source does not separately define hover, focus, active/pressed, disabled, or loading states.

Recommended state mapping:

- Default: orange background.
- Hover: white background.
- Pressed: white background; no layout movement.
- Focus visible: current background plus a separate high-contrast outline.
- Disabled or validation behavior: unresolved; define in `SPEC.md` rather than inventing a visually silent disabled state.

The button is always `45px` high and spans the full width of the card content column.

## 8.5 Result badge

- Height: `32px` in both layouts.
- Surface: `#262E38`.
- Text: orange.
- Fully rounded pill.
- Centered horizontally.
- Width changes to fit the breakpoint-specific type and padding: `168px` mobile, `193px` desktop in the example.

Prefer intrinsic width with horizontal padding rather than a fixed width, provided the English reference renders at the measured dimensions.

## 8.6 Thank-you illustration

- Mobile: `144 × 96px`.
- Desktop: `162 × 108px`.
- Aspect ratio: `1.5:1`.
- Centered.
- Decorative rather than informational.

The Figma component contains many individual vector layers. Export and commit one faithful SVG asset. Do not recreate the illustration with manually authored HTML elements, CSS shapes, or approximate vectors.

## 9. Interaction model

## 9.1 Initial state

No rating should be visually chosen when the app first loads, even though the Figma example displays rating `4` to demonstrate the selected state.

The form should preserve a clear distinction among:

- No selection.
- Hover or focus preview.
- Submitted selection.

## 9.2 Selecting a rating

Selecting a new rating replaces the previous selected value. Only one value may be checked at a time.

Pointer behavior:

- Hovering an unchecked value displays the white visual.
- Clicking or tapping a value selects it and displays the orange visual.

Keyboard behavior:

- Tab enters the rating group.
- Arrow keys move among radio choices when native radio behavior is used.
- Space selects the focused value.
- A visible focus indicator remains present independently of the selected color.

## 9.3 Submitting

Submitting a valid selection transitions to the thank-you view and carries the selected number into the result badge.

The design does not specify:

- Behavior when the user submits without choosing a rating.
- An inline validation message.
- A disabled button treatment.
- A loading or asynchronous state.
- A way to return to the rating view.

These are explicit open decisions for `SPEC.md`.

## 9.4 Motion

Figma does not define animation or transition timing.

If transitions are introduced:

- Keep state-color transitions subtle, approximately `120–180ms`.
- Avoid scaling controls in a way that causes layout movement.
- Do not animate the whole card unless the transition improves comprehension.
- Respect `prefers-reduced-motion`.

Motion is optional; visual fidelity does not depend on it.

## 10. Responsive behavior

## 10.1 Mobile-first baseline

The `375px` frame is the mobile source of truth. The layout should remain usable below `375px` by allowing the card to shrink within page padding:

```text
card width = min(327px, available viewport width after page padding)
```

Do not permit horizontal scrolling at `320px` viewport width.

## 10.2 Desktop mode

The `768px` frame is the desktop source of truth. At desktop size:

- Card width grows from `327px` to `412px`.
- Card radius grows from `15px` to `30px`.
- Heading and body typography increase.
- Rating controls grow from `44px` to `52px`.
- Star badge grows from `40px` to `48px`.
- Major vertical gaps grow from `24px` to `32px`.
- Thank-you illustration grows from `144 × 96px` to `162 × 108px`.

## 10.3 Working breakpoint assumption

Figma provides no intermediate tablet frame and no explicit breakpoint token.

Working design assumption:

- Use the mobile layout below `48rem` (`768px`).
- Switch to desktop measurements at `48rem` and above.

This is intentionally conservative and directly tied to the supplied desktop reference width. It should be validated during implementation review. A different breakpoint may be adopted if visual testing shows an unnecessarily sparse tablet presentation, but the decision must be documented rather than silently changed.

## 10.4 Fluid versus fixed properties

Use fluid behavior for:

- Page padding.
- Card placement.
- Card width below its maximum.
- Text wrapping and card height.

Use breakpoint-based values for:

- Card maximum width.
- Card radius.
- Heading and body type styles.
- Rating-control size.
- Star-badge size.
- Major vertical gaps.
- Illustration size.

## 11. Accessibility design requirements

## 11.1 Semantic structure

The rating view should be represented as a real form:

- One primary heading.
- A `<fieldset>` grouping the five values.
- A meaningful `<legend>` or accessible group label.
- Five native radio inputs associated with visible labels.
- One native submit button.

Do not implement rating choices or the submit action as clickable generic `<div>` elements.

## 11.2 Accessible names

Each radio choice must expose an unambiguous name, for example:

- “1 out of 5”
- “2 out of 5”
- “3 out of 5”
- “4 out of 5”
- “5 out of 5”

The result sentence should remain ordinary readable text and contain the submitted value.

## 11.3 Focus visibility

Figma does not provide a dedicated focus-visible state. Complete the design with a focus indicator that does not depend on background inversion alone.

Recommended treatment:

- `2px` solid white outline.
- `3px` outline offset.
- Apply to rating labels and the submit button when their associated interactive element receives `:focus-visible`.
- Ensure the treatment remains visible in the orange, white, and dark states.
- Preserve usability in forced-colors mode.

This addition is an accessibility completion, not a deviation from the core visual language.

## 11.4 Touch targets

- Mobile rating controls are `44 × 44px` and must not be reduced.
- Desktop rating controls are `52 × 52px`.
- Submit button height is `45px`.
- Ensure spacing between controls remains clickable and does not create overlapping hit areas.

## 11.5 Zoom and text resizing

At `200%` text zoom:

- Text must not overlap controls.
- Card height may grow.
- Page must scroll when required.
- No content may be clipped by fixed card heights.
- The result badge may grow in width or wrap only as a last resort.

## 11.6 Decorative assets

The star and thank-you illustration are decorative in this experience. Use empty alternative text or an equivalent presentation-hidden treatment. Do not repeat nearby visible text in asset alternative text.

## 11.7 Focus after submission

When the view changes, move focus to the thank-you heading or a suitable confirmation container so keyboard and screen-reader users are informed that submission succeeded.

If separate routes are used, ensure the new document view receives equivalent focus management.

## 11.8 Validation design gap

The source design has no no-selection error state. The implementation must not rely on an alert-only or color-only error. `SPEC.md` should decide whether to:

- Keep submit enabled and reveal an inline error, or
- Prevent submission through another clearly communicated mechanism.

Any inline error addition should use the existing type scale and accent palette and allow the card to grow intrinsically.

## 12. Content hierarchy and voice

The copy is concise, direct, and supportive.

### Rating view hierarchy

1. “How did we do?” — primary prompt.
2. Supporting explanation — why feedback matters.
3. Rating controls — requested response.
4. “SUBMIT” — completion action.

### Thank-you view hierarchy

1. Illustration — positive visual acknowledgement.
2. Selected-value badge — immediate confirmation of what was submitted.
3. “Thank you!” — primary acknowledgement.
4. Supporting message — closes the interaction warmly.

Do not add extra instructional copy unless required to resolve validation or accessibility gaps.

## 13. Asset handling

- Use the exact star and thank-you artwork exported from Figma.
- Download and commit permanent asset files; Figma MCP asset URLs are temporary and must not be committed as runtime dependencies.
- Prefer SVG for both assets to preserve sharpness at both reference sizes.
- Preserve the illustration aspect ratio.
- Do not inline manually recreated SVG paths unless the exported source itself is intentionally stored inline by the project.

## 14. Assumptions and unresolved questions

### 14.1 Confirmed design facts

- The application has rating and thank-you views in mobile and desktop forms.
- The visible primary action label is `SUBMIT`.
- The example selected value is `4`.
- The selected value must be dynamic in the thank-you badge.
- Mobile and desktop use different card sizes, radii, type scales, control sizes, artwork sizes, and major spacing.
- The page and card use distinct dark surfaces.

### 14.2 Working assumptions

- The orange rating state represents the checked value.
- The white rating state represents hover or focus preview.
- The white submit state represents hover or pressed feedback.
- A `48rem` breakpoint switches to the desktop design.
- Cards should use intrinsic height even though Figma provides exact reference heights.
- The star and confirmation illustration are decorative.

### 14.3 Open questions for `SPEC.md`

1. Is the thank-you view a separate route or conditional state in one route?
2. What happens when submit is activated without a rating?
3. Should the submit button ever be disabled?
4. Is there a retry or “rate again” path from the thank-you view?
5. Should the selected rating persist after refresh or navigation?
6. What exact focus target should receive focus after submission?
7. Should the transition between views be animated?
8. Is `48rem` the final breakpoint after browser comparison testing?
9. Should the result badge use fixed reference widths or intrinsic content width?
10. Is analytics or submission persistence part of the experience, or is the interaction entirely client-side?

## 15. Visual review checklist

### Global

- [ ] Page background matches `#131518`.
- [ ] Card gradient is visibly distinct but subtle.
- [ ] Overpass loads at weights `400`, `600`, and `700`.
- [ ] Card is centered with safe page padding.
- [ ] No horizontal overflow at `320px` width.

### Rating view

- [ ] Mobile card matches the `327px` reference maximum width.
- [ ] Desktop card matches the `412px` reference width.
- [ ] Star badge is `40px` mobile and `48px` desktop.
- [ ] Rating controls are `44px` mobile and `52px` desktop.
- [ ] Rating controls remain evenly distributed.
- [ ] Only one rating can appear selected.
- [ ] Hover, checked, and focus-visible states are distinguishable.
- [ ] Submit button is `45px` high and spans the content width.
- [ ] Button label reads `SUBMIT`.

### Thank-you view

- [ ] Illustration uses the exact exported asset.
- [ ] Illustration is `144 × 96px` mobile and `162 × 108px` desktop.
- [ ] Result badge contains the submitted value.
- [ ] All content is center-aligned.
- [ ] Mobile major gaps are `24px`; desktop major gaps are `32px`.

### Accessibility and resilience

- [ ] Rating controls use native radio semantics.
- [ ] Submit uses a native button.
- [ ] Every interactive element has a visible focus state.
- [ ] Keyboard-only flow can select and submit a rating.
- [ ] Focus is managed after submission.
- [ ] Decorative artwork is hidden from assistive technology.
- [ ] Layout remains usable at `200%` text zoom.
- [ ] Reduced-motion preferences are respected if animation is added.

## 16. Figma implementation cautions

- Treat Figma-generated React and Tailwind output only as measurement reference. The project should use its own semantic HTML and maintainable CSS.
- Do not copy absolute positioning used to center the card inside the reference frames.
- Do not add Tailwind solely because the Figma export expresses measurements as Tailwind utilities.
- Do not reproduce the thank-you illustration from its individual generated vector fragments.
- Do not preserve Figma variant names when they conflict with web-state terminology.
- Do not hard-code the sample rating value `4`.
- Do not hard-code card heights in a way that breaks zoom, wrapping, or validation content.
