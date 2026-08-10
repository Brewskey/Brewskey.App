import { ROUTES } from '../../fixtures/routes';
import { setAppSettingsStorage } from '../../fixtures/storage-helper';
import { expect, test } from '../../fixtures/test-fixtures';

// A selected organization (the tap form requires the device to belong to one,
// and the UI scopes newly created entities to the selected org) plus a
// beverage for the keg step. autoAuthenticate registers + signs in the user.
test.use({
  autoAuthenticate: true,
  seed: { organization: true, beverages: [{ name: 'Test Beverage' }] },
});

test('should complete full NUX flow', async ({
  page,
  nuxPage,
  settingsPage,
  locationPage,
  devicePage,
  tapPage,
  dropDown,
  seedApi,
  organization,
}) => {
  test.setTimeout(60000);

  await test.step('Setup: start with Manage taps off, org selected', async () => {
    // The flow enables Manage taps via the UI below, so start it off while
    // keeping the seeded organization selected.
    await setAppSettingsStorage(page, {
      manageTapsEnabled: false,
      selectedOrganization: organization,
    });
  });

  await test.step('Go to settings and enable Manage taps', async () => {
    await page.goto(ROUTES.MENU);
    await page.getByTestId('menu-item-settings').click();
    await expect(page).toHaveURL(/\/settings/i);
    await settingsPage.toggleManageTaps();
  });

  await test.step('Navigate to Taps and open NUX instructions', async () => {
    await page.goBack();
    // Navigate directly to taps so we land on the screen with NuxNoEntity (button-see-instructions)
    await page.goto(ROUTES.TAPS);
    await expect(page).toHaveURL(/\/taps/i);
    await expect(page.getByTestId('button-see-instructions')).toBeVisible({
      timeout: 15000,
    });
    await page.getByTestId('button-see-instructions').click();
  });

  await test.step('Complete hardware setup guide slides', async () => {
    let counter = 0;
    const nextButton = page.getByTestId('hardware-setup-guide-next-button');
    // eslint-disable-next-line no-await-in-loop
    while (counter <= 10 && (await nextButton.isVisible())) {
      // eslint-disable-next-line no-await-in-loop
      await nextButton.click();
      counter++;
    }
    await page
      .getByTestId('hardware-setup-guide-finish-button')
      .click({ force: true });
    await page.getByTestId('button-get-started').click();
  });

  await test.step('NUX Location: create first location', async () => {
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
    await expect(page).toHaveURL(/\/wifi/i);
  });

  await test.step('NUX WiFi: enter particle ID and continue', async () => {
    // A physical box joins the device cloud during WiFi setup — register it
    // there so the app's later device-status reads return real data.
    await seedApi.registerCloudDevice('particle_nux_1');
    await page
      .getByTestId('nux-wifi-content')
      .getByTestId('button-next')
      .click();
    await expect(page).toHaveURL(/\/wifi-setup/i);
    await page.getByTestId('button-expand-particle-id').click();
    await page.getByTestId('input-particleId').fill('particle_nux_1');
    await page.getByRole('button', { name: 'Continue' }).click();
    await page.getByTestId('button-wifi-setup-continue').click();
    await expect(page).toHaveURL(/\/device/i);
  });

  let deviceId = '';
  await test.step('NUX Device: create device', async () => {
    await page
      .getByTestId('nux-device-content')
      .getByTestId('button-next')
      .click();
    await expect(page).toHaveURL(/\/devices\/new/i);
    // NUX flow passes locationId from wifi-setup, so location is pre-filled and dropdown is hidden
    await expect(page.getByTestId('submit-button-create-device')).toBeVisible({
      timeout: 15000,
    });
    const locationDropdown = page.getByTestId('location-dropdown');
    if (await locationDropdown.isVisible()) {
      const locationPicker = dropDown.create('location-dropdown');
      await locationPicker.select(0);
    }
    // Device form's name input (second input-name when location form is still in stack)
    const deviceNameInput = page.getByTestId('input-name').nth(1);
    await deviceNameInput.fill('Test Device');
    await devicePage.submitForm();
    await expect(page).toHaveURL(/\/tap/i);
    // The UI created a REAL device — find it through the API
    const devices = await seedApi.fetchDevices();
    const createdDevice = devices[devices.length - 1];
    deviceId = createdDevice?.id?.toString() ?? '';
  });

  await test.step('NUX Tap: create tap', async () => {
    await page
      .getByTestId('nux-tap-content')
      .getByTestId('button-next')
      .click();
    await expect(page).toHaveURL(/\/taps\/new/i);
    // Wait for tap form to be ready (after device load and org check)
    await expect(page.getByTestId('tap-form')).toBeVisible({ timeout: 20000 });
    await tapPage.fillTapForm({
      name: 'Tap 1',
      deviceId: Number(deviceId),
    });
    await tapPage.submitForm();
  });

  await test.step('Flow sensor: select Brewskey sensor', async () => {
    await expect(page).toHaveURL(/\/flow-sensor/i);
    await page.getByTestId('button-i-got-my-sensor-from-brewskey').click();
  });

  await test.step('Keg: fill and submit keg form', async () => {
    await expect(page).toHaveURL(/\/keg\/new/i);
    await expect(page.getByTestId('keg-form')).toBeVisible();
    const beveragePicker = dropDown.create('beverage-dropdown');
    await beveragePicker.select(0);
    const kegTypeDd = dropDown.create('keg-type-dropdown');
    await kegTypeDd.select(0);
    await page.getByTestId('submit-button-create-keg').click();
  });

  await test.step('NUX Finish: click finish and leave flow', async () => {
    await expect(page).toHaveURL(/\/finish/i);
    await nuxPage.clickFinish();
    await expect(page).not.toHaveURL(/\/finish($|\?)/i);
  });
});
