import { test, expect } from '../../fixtures/test-fixtures';

test.use({ autoAuthenticate: true, seed: { devices: 1 } });

test('should show device online/offline status', async ({ page, devices }) => {
  const [device] = devices;

  await page.goto(`/devices/${device.id}`);

  // Check for "Online Status" using testID
  await expect(page.getByTestId('overview-item-online-status')).toBeVisible();
});

test.describe('with taps', () => {
  test.use({ seed: { devices: 1, taps: 3 } });

  test('should display associated taps', async ({ page, devices, taps }) => {
    const [device] = devices;

    await page.goto(`/devices/${device.id}`);

    for (const tap of taps) {
      // Use testID from TapListItem for reliable identification
      await expect(page.getByTestId(`tap-item-${tap.id}`)).toBeVisible();
    }
  });
});

test('should navigate to add tap', async ({ page, devices }) => {
  // Add tap button should be visible when the device has no taps
  const [device] = devices;

  await page.goto(`/devices/${device.id}`);

  // DeviceTapListEmpty has testID on the add button
  const addButton = page.getByTestId('button-add-tap');
  await expect(addButton).toBeVisible();
  await addButton.click();

  await expect(page).toHaveURL(/.*tap.*new/i);
});
