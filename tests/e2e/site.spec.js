import { test, expect } from '@playwright/test';

const viewports = [
  { name: 'phone-360', width: 360, height: 800 },
  { name: 'phone-390', width: 390, height: 844 },
  { name: 'tablet', width: 768, height: 1024 },
  { name: 'desktop', width: 1366, height: 768 }
];

for (const viewport of viewports) {
  test.describe(viewport.name, () => {
    test.use({ viewport: { width: viewport.width, height: viewport.height } });

    test('loads without JS errors or horizontal overflow', async ({ page }) => {
      const errors = [];
      page.on('pageerror', (error) => errors.push(error.message));
      await page.goto('/');
      await expect(page.locator('#phoneView')).toBeVisible();
      await expect
        .poll(() => page.evaluate(() => document.documentElement.scrollWidth <= document.documentElement.clientWidth + 1))
        .toBe(true);
      expect(errors).toEqual([]);
    });

    test('internal links resolve', async ({ page, request }) => {
      await page.goto('/');
      const links = await page.locator('a[href]').evaluateAll((nodes) =>
        [...new Set(nodes.map((node) => node.getAttribute('href')).filter(Boolean))]
      );
      for (const href of links) {
        if (href.startsWith('#')) {
          expect(await page.locator(href).count(), 'missing anchor ' + href).toBeGreaterThan(0);
          continue;
        }
        if (/^(mailto:|tel:|javascript:)/.test(href) || href.startsWith('http')) continue;
        const response = await request.get(new URL(href, page.url()).toString());
        expect(response.status(), href).toBeLessThan(400);
      }
    });
  });
}

for (const viewport of viewports.filter((item) => item.width <= 800)) {
  test.describe(viewport.name + ' navigation', () => {
    test.use({ viewport: { width: viewport.width, height: viewport.height } });

    test('burger opens, Esc closes and returns focus', async ({ page }) => {
      await page.goto('/');
      const toggle = page.locator('.menu-toggle');
      await expect(toggle).toBeVisible();
      await expect(toggle).toHaveAttribute('aria-controls', 'site-navigation');
      await expect(toggle).toHaveAttribute('aria-expanded', 'false');

      await toggle.click();
      await expect(toggle).toHaveAttribute('aria-expanded', 'true');
      await expect(page.locator('#site-navigation')).toHaveClass(/is-open/);

      await page.keyboard.press('Escape');
      await expect(toggle).toHaveAttribute('aria-expanded', 'false');
      await expect(toggle).toBeFocused();
    });

    test('keyboard can open menu and activate a navigation link', async ({ page }) => {
      await page.goto('/');
      const toggle = page.locator('.menu-toggle');
      await toggle.focus();
      await page.keyboard.press('Enter');
      await expect(toggle).toHaveAttribute('aria-expanded', 'true');
      const firstLink = page.locator('#site-navigation a').first();
      await firstLink.focus();
      await expect(firstLink).toBeFocused();
      await page.keyboard.press('Enter');
      await expect(toggle).toHaveAttribute('aria-expanded', 'false');
    });
  });
}

test('navigation resets when moving from mobile to desktop', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto('/');
  const toggle = page.locator('.menu-toggle');
  await toggle.click();
  await expect(toggle).toHaveAttribute('aria-expanded', 'true');
  await page.setViewportSize({ width: 1366, height: 768 });
  await expect(toggle).toHaveAttribute('aria-expanded', 'false');
});

test('interactive phone opens an app and returns home', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto('/');
  const protect = page.locator('#phoneView [data-app="protect"]');
  await expect(protect).toBeVisible();
  await protect.click();
  await expect(page.locator('#phoneView')).toContainText('Protect');
  const home = page.locator('#phoneView [data-home]');
  await expect(home).toBeVisible();
  await home.click();
  await expect(page.locator('#phoneView [data-app="protect"]')).toBeVisible();
});
