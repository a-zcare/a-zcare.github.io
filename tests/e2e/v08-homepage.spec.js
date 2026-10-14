import { expect, test } from '@playwright/test';

test('v0.8 homepage preserves the real interactive devices and six solution cards', async ({
  page,
}) => {
  await page.goto('/');
  await expect(page.locator('h1')).toContainText('Protection that');
  await expect(page.locator('#phoneView')).toBeVisible();
  await expect(page.locator('[data-watch-screen]')).toBeVisible();
  await expect(page.locator('.ecosystem-feature-grid .ecosystem-feature')).toHaveCount(6);
  await expect(page.getByRole('link', { name: 'Safety & Privacy' })).toBeVisible();
  await expect(page.getByText('Not an emergency or medical service.', { exact: false })).toBeVisible();
});

test('v0.8 homepage remains within viewport at common screen widths', async ({ page }) => {
  for (const width of [320, 390, 768, 1024, 1440, 1920, 2560]) {
    await page.setViewportSize({ width, height: 900 });
    await page.goto('/');
    await expect(page.locator('#phoneView')).toBeAttached();
    const overflow = await page.evaluate(
      () => document.documentElement.scrollWidth - document.documentElement.clientWidth,
    );
    expect(overflow, `horizontal overflow at ${width}px`).toBeLessThanOrEqual(1);
  }
});
