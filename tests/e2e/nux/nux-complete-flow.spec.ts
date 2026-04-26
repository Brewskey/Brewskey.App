import { mockStore } from '../../fixtures/api-mocks';
import { mockNewUserState } from '../../fixtures/entity-fixtures';
import { ROUTES } from '../../fixtures/routes';
import { setAppSettingsStorage } from '../../fixtures/storage-helper';
import {
  createMockBeverage,
  createMockOrganization,
  createShortenedEntity,
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

  let org: ReturnType<typeof createMockOrganization>;
  await test.step('Setup: new user state and test data', async () => {
    await mockNewUserState(page);
    await setAppSettingsStorage(page, {
      manageTapsEnabled: false,
      selectedOrganization: null,
    });
    org = createMockOrganization();
    mockStore.setOrganization(org);
    const beverage = createMockBeverage({ name: 'Test Beverage' });
    mockStore.setBeverage(beverage);
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
    const devices = mockStore.getDevices();
    const createdDevice = devices[devices.length - 1];
    deviceId = createdDevice?.id?.toString() ?? '';
    // Set device organization so tap form can load (taps/new requires device.organization)
    const device = mockStore.getDevice(Number(deviceId));
    if (device) {
      mockStore.setDevice({
        ...device,
        organization: createShortenedEntity(org.id, org.name),
      });
    }
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
