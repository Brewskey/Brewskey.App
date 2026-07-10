import {
  seedDeviceWithTaps,
  seedLocationWithTaps,
} from '../../fixtures/entity-fixtures';
import { expect, test } from '../../fixtures/test-fixtures';

test.use({ autoAuthenticate: true });

test('should pre-fill form with existing data', async ({ page, seedApi}) => {
  // Set up explicit data: one device
  const { device, location } = await seedDeviceWithTaps(seedApi, 0);

  await page.goto(`/devices/${device.id}/edit`);
  await expect(page.getByTestId('input-name')).toBeVisible();

  await expect(page.getByTestId('input-name')).toHaveValue(device.name);
  await expect(page.getByTestId('location-dropdown')).toContainText(
    location.name,
  );
});

test('should successfully update device', async ({
  page,
  dropDown,
  seedApi,
}) => {
  // Set up: one device and a second location so we can mutate the location field
  await seedLocationWithTaps(seedApi, 1);
  const { device } = await seedDeviceWithTaps(seedApi, 0);

  await page.goto(`/devices/${device.id}/edit`);
  await expect(page.getByTestId('input-name')).toBeVisible();
  await expect(page.getByTestId('main-tab-bar')).toHaveCount(0);

  // Mutate every form field: name, location, deviceStatus (unchanged Active),
  // secondsToStayOpen (TextInput), timeForValveOpen, ledBrightness, nfcStatus,
  // isScreenDisabled, isTotpDisabled, shouldInvertScreen

  await page.getByTestId('input-name').fill('Updated Device Name');

  // Location (required) - select the second location (index 1: device's is 0, location2 is 1)
  const locationPicker = dropDown.create('location-dropdown');
  await locationPicker.input.click();
  await expect(locationPicker.modal).toBeVisible();
  await locationPicker.scrollToItemByIndex(1);
  await locationPicker.select(1);
  await expect(locationPicker.modal).not.toBeVisible();

  // Stay on Active so secondsToStayOpen is a TextInput (Cleaning uses DeviceTimeOpenPicker).
  await page.getByTestId('input-secondsToStayOpen').fill('900');

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

  const putReqPromise = page.waitForRequest(
    (req) => req.method() === 'PUT' && req.url().includes('/api/v2/devices'),
  );

  const submitButton = page.getByTestId('submit-button-edit-device');
  await expect(submitButton).toBeEnabled();
  await submitButton.click();

  const putReq = await putReqPromise;
  const putBody = putReq.postDataJSON() as {
    secondsToStayOpen?: number;
    timeForValveOpen?: number;
  };
  expect(putBody.secondsToStayOpen).toBe('900');
  expect(putBody.timeForValveOpen).toBe('15');

  await expect(page).toHaveURL(new RegExp(`/devices/${device.id}(?:/edit)?$`));
  await expect(page.getByTestId('snackbar-message')).toBeVisible();
  await expect(page.getByTestId('snackbar-message')).toHaveText(
    'The Brewskey box was edited',
  );

  const stored = await seedApi.fetchDevice(device.id);
  expect(Number(stored?.secondsToStayOpen)).toBe(900);
  expect(Number(stored?.timeForValveOpen)).toBe(15);
});
