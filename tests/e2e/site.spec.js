import { expect, test } from '@playwright/test';

const viewports = [
  { name: 'phone-390', width: 390, height: 844 },
  { name: 'tablet-768', width: 768, height: 1024 },
  { name: 'desktop-1440', width: 1440, height: 900 },
];

const responsiveEdgeViewports = [
  { name: 'phone-320', width: 320, height: 700 },
  { name: 'phone-430', width: 430, height: 932 },
  ...viewports,
];

const readAnalyticsEvents = (page) =>
  page.evaluate(() =>
    (window.dataLayer || [])
      .map((entry) => Array.from(entry))
      .filter(([command]) => command === 'event')
      .map(([, name, parameters]) => ({ name, parameters })),
  );

for (const viewport of viewports) {
  test.describe(viewport.name, () => {
    test.use({ viewport: { width: viewport.width, height: viewport.height } });

    test('loads without JavaScript errors, broken images or horizontal overflow', async ({
      page,
    }) => {
      const errors = [];
      page.on('pageerror', (error) => errors.push(error.message));

      await page.goto('/');
      await expect(page.locator('#phoneView')).toBeVisible();
      await expect
        .poll(() =>
          page.evaluate(
            () => document.documentElement.scrollWidth <= document.documentElement.clientWidth + 1,
          ),
        )
        .toBe(true);

      const brokenImages = await page
        .locator('img')
        .evaluateAll((images) =>
          images
            .filter((image) => !image.complete || image.naturalWidth === 0)
            .map((image) => image.src),
        );
      expect(brokenImages).toEqual([]);
      expect(errors).toEqual([]);
    });
  });
}

test('phone and watch showcase keeps usable visual proportions across breakpoints', async ({
  page,
}) => {
  for (const viewport of responsiveEdgeViewports) {
    await page.setViewportSize({ width: viewport.width, height: viewport.height });
    await page.goto('/#product');

    const phone = page.locator('.showcase-phone-demo .phone');
    const watch = page.locator('.watch-shell');
    await expect(phone).toBeVisible();
    await expect(watch).toBeVisible();

    const metrics = await page.evaluate(() => {
      const phoneElement = document.querySelector('.showcase-phone-demo .phone');
      const phone = phoneElement.getBoundingClientRect();
      const phoneStyle = getComputedStyle(phoneElement);
      const watch = document.querySelector('.watch-shell').getBoundingClientRect();
      return {
        phoneCssWidth: parseFloat(phoneStyle.width),
        phoneCssHeight: parseFloat(phoneStyle.height),
        phoneVisualWidth: phone.width,
        phoneVisualHeight: phone.height,
        watchWidth: watch.width,
        watchHeight: watch.height,
        viewportWidth: document.documentElement.clientWidth,
      };
    });

    expect(metrics.phoneCssHeight / metrics.phoneCssWidth, viewport.name).toBeGreaterThan(2.1);
    expect(metrics.phoneCssHeight / metrics.phoneCssWidth, viewport.name).toBeLessThan(2.7);
    expect(metrics.phoneVisualWidth, viewport.name).toBeLessThan(metrics.viewportWidth);
    expect(metrics.phoneVisualHeight, viewport.name).toBeGreaterThan(
      metrics.phoneVisualWidth * 1.5,
    );
    expect(metrics.watchWidth, viewport.name).toBeGreaterThan(100);
    expect(metrics.watchHeight, viewport.name).toBeGreaterThan(100);
  }
});

test('internal links and anchors resolve', async ({ page, request }) => {
  await page.goto('/');
  const links = await page
    .locator('a[href]')
    .evaluateAll((nodes) => [
      ...new Set(nodes.map((node) => node.getAttribute('href')).filter(Boolean)),
    ]);

  for (const href of links) {
    if (href.startsWith('#')) {
      expect(await page.locator(href).count(), `Missing anchor ${href}`).toBeGreaterThan(0);
      continue;
    }
    if (/^(mailto:|tel:|javascript:)/.test(href) || href.startsWith('http')) continue;

    const response = await request.get(new URL(href, page.url()).toString());
    expect(response.status(), href).toBeLessThan(400);
  }
});

for (const viewport of viewports.filter((item) => item.width <= 800)) {
  test.describe(`${viewport.name} navigation`, () => {
    test.use({ viewport: { width: viewport.width, height: viewport.height } });

    test('menu opens, closes with Escape and restores focus', async ({ page }) => {
      await page.goto('/');
      const toggle = page.locator('.menu-toggle');
      const navigation = page.locator('#site-navigation');

      await expect(toggle).toBeVisible();
      await expect(toggle).toHaveAttribute('aria-controls', 'site-navigation');
      await expect(toggle).toHaveAttribute('aria-expanded', 'false');
      await expect(navigation).toHaveAttribute('inert', '');

      await toggle.click();
      await expect(toggle).toHaveAttribute('aria-expanded', 'true');
      await expect(navigation).toHaveClass(/is-open/);
      await expect(navigation).not.toHaveAttribute('inert', '');

      await page.keyboard.press('Escape');
      await expect(toggle).toHaveAttribute('aria-expanded', 'false');
      await expect(toggle).toBeFocused();
      await expect(navigation).toHaveAttribute('inert', '');
    });

    test('keyboard opens the menu and activates a link', async ({ page }) => {
      await page.goto('/');
      const toggle = page.locator('.menu-toggle');

      await toggle.focus();
      await toggle.press('Enter');
      await expect(toggle).toHaveAttribute('aria-expanded', 'true');
      await expect(toggle).toBeFocused();

      const firstLink = page.getByRole('link', { name: 'Why', exact: true });
      await page.keyboard.press('Tab');
      await expect(firstLink).toBeFocused();
      await page.keyboard.press('Enter');

      await expect.poll(() => page.evaluate(() => window.location.hash)).toBe('#why');
      await expect(page.locator('#why')).toBeInViewport();
      await expect(toggle).toHaveAttribute('aria-expanded', 'false');
    });
  });
}

test('navigation resets when moving from mobile to desktop', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto('/');
  const toggle = page.locator('.menu-toggle');
  const navigation = page.locator('#site-navigation');

  await toggle.click();
  await expect(toggle).toHaveAttribute('aria-expanded', 'true');
  await page.setViewportSize({ width: 1366, height: 768 });

  await expect(toggle).toHaveAttribute('aria-expanded', 'false');
  await expect(toggle).toBeHidden();
  await expect(navigation).not.toHaveAttribute('inert', '');
});

test('optional analytics stays off until a valid choice is saved', async ({ page }) => {
  const analyticsRequests = [];
  page.on('request', (request) => {
    if (request.url().includes('googletagmanager.com')) analyticsRequests.push(request.url());
  });

  await page.goto('/');
  const banner = page.locator('#consentBanner');
  await expect(banner).toBeVisible();
  expect(analyticsRequests).toEqual([]);

  await page.getByRole('button', { name: 'Reject optional' }).click();
  await expect(banner).toBeHidden();
  await page.reload();
  await expect(banner).toBeHidden();
  expect(analyticsRequests).toEqual([]);

  const saved = await page.evaluate(() => JSON.parse(localStorage.getItem('azcare_consent_v3')));
  expect(saved).toMatchObject({ analytics: false, version: 3 });
});

test('expired consent is ignored and the site asks again', async ({ page }) => {
  await page.addInitScript(() => {
    localStorage.setItem(
      'azcare_consent_v3',
      JSON.stringify({ analytics: true, version: 3, updatedAt: '2025-01-01T00:00:00.000Z' }),
    );
  });

  await page.goto('/');
  await expect(page.locator('#consentBanner')).toBeVisible();
  await expect(page.locator('script[data-analytics-id]')).toHaveCount(0);
});

test('privacy settings can enable analytics explicitly', async ({ page }) => {
  const analyticsRequests = [];
  await page.route('https://www.googletagmanager.com/**', async (route) => {
    analyticsRequests.push(route.request().url());
    await route.abort();
  });

  await page.goto('/');
  await page.getByRole('button', { name: 'Manage choices' }).click();
  const dialog = page.getByRole('dialog', { name: 'Choose what this site may use' });
  await expect(dialog).toBeVisible();
  await page.getByLabel('Optional analytics').check();
  await page.getByRole('button', { name: 'Save choices' }).click();

  await expect(dialog).toBeHidden();
  await expect.poll(() => analyticsRequests.length).toBe(1);
  const saved = await page.evaluate(() => JSON.parse(localStorage.getItem('azcare_consent_v3')));
  expect(saved).toMatchObject({ analytics: true, version: 3 });
});

test('interaction events are discarded before analytics consent', async ({ page }) => {
  await page.goto('/');
  await page.getByRole('button', { name: 'Messages', exact: true }).click();
  await page.getByRole('button', { name: 'Scan this message' }).click();

  expect(await readAnalyticsEvents(page)).toEqual([]);
  expect(
    await page.evaluate(() =>
      window.AZ_ANALYTICS.track('scenario_complete', {
        scenario_name: 'sos',
        result: 'simulation_complete',
      }),
    ),
  ).toBe(false);
});

test('consented events use the allowlisted schema and exclude free text', async ({ page }) => {
  await page.addInitScript(() => {
    localStorage.setItem(
      'azcare_consent_v3',
      JSON.stringify({ analytics: true, version: 3, updatedAt: new Date().toISOString() }),
    );
  });
  await page.route('https://www.googletagmanager.com/**', (route) => route.abort());

  await page.goto('/');
  await page.getByRole('link', { name: 'Explore the phone' }).click();
  await page.getByRole('button', { name: 'Messages', exact: true }).click();
  await page.getByRole('button', { name: 'Scan this message' }).click();

  const accepted = await page.evaluate(() =>
    window.AZ_ANALYTICS.track('scenario_complete', {
      scenario_name: 'sos',
      result: 'simulation_complete',
      message_text: 'must not be collected',
    }),
  );
  const rejected = await page.evaluate(() =>
    window.AZ_ANALYTICS.track('scenario_complete', {
      scenario_name: 'sos',
      result: 'unapproved_value',
    }),
  );
  const events = await readAnalyticsEvents(page);

  expect(accepted).toBe(true);
  expect(rejected).toBe(false);
  expect(events).toEqual(
    expect.arrayContaining([
      expect.objectContaining({
        name: 'navigation_select',
        parameters: expect.objectContaining({ destination: 'phone_demo', placement: 'hero' }),
      }),
      expect.objectContaining({
        name: 'demo_screen_view',
        parameters: expect.objectContaining({ screen_name: 'messages', previous_screen: 'home' }),
      }),
      expect.objectContaining({
        name: 'scenario_start',
        parameters: expect.objectContaining({ scenario_name: 'scam_message' }),
      }),
      expect.objectContaining({
        name: 'scenario_complete',
        parameters: expect.objectContaining({
          scenario_name: 'scam_message',
          result: 'warning_shown',
        }),
      }),
    ]),
  );
  expect(events.some(({ parameters }) => 'message_text' in parameters)).toBe(false);
});

test('interactive phone opens an app and returns to its trigger', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto('/');
  const protect = page.getByRole('button', { name: 'Protect', exact: true });

  await protect.click();
  await expect(page.getByRole('heading', { name: 'Safety Center' })).toBeFocused();
  await page.getByRole('button', { name: 'Back to previous screen' }).click();

  await expect(protect).toBeVisible();
  await expect(protect).toBeFocused();
});

test('scam and SOS demonstrations complete without real actions', async ({ page }) => {
  await page.goto('/');

  await page.getByRole('button', { name: 'Messages', exact: true }).click();
  await page.getByRole('button', { name: 'Scan this message' }).click();
  await expect(page.locator('#phoneView')).toContainText('Suspicious message');

  await page.getByRole('button', { name: 'Back to previous screen' }).click();
  await page.getByRole('button', { name: 'SOS', exact: true }).click();
  await page.getByRole('button', { name: 'Run SOS simulation' }).click();
  await expect(page.locator('#sosState')).toContainText('No alert sent');
});

test('phone and watch SOS share the service but keep feedback on their own device', async ({
  page,
}) => {
  await page.goto('/');

  const watchState = page.locator('#watchDemoState');
  await expect(watchState).toContainText('Built-in optical heart-rate sensor');

  await page.getByRole('button', { name: 'SOS', exact: true }).click();
  await page.getByRole('button', { name: 'Run SOS simulation' }).click();
  await expect(page.locator('#sosState')).toContainText('No alert sent');
  await expect(watchState).toContainText('Built-in optical heart-rate sensor');

  await page.getByRole('button', { name: 'Watch SOS demo' }).click();
  await expect(watchState).toContainText('No alert sent');
  await expect(page.locator('#sosState')).toContainText('No alert sent');
});

test('Watch Health Guardian links health and fall flows to the phone', async ({ page }) => {
  await page.goto('/');

  await page.getByRole('button', { name: 'Next watch screen' }).click();
  await expect(page.locator('#watchDemoState')).toContainText('ECG concept');
  await expect(page.locator('#watchKicker')).toContainText('ECG');

  await page.getByRole('button', { name: 'Next watch screen' }).click();
  await expect(page.locator('#watchValue')).toContainText('98');

  await page.getByRole('button', { name: 'Next watch screen' }).click();
  await page.getByRole('button', { name: 'Next watch screen' }).click();
  await page.getByRole('button', { name: 'Next watch screen' }).click();
  await page.getByRole('button', { name: 'Open FALL details' }).click();
  await expect(page.getByRole('heading', { name: 'Fall detection', exact: true })).toBeVisible();
  await expect(page.locator('#watchDemoState')).toContainText('phone safety flow linked');
});

test('compact watch stays square-ish and arrows navigate on phone tablet desktop', async ({
  page,
}) => {
  for (const width of [320, 390, 768, 1440]) {
    await page.setViewportSize({ width, height: 900 });
    await page.goto('/');
    const box = await page.locator('.watch-screen').boundingBox();
    expect(box).not.toBeNull();
    expect(box.height).toBeLessThan(215);
    expect(box.width).toBeGreaterThan(175);
    await page.getByRole('button', { name: 'Next watch screen' }).click();
    await expect(page.locator('#watchPageIndicator')).toContainText('ECG · 2 of 6');
    await page.getByRole('button', { name: 'Previous watch screen' }).click();
    await expect(page.locator('#watchPageIndicator')).toContainText('HEART · 1 of 6');
  }
});

test('Watch arrows and permanent SOS stay inside the watch while readings open details', async ({
  page,
}) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto('/');
  const screen = page.locator('.watch-screen');
  for (const name of ['Previous watch screen', 'Next watch screen', 'Watch SOS demo']) {
    const button = page.getByRole('button', { name });
    await expect(button).toBeVisible();
    expect(
      await screen.evaluate(
        (parent, child) => parent.contains(child),
        await button.elementHandle(),
      ),
    ).toBe(true);
  }
  await page.getByRole('button', { name: 'Open HEART details' }).click();
  await expect(page.locator('#watchDetailPanel')).toContainText('Heart rate');
  await page.getByRole('button', { name: 'Next watch screen' }).click();
  await expect(page.locator('#watchDetailPanel')).toBeHidden();
});

test('Watch navigation flanks the metric and SOS remains compact inside the face', async ({
  page,
}) => {
  for (const width of [320, 390, 768, 1440]) {
    await page.setViewportSize({ width, height: 900 });
    await page.goto('/');
    const row = page.locator('.watch-metric-row');
    await expect(row.getByRole('button', { name: 'Previous watch screen' })).toBeVisible();
    await expect(row.getByRole('button', { name: 'Next watch screen' })).toBeVisible();
    const screenBox = await page.locator('.watch-screen').boundingBox();
    const sosBox = await page.getByRole('button', { name: 'Watch SOS demo' }).boundingBox();
    expect(sosBox.width).toBeLessThan(screenBox.width * 0.85);
    expect(sosBox.width).toBeGreaterThan(screenBox.width * 0.6);
  }
});

test('Watch shows glucose only as external CGM data', async ({ page }) => {
  await page.goto('/');
  for (let i = 0; i < 4; i++) await page.getByRole('button', { name: 'Next watch screen' }).click();
  await expect(page.locator('#watchPageIndicator')).toContainText('GLUCOSE');
  await expect(page.locator('#watchStats')).toContainText('External');
  await page.getByRole('button', { name: 'Open GLUCOSE details' }).click();
  await expect(page.locator('#watchDetailPanel')).toContainText(
    'watch itself does not measure blood glucose',
  );
});

test('scenario launchpad opens integrated product demos', async ({ page }) => {
  await page.goto('/');
  await page.getByRole('button', { name: /Anti-Scam/ }).click();
  await expect(page.locator('#phoneView h3')).toHaveText('Messages');
  await page.getByRole('button', { name: 'Scan this message' }).click();
  await expect(page.getByText('Suspicious message · high risk')).toBeVisible();
  await page.getByRole('button', { name: 'Block sender' }).click();
  await expect(page.locator('#scamActionState')).toContainText('Sender blocked');

  await page.getByRole('button', { name: /Connectivity/ }).click();
  await expect(page.locator('#phoneView')).toContainText('CURRENT SOS ROUTE');
  await page.getByRole('button', { name: 'Simulate next fallback' }).click();
  await expect(page.locator('#phoneView')).toContainText('Wi-Fi');
});

test('Battery Guardian switches at the 20 percent safety threshold', async ({ page }) => {
  await page.goto('/');
  await page.getByRole('button', { name: /Battery Guardian/ }).click();
  await expect(page.locator('#phoneView')).toContainText('44% · Normal mode');
  await page.getByRole('button', { name: 'Simulate battery below 20%' }).click();
  await expect(page.locator('#phoneView')).toContainText('19% · Safety mode');
  await expect(page.locator('#phoneView')).toContainText('Emergency reserve');
});

test('Privacy controls and Care Center are interactive demos', async ({ page }) => {
  await page.goto('/');
  await page.getByRole('button', { name: /^Privacy/ }).click();
  await expect(page.locator('#phoneView')).toContainText('Local-first controls');
  await expect(page.locator('#phoneView')).toContainText('SOS location');
  await page.getByRole('button', { name: /Care Center/ }).click();
  await expect(page.locator('#phoneView h3')).toHaveText('Care Center');
  await expect(page.locator('#phoneView')).toContainText('Michael · Room 18');
  await expect(page.locator('#phoneView')).toContainText('role controls');
});

test('Health Guardian distinguishes built-in wellness data from external devices', async ({ page }) => {
  await page.goto('/');
  await page.getByRole('button', { name: /Health Guardian/ }).click();
  await expect(page.locator('#phoneView h3')).toHaveText('Health Guardian');
  await expect(page.locator('#phoneView')).toContainText('CGM · EXTERNAL');
  await expect(page.locator('#phoneView')).toContainText('BP · EXTERNAL');
  await expect(page.locator('#phoneView')).toContainText('Sleep');
  await expect(page.locator('#phoneView')).toContainText('Breathing');
});

test('Battery Guardian and privacy dashboard expose safety-first controls', async ({ page }) => {
  await page.goto('/');
  await page.getByRole('button', { name: 'Settings', exact: true }).click();
  await page.getByRole('button', { name: /Battery Guardian/ }).click();
  await expect(page.getByRole('heading', { name: 'Battery Guardian' })).toBeVisible();
  await expect(page.locator('#phoneView')).toContainText('20% safety threshold');

  await page.getByRole('button', { name: 'Back to previous screen' }).click();
  await page.getByRole('button', { name: /Privacy dashboard/ }).click();
  await expect(page.locator('#phoneView')).toContainText('Last safety share');
  await expect(page.locator('#phoneView')).toContainText('Optional analytics');
});

test('privacy policy exposes the project contact and current revision', async ({ page }) => {
  await page.goto('/privacy.html');
  await expect(page.getByRole('heading', { name: 'Privacy Policy' })).toBeVisible();
  await expect(page.getByText('Last updated: 24 September 2026')).toBeVisible();
  await expect(page.locator('a[href="mailto:azcare.project@gmail.com"]')).toBeVisible();
});
