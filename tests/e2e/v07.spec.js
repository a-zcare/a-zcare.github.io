import { test, expect } from '@playwright/test';

test('unlisted investor overview is accessible by direct URL but absent from site navigation', async ({
  page,
}) => {
  await page.goto('/investors.html');
  await expect(page.getByRole('heading', { level: 1 })).toContainText('One connected experience');
  await expect(page.locator('meta[name="robots"]')).toHaveAttribute('content', 'noindex, nofollow');
  await page.goto('/');
  await expect(page.locator('a[href*="investors.html"]')).toHaveCount(0);
  await page.goto('/device-lab.html');
  await expect(page.locator('a[href*="investors.html"]')).toHaveCount(0);
});

test('device lab navigation reaches phone, watch and ecosystem', async ({ page }) => {
  await page.goto('/device-lab.html');
  await page.getByRole('navigation', { name: 'Product sections' }).getByRole('link', { name: 'Watch' }).click();
  await expect(page).toHaveURL(/#watch-device$/);
  await expect(page.locator('#watch-device')).toBeVisible();
  await page.getByRole('navigation', { name: 'Product sections' }).getByRole('link', { name: 'Phone' }).click();
  await expect(page).toHaveURL(/#phone-device$/);
  await page.getByRole('navigation', { name: 'Product sections' }).getByRole('link', { name: 'Ecosystem' }).click();
  await expect(page).toHaveURL(/ecosystem\.html$/);
});

for (const width of [390, 768, 1440]) {
  test(`v0.7 investor page has no horizontal overflow at ${width}px`, async ({ page }) => {
    await page.setViewportSize({ width, height: 900 });
    await page.goto('/investors.html');
    const overflow = await page.evaluate(
      () => document.documentElement.scrollWidth > document.documentElement.clientWidth,
    );
    expect(overflow).toBe(false);
  });
}
