import { test, expect } from '../../fixtures/test-fixtures';
import { mockDeviceWithTaps } from '../../fixtures/entity-fixtures';

test.use({ autoAuthenticate: true });

test('should display device information', async ({ page }) => {
  // Set up explicit data: one device with no taps
  const { device } = await mockDeviceWithTaps(page, 0);

  await page.goto(`/devices/${device.id}`);

  // Device name and particle ID are dynamic content (user-generated), so text-based locators are acceptable
  await expect(page.locator(`text=${device.name}`)).toBeVisible();
  await expect(page.locator(`text=${device.particleId}`)).toBeVisible();
});

test('should show device online/offline status', async ({ page }) => {
  // Set up explicit data: one device with online status (default)
  const { device } = await mockDeviceWithTaps(page, 0);

  await page.goto(`/devices/${device.id}`);

  // Status text is dynamic content, so text-based locator is acceptable
  await expect(
    page.locator('text=/online|offline|status/i'),
  ).toBeVisible();
});

test('should display associated taps', async ({ page }) => {
  // Set up explicit data: one device with 3 taps
  const { device, taps } = await mockDeviceWithTaps(page, 3);

  await page.goto(`/devices/${device.id}`);

  for (const tap of taps) {
    // TapListItem displays as "${tapNumber} - ${beverageName}"
    // Tap number is dynamic content, so text-based locator is acceptable
    await expect(page.locator(`text=${tap.tapNumber}`)).toBeVisible();
  }
});

test('should navigate to add tap', async ({ page }) => {
  // Set up explicit data: one device (add tap button should be visible)
  const { device } = await mockDeviceWithTaps(page, 0);

  await page.goto(`/devices/${device.id}`);

  // Use testID if available, otherwise use role-based locator for add button
  const addButton = page.getByTestId('button-add-tap').or(
    page.getByRole('button', { name: /add.*tap|new.*tap/i })
  );
  await expect(addButton).toBeVisible();
  await addButton.click();
  
  await expect(page).toHaveURL(/.*tap.*new/i);
});
