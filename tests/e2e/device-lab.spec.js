import { test, expect } from '@playwright/test';

test.beforeEach(async ({ page }) => {
  await page.goto('/device-lab.html');
});

test('device lab loads without browser errors and shows both devices', async ({ page }) => {
  const errors = [];
  page.on('pageerror', (error) => errors.push(error.message));
  await expect(page.getByRole('heading', { name: /Safety you can explore/i })).toBeVisible();
  await expect(page.locator('#phoneContent')).toContainText('Good day');
  await expect(page.locator('#watchContent')).toContainText('Heart rate');
  await page.getByRole('button', { name: 'Next watch screen' }).click();
  await expect(page.locator('#watchContent')).toContainText('Oxygen');
  expect(errors).toEqual([]);
});

test('watch SOS reaches phone and can be acknowledged or cancelled', async ({ page }) => {
  await page.locator('#watchSOS').click();
  await expect(page.locator('#phoneContent')).toContainText('Countdown');
  await page.locator('[data-action="sos-confirm"]').click();
  await expect(page.locator('#phoneContent')).toContainText('Simulated contact notified');
  await page.locator('[data-action="sos-ack"]').click();
  await expect(page.locator('#phoneContent')).toContainText('Acknowledged');
  await page.locator('[data-action="sos-cancel"]').click();
  await expect(page.locator('#phoneContent')).toContainText('Cancelled');
});

test('offline SOS is queued then simulated as delivered after reconnect', async ({ page }) => {
  await page.locator('#network').uncheck();
  await page.locator('#watchSOS').click();
  await page.locator('[data-action="sos-confirm"]').click();
  await expect(page.locator('#phoneContent')).toContainText('Queued offline');
  await page.locator('#network').check();
  await expect(page.locator('#phoneContent')).toContainText('Simulated contact notified');
});

test('scam shield explains risk and handles false positives', async ({ page }) => {
  await page.locator('[data-open="Scam Shield"]').click();
  await page.locator('[data-action="scam-review"]').click();
  await expect(page.locator('#phoneContent')).toContainText('unfamiliar link');
  await page.locator('[data-action="scam-false"]').click();
  await expect(page.locator('#timeline')).toContainText('False positive');
});

test('location sharing requires opt-in and can be revoked', async ({ page }) => {
  await page.locator('[data-open="Location"]').click();
  await expect(page.locator('#phoneContent')).toContainText('Disabled');
  await page.locator('[data-action="share"]').click();
  await expect(page.locator('#phoneContent')).toContainText('Enabled');
  await page.locator('[data-action="share"]').click();
  await expect(page.locator('#phoneContent')).toContainText('Disabled');
});

test('family check-in, battery saver and reset work', async ({ page }) => {
  await page.locator('[data-open="Family"]').click();
  await page.locator('[data-action="checkin"]').click();
  await expect(page.locator('#phoneContent')).toContainText('Checked in safely');
  await page.locator('#battery').check();
  await expect(page.locator('#watchBattery')).toContainText('20%');
  await page.locator('#reset').click();
  await expect(page.locator('#watchBattery')).toContainText('82%');
  await expect(page.locator('#phoneContent')).toContainText('Good day');
  await expect(page.locator('#battery')).not.toBeChecked();
});

test('watch navigation works with keyboard and mobile viewport', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.locator('#watchContent').focus();
  await page.keyboard.press('ArrowRight');
  await expect(page.locator('#watchContent')).toContainText('Oxygen');
  await expect(page.locator('#phoneScreen')).toBeVisible();
  const width = await page.evaluate(() => document.documentElement.scrollWidth);
  expect(width).toBeLessThanOrEqual(390);
});

test('SOS guard and timeline clearing', async ({ page }) => {
  await page.locator('[data-open="SOS"]').click();
  await page.locator('[data-action="sos-confirm"]').click();
  await expect(page.locator('#phoneContent')).toContainText('No active alert');
  await page.locator('[data-action="sos-ack"]').click();
  await expect(page.locator('#phoneContent')).toContainText('No active alert');
  await page.locator('#clearLog').click();
  await expect(page.locator('#timeline li')).toHaveCount(0);
});

test('phone dimensions stay fixed when switching between apps', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  const frame = page.locator('.phone-frame');
  const before = await frame.boundingBox();
  await page.locator('[data-open="SOS"]').click();
  const sos = await frame.boundingBox();
  await page.locator('[data-action="home"]').click();
  await page.locator('[data-open="Health"]').click();
  const health = await frame.boundingBox();
  expect(sos.width).toBe(before.width);
  expect(sos.height).toBe(before.height);
  expect(health.width).toBe(before.width);
  expect(health.height).toBe(before.height);
  expect(before.height).toBeLessThanOrEqual(600);
});

test('watch status, metrics and controls fit inside its screen on mobile', async ({ page }) => {
  await page.setViewportSize({ width: 320, height: 720 });
  const screen = await page.locator('.watch-screen').boundingBox();
  for (const selector of ['.watch-status', '#watchContent', '.watch-nav', '#watchSOS']) {
    const rect = await page.locator(selector).boundingBox();
    expect(rect.x).toBeGreaterThanOrEqual(screen.x);
    expect(rect.y).toBeGreaterThanOrEqual(screen.y);
    expect(rect.x + rect.width).toBeLessThanOrEqual(screen.x + screen.width + 1);
    expect(rect.y + rect.height).toBeLessThanOrEqual(screen.y + screen.height + 1);
  }
  const width = await page.evaluate(() => document.documentElement.scrollWidth);
  expect(width).toBeLessThanOrEqual(320);
});

test('landing-style icons and compact back button retain stable phone geometry', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  const phone = page.locator('.phone-frame');
  const initial = await phone.boundingBox();
  await expect(page.locator('.app-icon svg').first()).toBeVisible();
  await page.locator('[data-open="Health"]').click();
  await expect(page.getByRole('button', { name: 'Back to home screen' })).toBeVisible();
  await expect(page.locator('.subhead .screen-title')).toHaveText('Health');
  const health = await phone.boundingBox();
  await page.getByRole('button', { name: 'Back to home screen' }).click();
  await page.locator('[data-open="SOS"]').click();
  const sos = await phone.boundingBox();
  expect(health.width).toBe(initial.width);
  expect(health.height).toBe(initial.height);
  expect(sos.width).toBe(initial.width);
  expect(sos.height).toBe(initial.height);
  expect(initial.height).toBe(590);
});
