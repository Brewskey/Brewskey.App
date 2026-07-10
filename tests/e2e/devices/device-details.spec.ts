import { test, expect } from '../../fixtures/test-fixtures';
import { seedDeviceWithTaps } from '../../fixtures/entity-fixtures';

test.use({ autoAuthenticate: true });

test('should show device online/offline status', async ({ page, seedApi}) => {
  // Set up explicit data: one device with online status (default)
  const { device } = await seedDeviceWithTaps(seedApi, 0);

  await page.goto(`/devices/${device.id}`);

  // Check for "Online Status" using testID
  await expect(page.getByTestId('overview-item-online-status')).toBeVisible();
});

test('should display associated taps', async ({ page, seedApi}) => {
  // Set up explicit data: one device with 3 taps
  const { device, taps } = await seedDeviceWithTaps(seedApi, 3);

  await page.goto(`/devices/${device.id}`);

  for (const tap of taps) {
    // Use testID from TapListItem for reliable identification
    await expect(page.getByTestId(`tap-item-${tap.id}`)).toBeVisible();
  }
});

test('should navigate to add tap', async ({ page, seedApi}) => {
  // Set up explicit data: one device (add tap button should be visible when no taps)
  const { device } = await seedDeviceWithTaps(seedApi, 0);

  await page.goto(`/devices/${device.id}`);

  // DeviceTapListEmpty has testID on the add button
  const addButton = page.getByTestId('button-add-tap');
  await expect(addButton).toBeVisible();
  await addButton.click();

  await expect(page).toHaveURL(/.*tap.*new/i);
});
