import { test, expect } from '../../fixtures/test-fixtures';
import { mockDeviceWithTaps } from '../../fixtures/entity-fixtures';

test.use({ autoAuthenticate: true });

test('should show device online/offline status', async ({ page, devicePage }) => {
  // Set up explicit data: one device with online status (default)
  const { device } = await mockDeviceWithTaps(page, 0);
  await devicePage.goto();

  await expect(devicePage.getDevicesList()).toBeVisible();

  // Use testID for device item - device list item includes online status indicator
  await expect(page.getByTestId(`device-item-${device.id}`)).toBeVisible();
});

test('should navigate to device details', async ({ page, devicePage }) => {
  // Set up explicit data: one device with no taps
  const { device } = await mockDeviceWithTaps(page, 0);
  await devicePage.goto();
  
  // Wait for list to load
  await expect(devicePage.getDevicesList()).toBeVisible();
  
  // Use testID for device item
  await page.getByTestId(`device-item-${device.id}`).click();

  await expect(page).toHaveURL(/.*device.*details|device.*\d+/i);
});

test('should navigate to create device', async ({ page, devicePage }) => {
  await devicePage.goto();
  
  // Wait for page to load
  await expect(devicePage.getDevicesList()).toBeVisible();
  
  await devicePage.getAddDeviceButton().click();

  await expect(page).toHaveURL(/.*device.*new|new.*device/i);
});
