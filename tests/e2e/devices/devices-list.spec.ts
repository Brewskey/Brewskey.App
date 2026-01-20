import { test, expect } from '../../fixtures/test-fixtures';
import { mockDeviceWithTaps } from '../../fixtures/entity-fixtures';

test.use({ autoAuthenticate: true });

test('should display devices list', async ({ page, devicePage }) => {
  // Set up explicit data: one device with 2 taps
  const { device } = await mockDeviceWithTaps(page, 2);
  await devicePage.goto();

  await expect(devicePage.getDevicesList()).toBeVisible();

  // Device name is dynamic content (user-generated), so text-based locator is acceptable
  await expect(page.locator(`text=${device.name}`)).toBeVisible();
});

test('should show device online/offline status', async ({ page, devicePage }) => {
  // Set up explicit data: one device with online status (default)
  const { device } = await mockDeviceWithTaps(page, 0);
  await devicePage.goto();

  await expect(devicePage.getDevicesList()).toBeVisible();

  // Status text is dynamic content, so text-based locator is acceptable
  await expect(
    page.locator('text=/online|offline|status/i'),
  ).toBeVisible();
});

test('should navigate to device details', async ({ page, devicePage }) => {
  // Set up explicit data: one device with no taps
  const { device } = await mockDeviceWithTaps(page, 0);
  await devicePage.goto();
  
  // Wait for list to load
  await expect(devicePage.getDevicesList()).toBeVisible();
  
  // Device name is dynamic content, so text-based locator is acceptable
  await devicePage.clickDevice(device.name);

  await expect(page).toHaveURL(/.*device.*details|device.*\d+/i);
});

test('should navigate to create device', async ({ page, devicePage }) => {
  await devicePage.goto();
  
  // Wait for page to load
  await expect(devicePage.getDevicesList()).toBeVisible();
  
  await devicePage.getAddDeviceButton().click();

  await expect(page).toHaveURL(/.*device.*new|new.*device/i);
});
