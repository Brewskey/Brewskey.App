import { test, expect } from '../../fixtures/test-fixtures';
import { mockDeviceWithTaps, mockLocationWithTaps } from '../../fixtures/entity-fixtures';

test.use({ autoAuthenticate: true });

test('should pre-fill form with existing data', async ({ page }) => {
  // Set up explicit data: one device
  const { device } = await mockDeviceWithTaps(page, 0);

  await page.goto(`/devices/${device.id}/edit`);
  await expect(page.getByTestId('input-name')).toBeVisible();

  await expect(page.getByTestId('input-name')).toHaveValue(device.name);
});

test('should successfully update device', async ({ page }) => {
  // Set up: one device and a second location so we can mutate the location field
  const { location: location2 } = await mockLocationWithTaps(page, 1);
  const { device } = await mockDeviceWithTaps(page, 0);

  await page.goto(`/devices/${device.id}/edit`);
  await expect(page.getByTestId('input-name')).toBeVisible();

  // Mutate every form field: name, location, deviceStatus, secondsToStayOpen,
  // timeForValveOpen, ledBrightness, nfcStatus, isScreenDisabled, isTotpDisabled, shouldInvertScreen

  await page.getByTestId('input-name').fill('Updated Device Name');

  // Location (required) - select the second location
  await page.getByTestId('picker-location').click();
  await expect(page.getByTestId('picker-location-modal')).toBeVisible();
  const locationItem = page.getByTestId(`location-item-${location2.id}`);
  await expect(locationItem).toBeVisible({ timeout: 5000 });
  await locationItem.click();
  await expect(page.getByTestId('picker-location-modal')).not.toBeVisible();

  // Device status (required) - scope option to picker modal (WebDropdown uses option-{index})
  const deviceStatusPicker = page.getByTestId('picker-device-status');
  await deviceStatusPicker.click();
  const deviceStatusModal = page.getByTestId('picker-device-status-modal');
  await expect(deviceStatusModal.getByTestId('option-1')).toBeVisible();
  await deviceStatusModal.getByTestId('option-1').click();

  // secondsToStayOpen: when Active/Inactive shows TextInput; after selecting Cleaning it becomes DeviceTimeOpenPicker
  // Keep deviceStatus as Cleaning (option 1) - secondsToStayOpen is now DeviceTimeOpenPicker
  const secondsPicker = page.getByTestId('picker-time-to-stay-in-device-state-(will-keep-valve-open)');
  await secondsPicker.click();
  const secondsModal = page.getByTestId('picker-time-to-stay-in-device-state-(will-keep-valve-open)-modal');
  await expect(secondsModal.getByTestId('option-2')).toBeVisible({ timeout: 5000 });
  await secondsModal.getByTestId('option-2').click();

  await page.getByTestId('input-timeForValveOpen').fill('15');

  // LED Brightness slider
  const ledSlider = page.getByTestId('input-ledBrightness');
  await expect(ledSlider).toBeVisible();
  const ledBox = await ledSlider.boundingBox();
  if (ledBox) {
    await page.mouse.move(ledBox.x + ledBox.width * 0.5, ledBox.y + ledBox.height / 2);
    await page.mouse.down();
    await page.mouse.move(ledBox.x + ledBox.width * 0.8, ledBox.y + ledBox.height / 2, { steps: 5 });
    await page.mouse.up();
  }

  // NFC status - scope option to picker modal (WebDropdown uses option-{index})
  const nfcPicker = page.getByTestId('picker-nfc-configuration');
  await nfcPicker.click();
  const nfcModal = page.getByTestId('picker-nfc-configuration-modal');
  await expect(nfcModal.getByTestId('option-1')).toBeVisible({ timeout: 5000 });
  await nfcModal.getByTestId('option-1').click();

  // Checkboxes: isScreenDisabled, isTotpDisabled, shouldInvertScreen
  await page.getByTestId('input-isScreenDisabled').click();
  await page.getByTestId('input-isTotpDisabled').click();
  await page.getByTestId('input-shouldInvertScreen').click();

  const submitButton = page.getByTestId('submit-button-edit-device');
  await expect(submitButton).toBeEnabled();
  await submitButton.click();

  await expect(page).toHaveURL(new RegExp(`/devices/${device.id}(?:/edit)?$`));
  await expect(page.getByTestId('snackbar-message')).toBeVisible();
  await expect(page.getByTestId('snackbar-message')).toHaveText('The Brewskey box was edited');
});
