# Phase 2 — Add Typography and Permanent Assets

**Status:** Pending  
**Application root:** `vanilla/`  
**Depends on:** Phase 1 complete

## Objective

Install the required local font weights and place faithful, permanent design assets in the application without modifying the source references.

## Expected outcome

Overpass and both decorative SVG assets are bundled locally, production paths are stable, and no runtime request depends on Figma or a font CDN.

## Source of truth

- Figma star component and illustration node `314:198`.
- `docs/assets/images/icon-star.svg`.
- `docs/assets/images/illustration-thank-you.svg`.
- `SPEC.md` asset and typography requirements.

## Locked decisions

- Reuse the existing exact SVG files; do not redraw them.
- Copy assets into `vanilla/src/assets/`; leave `docs/assets/` unchanged.
- Use the star SVG as the public favicon.
- Import only Overpass normal weights `400`, `600`, and `700`.

## Tasks

- [ ] Copy `icon-star.svg` into `vanilla/src/assets/`.
- [ ] Copy `illustration-thank-you.svg` into `vanilla/src/assets/`.
- [ ] Confirm the star is approximately `17 × 16`.
- [ ] Confirm the illustration is `162 × 108` with a `1.5:1` aspect ratio.
- [ ] Inspect both SVGs for valid dimensions/view boxes and preserved rendering.
- [ ] Copy the exact star artwork to `vanilla/public/favicon.svg`.
- [ ] Update the favicon reference in `index.html`.
- [ ] Add `@fontsource/overpass` with pnpm.
- [ ] Import normal weights `400`, `600`, and `700` from `main.ts`.
- [ ] Define a resilient system fallback stack in the token layer.
- [ ] Confirm assets are imported through Vite rather than hard-coded output paths.
- [ ] Search source for font CDNs and temporary Figma MCP URLs.
- [ ] Run a production build and inspect emitted asset names.
- [ ] Block font and image requests in a browser and confirm the shell remains understandable.

## Verification

```bash
cd vanilla
pnpm build
rg -n "figma.com/api/mcp/asset|fonts.googleapis.com|fonts.gstatic.com" src index.html
```

The search must return no runtime dependency.

## Required evidence

- SVG dimension inspection.
- Dependency and lockfile diff.
- Production asset list showing hashed local files.
- Font/image failure notes.

## Exit criteria

- [ ] Exact permanent assets exist under `src/assets/`.
- [ ] The favicon uses the star artwork.
- [ ] All three font weights load locally.
- [ ] No expiring or third-party runtime asset URL exists.
- [ ] The production build succeeds.

## Relevant acceptance criteria

- AC-015 permanent assets.

## Non-goals

- Recreating SVG paths or CSS illustrations.
- Editing `docs/assets/` or `docs/design/`.
- Implementing card content or responsive layout.
