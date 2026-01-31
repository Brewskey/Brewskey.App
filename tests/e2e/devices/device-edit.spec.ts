import { test, expect } from '../../fixtures/test-fixtures';
import {
  mockDeviceWithTaps,
  mockLocationWithTaps,
} from '../../fixtures/entity-fixtures';

test.use({ autoAuthenticate: true });

test('should pre-fill form with existing data', async ({ page }) => {
  // Set up explicit data: one device
  const { device } = await mockDeviceWithTaps(page, 0);

  await page.goto(`/devices/${device.id}/edit`);
  await expect(page.getByTestId('input-name')).toBeVisible();

  await expect(page.getByTestId('input-name')).toHaveValue(device.name);
});

test('should successfully update device', async ({ page, dropDown }) => {
  // Set up: one device and a second location so we can mutate the location field
  const { location: location2 } = await mockLocationWithTaps(page, 1);
  const { device } = await mockDeviceWithTaps(page, 0);

  await page.goto(`/devices/${device.id}/edit`);
  await expect(page.getByTestId('input-name')).toBeVisible();

  // Mutate every form field: name, location, deviceStatus, secondsToStayOpen,
  // timeForValveOpen, ledBrightness, nfcStatus, isScreenDisabled, isTotpDisabled, shouldInvertScreen

  await page.getByTestId('input-name').fill('Updated Device Name');

  // Location (required) - select the second location (index 1: device's is 0, location2 is 1)
  const locationPicker = dropDown.create('location-dropdown');
  await locationPicker.input.click();
  await expect(locationPicker.modal).toBeVisible();
  await locationPicker.scrollToItemByIndex(1);
  await locationPicker.select(1);
  await expect(locationPicker.modal).not.toBeVisible();

  // Device status (required) - WebDropdown uses option-{index}
  const deviceStatusDd = dropDown.create('device-status-dropdown');
  await deviceStatusDd.select(1);

  // secondsToStayOpen: when Active/Inactive shows TextInput; after selecting Cleaning it becomes DeviceTimeOpenPicker
  // Keep deviceStatus as Cleaning (option 1) - secondsToStayOpen is now DeviceTimeOpenPicker
  const secondsDd = dropDown.create('time-to-stay-open-dropdown');
  await secondsDd.input.click();
  await secondsDd.scrollToItemByIndex(2);
  await secondsDd.select(2);

  await page.getByTestId('input-timeForValveOpen').fill('15');

  // LED Brightness slider
  const ledSlider = page.getByTestId('input-ledBrightness');
  await expect(ledSlider).toBeVisible();
  const ledBox = await ledSlider.boundingBox();
  if (ledBox) {
    await page.mouse.move(
      ledBox.x + ledBox.width * 0.5,
      ledBox.y + ledBox.height / 2,
    );
    await page.mouse.down();
    await page.mouse.move(
      ledBox.x + ledBox.width * 0.8,
      ledBox.y + ledBox.height / 2,
      { steps: 5 },
    );
    await page.mouse.up();
  }

  // NFC status - WebDropdown uses option-{index}
  const nfcDd = dropDown.create('nfc-status-dropdown');
  await nfcDd.input.click();
  await nfcDd.scrollToItemByIndex(1);
  await nfcDd.select(1);

  // Checkboxes: isScreenDisabled, isTotpDisabled, shouldInvertScreen
  await page.getByTestId('input-isScreenDisabled').click();
  await page.getByTestId('input-isTotpDisabled').click();
  await page.getByTestId('input-shouldInvertScreen').click();

  const submitButton = page.getByTestId('submit-button-edit-device');
  await expect(submitButton).toBeEnabled();
  await submitButton.click();

  await expect(page).toHaveURL(new RegExp(`/devices/${device.id}(?:/edit)?$`));
  await expect(page.getByTestId('snackbar-message')).toBeVisible();
  await expect(page.getByTestId('snackbar-message')).toHaveText(
    'The Brewskey box was edited',
  );
});
