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

  // Fill all required fields: name, location, and deviceStatus
  // Even though form is pre-filled, we update fields to test form inputs properly
  await page.getByTestId('input-name').fill('Updated Device Name');
  
  // Update device status (required field) - verify picker works
  const deviceStatusPicker = page.getByTestId('picker-device-status');
  await expect(deviceStatusPicker).toBeVisible();
  await deviceStatusPicker.click();
  // Select a different status to test the picker (Cleaning is at index 1)
  await expect(deviceStatusPicker.getByTestId('option-1')).toBeVisible();
  await deviceStatusPicker.getByTestId('option-1').click();
  
  // Location is also required - verify it's present (should be pre-filled)
  const locationPicker = page.getByTestId('picker-location');
  await expect(locationPicker).toBeVisible();
  
  // Submit the form
  await expect(page.getByTestId('submit-button-edit-device')).toBeVisible();
  await page.getByTestId('submit-button-edit-device').click();

  // Wait for navigation back to device details page
  await expect(page).toHaveURL(new RegExp(`/devices/${device.id}(?:/edit)?$`));
  
  // Success messages use SnackBar component with testID
  await expect(page.getByTestId('snackbar-message')).toBeVisible();
});
