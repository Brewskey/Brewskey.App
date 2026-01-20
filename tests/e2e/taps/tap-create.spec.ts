import { test, expect } from '../../fixtures/test-fixtures';
import {
  mockLocationWithTaps,
  mockDeviceWithTaps,
} from '../../fixtures/entity-fixtures';

test.use({ autoAuthenticate: true });

test('should navigate to create tap form', async ({ page }) => {
  // Set up explicit data: authenticated user (handled by autoAuthenticate)
  await page.goto('/taps/new');

  await expect(page).toHaveURL(/.*tap.*new|new.*tap/i);
  await expect(page.getByTestId('input-description')).toBeVisible();
});

test('should validate required fields', async ({ page }) => {
  // Set up explicit data: authenticated user (handled by autoAuthenticate)
  await page.goto('/taps/new');
  await expect(page.getByTestId('input-description')).toBeVisible();

  await expect(page.getByTestId('submit-button-create-tap')).toBeVisible();
  await page.getByTestId('submit-button-create-tap').click();

  // Validation messages are dynamic content, so text-based locator is acceptable
  await expect(
    page.locator('text=/error|failed|required|must.*fill|invalid|try.*again/i'),
  ).toBeVisible();
});

test('should successfully create tap', async ({ page, tapPage }) => {
  // Set up explicit data: one location and one device
  const { location } = await mockLocationWithTaps(page, 0);
  const { device } = await mockDeviceWithTaps(page, 0);

  await page.goto('/taps/new');
  await expect(page.getByTestId('input-description')).toBeVisible();

  await tapPage.fillTapForm({
    name: 'New Tap',
    deviceId: device.id as number,
    locationId: location.id as number,
  });
  await tapPage.submitForm();

  // Success messages are dynamic content from API responses (SnackBar), so text-based locator is acceptable
  await expect(
    page.locator('text=/success|created|saved|updated/i'),
  ).toBeVisible();
});
