import { expect, test } from '@playwright/test';

const viewports = [
  { name: 'phone-360', width: 360, height: 800 },
  { name: 'phone-390', width: 390, height: 844 },
  { name: 'tablet', width: 768, height: 1024 },
  { name: 'desktop', width: 1366, height: 768 },
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
      const firstLink = page.locator('#site-navigation a').first();
      await firstLink.focus();
      await firstLink.press('Enter');

      await expect(page).toHaveURL(/#why$/);
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
        parameters: expect.objectContaining({ destination: 'product', placement: 'hero' }),
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

test('privacy policy exposes the project contact and current revision', async ({ page }) => {
  await page.goto('/privacy.html');
  await expect(page.getByRole('heading', { name: 'Privacy Policy' })).toBeVisible();
  await expect(page.getByText('Last updated: 24 September 2026')).toBeVisible();
  await expect(page.locator('a[href="mailto:azcare.project@gmail.com"]')).toBeVisible();
});
