import { mockStore } from '../../fixtures/api-mocks';
import { mockNewUserState } from '../../fixtures/entity-fixtures';
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
    await page.goto('/menu');
    await page.getByTestId('header-settings-button').click();
    await expect(page).toHaveURL(/\/settings/i);

    // 2. Click "Manage taps" (toggle ON so Taps menu item appears)
    await settingsPage.toggleManageTaps();

    // 3. Go back to menu and click "Taps" – NUX shows because user has no locations/taps/devices
    // Use goBack() so in-memory app settings (manageTapsEnabled: true) are preserved
    await page.goBack();
    await expect(page.getByTestId('menu-item-taps')).toBeVisible();
    await page.getByTestId('menu-item-taps').click();
    await expect(page).toHaveURL(/\/taps/i);

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

    // Step 1: Location – navigate via Menu to add first location
    await expect(page).toHaveURL(/\/(nux\/)?location($|\/|\?)/i);
    // Go to Menu -> Locations -> Add to create location
    await page.getByTestId('tab-menu').click();
    await page.getByTestId('menu-item-locations').click();
    await page
      .getByTestId('header-locations')
      .getByTestId('header-add-button')
      .click();
    await expect(page).toHaveURL(/\/locations\/new/i);
    await locationPage.fillLocationForm({
      name: 'Test Location',
      address: '123 Test St',
      city: 'Test City',
      state: 'Texas',
      zipCode: '12345',
    });
    await locationPage.submitForm();
    // After create we're at locations/[id]; use returnTo flow - locations/new needs returnTo param
    // For now navigate to taps via menu to continue NUX
    await expect(page).toHaveURL(/\/locations\/\d+/);
    await nuxPage.gotoWifiStep();
    await expect(page).toHaveURL(/\/wifi/i);

    // Step 2: WiFi (intro only) – click Next (scope to nux-wifi-content - multiple Next buttons in DOM)
    await page
      .getByTestId('nux-wifi-content')
      .getByTestId('button-next')
      .click();
    await expect(page).toHaveURL(/\/device/i);

    // Step 3: Device (intro) – click Next to go to tap intro, then Next to devices list
    await page
      .getByTestId('nux-device-content')
      .getByTestId('button-next')
      .click();
    await expect(page).toHaveURL(/\/tap/i);
    await page
      .getByTestId('nux-tap-content')
      .getByTestId('button-next')
      .click();
    await expect(page).toHaveURL(/\/devices/i);
    // Add device from devices list (fromNux is passed so onTapSetupFinish will be used)
    await page.getByTestId('button-add-device').click();
    await expect(page).toHaveURL(/\/devices\/new/i);
    // Select location (Test Location we just created) and fill device form
    const locationPicker = dropDown.create('location-dropdown');
    await locationPicker.select(0);
    await devicePage.fillDeviceForm({
      name: 'Test Device',
      particleId: 'particle_nux_1',
    });
    await devicePage.submitForm();
    await expect(page).toHaveURL(/\/devices\/\d+/);
    const devMatch = /\/devices\/(\d+)/.exec(page.url());
    const deviceId = devMatch ? devMatch[1] : '';

    // Device must have organization for taps/new
    const device = mockStore.getDevice(Number(deviceId));
    if (device) {
      mockStore.setDevice({
        ...device,
        organization: { id: org.id, name: org.name, isDeleted: false },
      });
    }

    // Step 4: Tap – add tap from device details (onTapSetupFinish passed via fromNux)
    await page.getByTestId('button-add-tap').click();
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

    // Keg submit with onTapSetupFinish goes to nux/finish
    await expect(page).toHaveURL(/\/finish/i);
    await nuxPage.clickFinish();
    await expect(page).not.toHaveURL(/\/finish($|\?)/i);
  },
);
