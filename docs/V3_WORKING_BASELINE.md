# A-Z Care — V3 Working Baseline

Baseline branch: `v3-working`
Baseline commit: `607bef68f4c573c3e6903bbd61090e124d9ac40f`
Date: 2026-09-04

This is the working baseline for the next round of development. The goal is to preserve the current mobile layout and interactive phone while improving functionality in small, isolated changes.

## What is considered stable

- Main landing structure and section order.
- Mobile header and navigation.
- Interactive Android-style phone shell.
- Bottom dock: Phone, Messages, Browser, Camera.
- Protect / AI Care / Location / Family / Contacts / Settings / Emergency screens.
- Compact landing spacing after the mobile layout cleanup.
- Hardware teaser and Family Dashboard.
- Survey integration and GA4.

## Bugs/regressions already encountered

1. Multiple CSS layers fought each other (`style.css`, `responsive.css`, `landing-v2.css`, `phone-shell-v2.css`, `landing-refine.css`).
2. `core.js` dynamically loaded `responsive.css` again after page load, reintroducing old mobile min-heights and large gaps.
3. `app.js` also previously loaded CSS dynamically, causing duplicate CSS and unpredictable cascade order.
4. Old responsive rules contained large values such as `section padding: 78px`, `phone-stage min-height: 610/690/730px`, and `family-map min-height: 390px`.
5. Hero/base CSS still contains legacy `min-height:100vh`, `section padding:135px`, and large phone-stage values, so the final override layer must remain last until those files are safely cleaned.
6. The Phone dock icon inherited old pseudo-element positioning (`position:absolute; inset:0`), which made the handset/background appear visually shifted.
7. Aggressive landing spacing changes in the past broke the phone layout. Phone geometry must not be changed while adjusting section spacing.
8. MutationObserver-based date/time updates caused an infinite self-trigger loop and must not be reintroduced.
9. External/raw GitHub loaders broke the site. Runtime assets must remain same-origin.
10. Cache busting must be synchronized between `index.html` and `js/app.js` whenever CSS/JS changes need immediate publication.

## Development rules from V3 onward

- Make small targeted edits; no wholesale rewrites unless explicitly requested.
- Before every write, fetch the current file and SHA.
- Never write the same file in parallel.
- Keep `landing-refine.css` as the final layout/spacing override until the legacy CSS is deliberately consolidated.
- Do not dynamically inject CSS from JavaScript.
- Do not touch phone width/height/dock geometry for unrelated landing changes.
- Check GitHub Pages deployment after meaningful visual changes.
- If a visual change does not appear, verify deployment and cache version before adding more CSS overrides.
- Use the `v3-working` branch / baseline commit as rollback reference if a new change breaks the site.

## Next phase

From this baseline, continue function-by-function: calls, messages, browser, camera, settings, location/navigation, sharing, family status, SOS, AI Care, and other phone interactions. Each feature should be implemented and tested independently without changing stable layout unless necessary.
