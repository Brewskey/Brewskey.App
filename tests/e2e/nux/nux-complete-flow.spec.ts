import { mockStore } from '../../fixtures/api-mocks';
import { mockNewUserState } from '../../fixtures/entity-fixtures';
import { ROUTES } from '../../fixtures/routes';
import { setAppSettingsStorage } from '../../fixtures/storage-helper';
import {
  createMockBeverage,
  createMockOrganization,
} from '../../fixtures/test-data';
import { expect, test } from '../../fixtures/test-fixtures';

test('should complete full NUX flow', async ({
  page,
  nuxPage,
  settingsPage,
  locationPage,
  devicePage,
  tapPage,
  dropDown,
}) => {
  test.setTimeout(60000);
  // New user with no locations/taps/devices; manage taps OFF so we enable it in settings
  await mockNewUserState(page);
  await setAppSettingsStorage(page, {
    manageTapsEnabled: false,
    selectedOrganization: null,
  });

  const org = createMockOrganization();
  mockStore.setOrganization(org);
  const beverage = createMockBeverage({ name: 'Test Beverage' });
  mockStore.setBeverage(beverage);

  // 1. Go to settings
  await page.goto(ROUTES.MENU);
  await page.getByTestId('header-settings-button').click();
  await expect(page).toHaveURL(/\/settings/i);

  // 2. Click "Manage taps" (toggle ON so Taps menu item appears)
  await settingsPage.toggleManageTaps();

  // 3. Go back to menu then to taps – NUX shows because user has no locations/taps/devices
  await page.goBack();
  await page.goto(ROUTES.TAPS);
  await expect(page).toHaveURL(/\/taps/i);
  await expect(page.getByTestId('button-see-instructions')).toBeVisible({
    timeout: 15000,
  });
  await page.getByTestId('button-see-instructions').click();

  // Click through hardware guide slides; re-query button each time to avoid detached element
  let counter = 0;
  const nextButton = page.getByTestId('hardware-setup-guide-next-button');
  // eslint-disable-next-line no-await-in-loop
  while (counter <= 10 && (await nextButton.isVisible())) {
    // eslint-disable-next-line no-await-in-loop
    await nextButton.click();
    counter++;
  }

  // Click FINISH button (same testID, now showing "FINISH")
  await page
    .getByTestId('hardware-setup-guide-finish-button')
    .click({ force: true });

  await page.getByTestId('button-get-started').click();

  // 4. NUX: go through the flow and fill all forms using UI navigation

  // Step 1: Location – no locations, click Next to create first location
  await expect(page).toHaveURL(/\/(nux\/)?location($|\/|\?)/i);
  await page.getByTestId('button-next').click();
  await expect(page).toHaveURL(/\/locations\/new/i);
  await locationPage.fillLocationForm({
    name: 'Test Location',
    address: '123 Test St',
    city: 'Test City',
    state: 'Texas',
    zipCode: '12345',
  });
  await locationPage.submitForm();
  // Location create with returnTo=nux-wifi redirects to nux/wifi
  await expect(page).toHaveURL(/\/wifi/i);

  // Step 2: WiFi (intro) – click Next to go to wifi-setup
  await page.getByTestId('nux-wifi-content').getByTestId('button-next').click();
  await expect(page).toHaveURL(/\/wifi-setup/i);

  // WiFi setup: enter particle ID (skip full wifi config)
  await page.getByTestId('button-expand-particle-id').click();
  await page.getByTestId('input-particleId').fill('particle_nux_1');
  await page.getByRole('button', { name: 'Continue' }).click();
  await page.getByTestId('button-wifi-setup-continue').click();
  await expect(page).toHaveURL(/\/device/i);

  // Step 3: Device (intro) – click Next to go to devices/new
  await page
    .getByTestId('nux-device-content')
    .getByTestId('button-next')
    .click();
  await expect(page).toHaveURL(/\/devices\/new/i);
  // Device form has location + particleId from nux/device; select location and fill name
  const locationPicker = dropDown.create('location-dropdown');
  await locationPicker.select(0);
  await devicePage.fillDeviceForm({
    name: 'Test Device',
    particleId: 'particle_nux_1',
  });
  await devicePage.submitForm();
  // Device create with returnTo=nux-tap redirects to nux/tap
  await expect(page).toHaveURL(/\/tap/i);
  const devices = mockStore.getDevices();
  const createdDevice = devices[devices.length - 1];
  const deviceId = createdDevice?.id?.toString() ?? '';

  // Step 4: Tap – click Next on nux/tap to go to taps/new (with deviceId in params)
  await page.getByTestId('nux-tap-content').getByTestId('button-next').click();
  await expect(
    page.getByTestId('tap-form-loading').or(page.getByTestId('tap-form')),
  ).toBeVisible({ timeout: 10000 });

  // Device must have organization for taps/new - set before tap form loads
  const device = mockStore.getDevice(Number(deviceId));
  if (device) {
    mockStore.setDevice({
      ...device,
      organization: { id: org.id, name: org.name, isDeleted: false },
    });
  }

  // Fill and submit tap form
  await expect(
    page.getByTestId('tap-form-loading').or(page.getByTestId('tap-form')),
  ).toBeVisible({ timeout: 10000 });
  await tapPage.fillTapForm({
    name: 'Tap 1',
    deviceId: Number(deviceId),
  });
  await tapPage.submitForm();

  // Tap create navigates to flow-sensor; choose default sensor
  await expect(page).toHaveURL(/\/flow-sensor/i);
  await page.getByTestId('button-i-got-my-sensor-from-brewskey').click();

  // Flow-sensor navigates to keg/new; fill and submit
  await expect(page).toHaveURL(/\/keg\/new/i);
  await expect(page.getByTestId('keg-form')).toBeVisible();
  const beveragePicker = dropDown.create('beverage-dropdown');
  await beveragePicker.select(0);
  const kegTypeDd = dropDown.create('keg-type-dropdown');
  await kegTypeDd.select(0);
  await page.getByTestId('submit-button-create-keg').click();

  // Keg submit with returnTo=nux-finish goes to nux/finish
  await expect(page).toHaveURL(/\/finish/i);
  await nuxPage.clickFinish();
  await expect(page).not.toHaveURL(/\/finish($|\?)/i);
});
