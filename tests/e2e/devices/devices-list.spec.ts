import { test, expect } from '../../fixtures/test-fixtures';

test.use({ autoAuthenticate: true });

test.describe('with one device', () => {
  test.use({ seed: { devices: 1 } });

  test('should show device online/offline status', async ({
    page,
    devicePage,
    devices,
  }) => {
    const [device] = devices;
    await devicePage.goto();

    await expect(devicePage.getDevicesList()).toBeVisible();

    // Use testID for device item - device list item includes online status indicator
    await expect(page.getByTestId(`device-item-${device.id}`)).toBeVisible();
  });

  test('should navigate to device details', async ({
    page,
    devicePage,
    devices,
  }) => {
    const [device] = devices;
    await devicePage.goto();

    // Wait for list to load
    await expect(devicePage.getDevicesList()).toBeVisible();

    // Use testID for device item
    await page.getByTestId(`device-item-${device.id}`).click();

    await expect(page).toHaveURL(/.*device.*details|device.*\d+/i);
  });
});

test('should navigate to create device', async ({ page, devicePage }) => {
  // No seed: a fresh account owns no devices.
  await devicePage.goto();

  // Wait for page to load
  await expect(devicePage.getDevicesList()).toBeVisible();

  await devicePage.getAddDeviceButton().click();

  await expect(page).toHaveURL(/.*device.*new|new.*device/i);
});
