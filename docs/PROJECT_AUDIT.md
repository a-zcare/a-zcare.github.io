# A-Z Care — implementation audit (in progress)

## Verified baseline

- The public repository uses HTML, CSS and vanilla JavaScript, with Playwright and Prettier.
- The landing page and Device Lab currently have separate visual and interaction implementations.
- Device Lab already simulates SOS, offline retry, watch navigation, privacy consent and scam explanations.
- PR #29's initial run #190: Playwright passed; Prettier failed on `css/device-lab.css`. Do not merge before CI is green.

## Critical gaps

| Priority | Finding | Next action |
| --- | --- | --- |
| P0 | SOS incident text previously used generic 'Watch / Phone demo' source | Preserve actual origin in state; test repeated activation |
| P0 | Watch interface risks clipping near rounded bezel | Visual screenshot regression at 320–430 px; adjust safe-area layout |
| P0 | Settings have inconsistent presentation between device and scenario panel | Standardize switch appearance and state semantics |
| P1 | Homepage and Device Lab use different phone visuals | Consolidate reusable design tokens and navigation |
| P1 | Site is long and duplicates explanations | Introduce Home, Phone, Watch, Ecosystem destinations and tabbed detail views |
| P1 | Every visible control is not yet covered by E2E | Inventory and test buttons, links, switches, tabs, scenarios and keyboard navigation |
| P1 | Language support is inconsistent | Implement RU/EN string catalogs |
| P2 | Watch and health concepts are not validated sensors | Keep clear simulated labels and disclaimers |
| P2 | Hardware, CGM, resilient connectivity and Care Center require separate pilots | Document as concepts, not deployed services |

## Acceptance gates

1. Prettier and Playwright must pass on the PR head commit.
2. Verify all device and scenario controls, including duplicate/invalid actions.
3. Confirm stable phone/watch dimensions and no overflow on mobile and desktop.
4. Check privacy, accessibility, console errors and missing assets.
5. Verify deployment before marking the milestone complete.

This is an interim audit, not a claim that the full master milestone has been completed.
