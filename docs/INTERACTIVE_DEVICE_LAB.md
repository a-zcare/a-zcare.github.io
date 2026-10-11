# A-Z Care — Interactive Device Lab (implementation plan)

Status: planned; this document does not claim features are implemented.
Branch: `feature/interactive-device-lab`.
Baseline: existing static HTML/CSS/JS demo, no real emergency or medical service.

## Non-negotiable rules
- Preserve existing landing, Watch/Phone/Ecosystem routes, consent, RU/EN support, accessibility and analytics allowlist.
- Never commit credentials, .env, personal data or client records.
- Label every simulated sensor, notification, location, AI result and SOS event **DEMO**.
- No real emergency dispatch, clinical diagnosis, unsupported non-invasive glucose claims, hidden tracking or silent location sharing.
- Keyboard, touch and reduced-motion support; test widths 320, 390, 768, 1440.
- Implement in small PRs with tests, never a giant unreviewed rewrite.

## Workstream A — Device fidelity
Phone: 19.5:9 silhouette, uniform bezel, AMOLED theme, punch-hole camera, safe-area status bar, correct bottom gesture indicator, physical side buttons, lock screen, notification shade, haptic-like CSS feedback, screen transitions, screen reader labels. Do not emulate an operating system's privileged APIs.
Watch: proportional strap/crown/bezel, AMOLED screen, battery/connectivity indicators, six+ accessible screens, always-visible SOS, tap/swipe/keyboard navigation, compact metric typography, realistic animation and reduced-motion fallback.

## Workstream B — Fully clickable local demo
A deterministic local state store and event bus, no backend dependency:
1. Home launcher with app grid and back/home transitions.
2. SOS: press -> countdown -> cancel/confirm -> route selection -> trusted contact receipt -> acknowledgement -> history; Watch-initiated SOS appears on Phone with device origin; simulate unavailable network and retries; no actual messages.
3. Scam Shield: sample SMS, call and phishing link; inspect red flags, risk explanation, report/block simulation, false positive and uncertainty states.
4. Health Guardian: HR, SpO2, ECG concept, skin temperature, sleep, fall, movement and CGM-external-only; provenance/quality/permissions and no medical claims.
5. Battery Guardian: 100/20/5% modes, selective sync, essential SOS reserve, user-visible transmission events.
6. Connectivity: BLE/phone/LTE/eSIM/Wi-Fi/offline/relay conceptual routes with failures and recovery; never promise guaranteed free internet.
7. Family Safety: consent-controlled sharing, safe zone simulation, check-in, location timeline, trusted contacts, revoke and audit.
8. Kids/Senior modes: font scale, simplified launcher, accessibility, explicit roles and permissions.
9. Privacy Center: per-feature permission toggles, last-data-sent timeline, export/reset demo state.
10. Care Center: simulated dashboard for multiple devices, alerts, roles, acknowledgement and audit.

## Workstream C — UX
A scenario launchpad with 3 top-level device destinations and 3 guided journeys:
- Older adult receives scam SMS, assistant explains and suggests safe action.
- Fall detected on Watch, countdown and linked Phone SOS.
- Child checks in, trusted contact sees consent-scoped status.
Every scenario has Start / Next / Reset and transparent DEMO indicator.
Use RU/EN copy for all new UI; persist language only after preference choice.

## Workstream D — Quality gates
- Extend Playwright E2E: every screen reachable, each action has visible feedback, cross-device SOS, cancel/retry/offline, permissions, responsive overflow, keyboard and screen-reader semantics.
- Run `npm ci`, `npm test`, `npx playwright install chromium`, `npm run test:e2e`.
- Validate no JS errors, broken links, unintended GA events, personal-data leaks, or secrets.
- Performance budgets: avoid heavy image/video payloads, lazy-load offscreen modules.
- Keep existing CI green before merge.

## Suggested PR sequence
1. Device Lab state machine and screen registry + tests.
2. Phone visual polish and clickable app launcher.
3. Watch visual polish and gesture/keyboard controls.
4. Cross-device SOS with offline/error/cancel/acknowledge.
5. Scam Shield and AI explainability (static demo).
6. Health/Battery/Connectivity/Privacy interactive dashboards.
7. Family/Kids/Senior/Care Center and guided journeys.
8. RU/EN, accessibility, performance and final release audit.

## Definition of done
Every visible control works and yields a clear state change; all sample data explicitly simulated; cross-device flows reproducible; no medical/emergency guarantees; mobile and desktop tests pass; preview reviewed before merging to main.
