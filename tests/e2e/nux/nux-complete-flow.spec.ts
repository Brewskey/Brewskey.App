import { test, expect } from '../../fixtures/test-fixtures';
import { mockNewUserState } from '../../fixtures/entity-fixtures';
import { setAppSettingsStorage } from '../../fixtures/storage-helper';
import { createMockOrganization, createMockBeverage } from '../../fixtures/test-data';
import { mockStore } from '../../fixtures/api-mocks';

test('should complete full NUX flow', async ({
  page,
  nuxPage,
  settingsPage,
  locationPage,
  devicePage,
  tapPage,
}) => {
  // New user with no locations/taps/devices; manage taps OFF so we enable it in settings
  await mockNewUserState(page);
  await setAppSettingsStorage(page, { manageTapsEnabled: false, selectedOrganization: null });

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

  const hardwareNextButton = page.getByTestId('hardware-setup-guide-next-button');

  let counter = 0;
  while ((await hardwareNextButton.textContent())?.includes('FINISH') === false) {
    await hardwareNextButton.click();
    counter++;
    if (counter > 10) {
      throw new Error('Hardware setup guide next button not found');
    }
  }

  // finish
  await hardwareNextButton.click();

  await page.getByTestId('button-get-started').click();

  // 4. NUX: go through the flow and fill all forms

  // Step 1: Location – create first location (hasNoLocation, so we go to create form)
  await expect(page).toHaveURL(/\/location/i);
  await page.goto('/locations/new');
  await locationPage.fillLocationForm({
    name: 'Test Location',
    address: '123 Test St',
    city: 'Test City',
    state: 'Texas',
    zipCode: '12345',
  });
  await locationPage.submitForm();
  await expect(page).toHaveURL(/\/locations\/\d+/);
  const locMatch = page.url().match(/\/locations\/(\d+)/);
  const locationId = locMatch ? locMatch[1] : '';

  // Step 2: WiFi (intro only, no form)
  await nuxPage.gotoWifiStep();
  await expect(page).toHaveURL(/\/wifi/i);

  // Step 3: Device (intro) then create device
  await nuxPage.gotoDeviceStep();
  await expect(page).toHaveURL(/\/device/i);
  const deviceInitial = encodeURIComponent(
    JSON.stringify({
      location: { id: Number(locationId), name: 'Test Location' },
      name: '',
      particleId: '',
    }),
  );
  await page.goto(`/devices/new?hideLocation=true&initialValues=${deviceInitial}`);
  await devicePage.fillDeviceForm({ name: 'Test Device', particleId: 'particle_nux_1' });
  await devicePage.submitForm();
  await expect(page).toHaveURL(/\/devices\/\d+/);
  const devMatch = page.url().match(/\/devices\/(\d+)/);
  const deviceId = devMatch ? devMatch[1] : '';

  // Device must have organization for taps/new
  const device = mockStore.getDevice(Number(deviceId));
  if (device) {
    mockStore.setDevice({
      ...device,
      organization: { id: org.id, name: org.name, isDeleted: false },
    });
  }

  // Step 4: Tap (intro) then create tap
  await nuxPage.gotoTapStep();
  await expect(page).toHaveURL(/\/tap/i);
  await page.goto(`/taps/new?deviceId=${deviceId}&onTapSetupFinish=nux`);
  await expect(page.getByTestId('tap-form-loading').or(page.getByTestId('tap-form'))).toBeVisible();
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
  const beveragePicker = page.getByTestId('beverage-picker-beverage');
  await beveragePicker.click();
  await expect(page.getByText(beverage.name)).toBeVisible();
  await page.getByText(beverage.name).click();
  const kegTypeDropdown = page.getByTestId('dropdown-kegType');
  await kegTypeDropdown.click();
  const kegTypeModal = page.getByTestId('dropdown-kegType-modal');
  await expect(kegTypeModal.getByTestId('option-0')).toBeVisible();
  await kegTypeModal.getByTestId('option-0').click();
  await page.getByTestId('submit-button-create-keg').click();

  // Keg submit with onTapSetupFinish goes to (nux)/finish
  await expect(page).toHaveURL(/\/finish/i);
  await nuxPage.clickFinish();
  await expect(page).not.toHaveURL(/\/finish($|\?)/i);
});
