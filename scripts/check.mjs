import fs from 'node:fs';

const read = (path) => fs.readFileSync(path, 'utf8');
const fail = (message) => { console.error('FAIL:', message); process.exitCode = 1; };
const ok = (message) => console.log('OK:', message);

const index = read('index.html');
const app = read('js/app.js');
const css = read('css/visual-polish.css');
const product = read('js/product-data.js');

for (const path of ['privacy.html','hardware.html','js/consent.js','js/navigation.js','js/product-data.js','js/app.js']) {
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
if (app.includes('Wi-Fi 7') || app.includes('wireless charging') || app.includes('2400 × 1080')) fail('stale target specs remain in app.js');
if (!app.includes('window.AZ_PRODUCT?.specs')) fail('app does not use shared product specs');
if (!product.includes('Wi-Fi 6E') || !product.includes('65W USB-C PD/PPS')) fail('canonical product specs incomplete');

for (const path of ['index.html','privacy.html','hardware.html','js/app.js','js/navigation.js','js/consent.js']) {
  if (read(path).includes('MutationObserver')) fail('MutationObserver found in ' + path);
}

if (!process.exitCode) ok('static regression checks passed');
