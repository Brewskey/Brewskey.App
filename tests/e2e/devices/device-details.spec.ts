import { test, expect } from '../../fixtures/test-fixtures';
import { mockDeviceWithTaps } from '../../fixtures/entity-fixtures';

test.use({ autoAuthenticate: true });

test('should display device information', async ({ page }) => {
  // Set up explicit data: one device with no taps
  const { device } = await mockDeviceWithTaps(page, 0);

  await page.goto(`/devices/${device.id}`);

  // Use testIDs for device information
  await expect(page.getByTestId('overview-item-box-id')).toBeVisible();
  await expect(page.getByTestId('overview-item-box-id')).toContainText(device.particleId);
  await expect(page.getByTestId('overview-item-online-status')).toBeVisible();
});

test('should show device online/offline status', async ({ page }) => {
  // Set up explicit data: one device with online status (default)
  const { device } = await mockDeviceWithTaps(page, 0);

  await page.goto(`/devices/${device.id}`);

  // Check for "Online Status" using testID
  await expect(page.getByTestId('overview-item-online-status')).toBeVisible();
});

test('should display associated taps', async ({ page }) => {
  // Set up explicit data: one device with 3 taps
  const { device, taps } = await mockDeviceWithTaps(page, 3);

  await page.goto(`/devices/${device.id}`);

  for (const tap of taps) {
    // Use testID from TapListItem for reliable identification
    await expect(page.getByTestId(`tap-item-${tap.id}`)).toBeVisible();
  }
});

test('should navigate to add tap', async ({ page }) => {
  // Set up explicit data: one device (add tap button should be visible when no taps)
  const { device } = await mockDeviceWithTaps(page, 0);

  await page.goto(`/devices/${device.id}`);

  // DeviceTapListEmpty has testID on the add button
  const addButton = page.getByTestId('button-add-tap');
  await expect(addButton).toBeVisible();
  await addButton.click();
  
  await expect(page).toHaveURL(/.*tap.*new/i);
});
