import { test, expect } from '../../fixtures/test-fixtures';
import { mockDeviceWithTaps } from '../../fixtures/entity-fixtures';

test.use({ autoAuthenticate: true });

test('should navigate to edit device', async ({ page }) => {
  // Set up explicit data: one device
  const { device } = await mockDeviceWithTaps(page, 0);

  await page.goto(`/devices/${device.id}/edit`);

  await expect(page).toHaveURL(/.*device.*edit|edit.*device/i);
  await expect(page.getByTestId('input-name')).toBeVisible();
});

test('should pre-fill form with existing data', async ({ page }) => {
  // Set up explicit data: one device
  const { device } = await mockDeviceWithTaps(page, 0);

  await page.goto(`/devices/${device.id}/edit`);
  await expect(page.getByTestId('input-name')).toBeVisible();

  await expect(page.getByTestId('input-name')).toHaveValue(device.name);
});

test('should successfully update device', async ({ page }) => {
  // Set up explicit data: one device
  const { device } = await mockDeviceWithTaps(page, 0);

  await page.goto(`/devices/${device.id}/edit`);
  await expect(page.getByTestId('input-name')).toBeVisible();

  await page.getByTestId('input-name').fill('Updated Device Name');
  await expect(page.getByTestId('submit-button-edit-device')).toBeVisible();
  await page.getByTestId('submit-button-edit-device').click();

  // Success messages are dynamic content from API responses (SnackBar), so text-based locator is acceptable
  await expect(
    page.locator('text=/success|created|saved|updated/i'),
  ).toBeVisible();
});
