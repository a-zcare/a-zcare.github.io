import fs from 'node:fs';

const read = (path) => fs.readFileSync(path, 'utf8');
const fail = (message) => { console.error('FAIL:', message); process.exitCode = 1; };
const ok = (message) => console.log('OK:', message);

const index = read('index.html');
const app = read('js/app.js');
const css = read('css/visual-polish.css');
const product = read('js/product-data.js');
const navigation = read('js/navigation.js');
const consent = read('js/consent.js');
const analytics = read('js/analytics.js');
const privacy = read('privacy.html');
const workflow = read('.github/workflows/format.yml');

for (const path of ['privacy.html','hardware.html','js/consent.js','js/analytics.js','js/navigation.js','js/product-data.js','js/app.js','docs/analytics-events.md']) {
  if (!fs.existsSync(path)) fail('missing ' + path);
}

for (const retired of ['widget-merge.js','audience-expansion.js','spec-consistency.js']) {
  if (index.includes(retired)) fail('index still references retired ' + retired);
}

if (!index.includes('id="audiences"')) fail('audience content is not semantic HTML');
if (!index.includes('class="future-concept"')) fail('future concept is not semantic HTML');
if (!index.includes('js/navigation.js')) fail('navigation script is not loaded');
if (!index.includes('js/product-data.js')) fail('product data is not loaded');
if (!css.includes('.menu-toggle')) fail('mobile navigation styles missing');
if (!index.includes('aria-controls="site-navigation"')) fail('semantic navigation toggle missing');
if (!navigation.includes('navigation.inert')) fail('closed mobile navigation is not inert');
if (!navigation.includes("event.key === 'Escape'")) fail('mobile navigation Escape handling missing');
if (!consent.includes('CONSENT_VERSION = 3')) fail('current consent version missing');
if (!consent.includes('CONSENT_MAX_AGE_MS')) fail('consent expiry missing');
if (!analytics.includes('EVENT_SCHEMA_VERSION = 1')) fail('analytics schema version missing');
if (!analytics.includes('window.AZ_PRIVACY?.analyticsAllowed()')) fail('analytics consent gate missing');
if (!analytics.includes('scenario_complete')) fail('analytics scenario events missing');
if (!app.includes('window.AZ_ANALYTICS?.track')) fail('phone demo analytics integration missing');
if (!privacy.includes('fixed list of permitted values')) fail('analytics disclosure missing');
for (const page of ['index.html', 'privacy.html', 'hardware.html']) {
  if (!read(page).includes('js/analytics.js')) fail('analytics module missing from ' + page);
}
if (!privacy.includes('mailto:azcare.project@gmail.com')) fail('privacy contact missing');
if (!workflow.includes('run: npm test')) fail('CI does not run formatting and static checks');
if (!workflow.includes('run: npm run test:e2e')) fail('CI does not run browser tests');
if (!fs.existsSync('playwright.config.js') || !fs.existsSync('tests/e2e/site.spec.js')) {
  fail('Playwright E2E suite missing');
}
if (app.includes('Wi-Fi 7') || app.includes('wireless charging') || app.includes('2400 × 1080')) fail('stale target specs remain in app.js');
if (!app.includes('window.AZ_PRODUCT?.specs')) fail('app does not use shared product specs');
if (!product.includes('Wi-Fi 6E') || !product.includes('65W USB-C PD/PPS')) fail('canonical product specs incomplete');

for (const path of ['index.html','privacy.html','hardware.html','js/app.js','js/navigation.js','js/consent.js']) {
  if (read(path).includes('MutationObserver')) fail('MutationObserver found in ' + path);
}

if (!process.exitCode) ok('static regression checks passed');
