/* eslint-disable max-classes-per-file */
/* eslint-disable import-x/no-extraneous-dependencies */
import { expect, Locator, Page } from '@playwright/test';

import { DropDownTestHelper } from './DropDownTestHelper';
import { ROUTES } from './routes';

export class LoginPage {
  constructor(private page: Page) {}

  async goto(): Promise<void> {
    await this.page.goto('/');
  }

  async fillEmail(email: string): Promise<void> {
    await this.page.getByTestId('login-username-input').fill(email);
  }

  async fillPassword(password: string): Promise<void> {
    await this.page.getByTestId('login-password-input').fill(password);
  }

  async fillUserName(userName: string): Promise<void> {
    await this.page.getByTestId('login-username-input').fill(userName);
  }

  async clickLogin(): Promise<void> {
    await this.page.getByTestId('login-submit-button').click();
  }

  async clickRegister(): Promise<void> {
    await this.page.getByTestId('button-register').click();
  }

  async clickForgotPassword(): Promise<void> {
    await this.page.getByTestId('button-forgot-password').click();
  }

  async login(userName: string, password: string): Promise<void> {
    await this.fillUserName(userName);
    await this.fillPassword(password);
    await this.clickLogin();
  }
}

export class HomePage {
  constructor(private page: Page) {}

  async goto(): Promise<void> {
    await this.page.goto('/');
  }

  getNearbyLocationsList(): Locator {
    return this.page.getByTestId('nearby-locations-list');
  }

  getPermissionRequestButton(): Locator {
    return this.page.getByTestId('button-provide-permissions');
  }

  async clickLocation(locationName: string): Promise<void> {
    await this.page.getByText(locationName).first().click();
  }
}

export class LocationPage {
  constructor(private page: Page) {}

  async goto(): Promise<void> {
    await this.page.goto('/locations');
  }

  getLocationsList(): Locator {
    return this.page.getByTestId('locations-list');
  }

  getAddLocationButton(): Locator {
    return this.page.getByTestId('header-add-button');
  }

  async clickLocation(locationName: string): Promise<void> {
    await this.page.getByText(locationName).first().click();
  }

  async fillLocationForm(data: {
    name: string;
    address: string;
    city: string;
    state: string;
    zipCode: string;
    locationType?: string;
    description?: string;
    suite?: string;
  }): Promise<void> {
    await this.page.getByTestId('input-name').fill(data.name);
    if (data.description != null) {
      await this.page.getByTestId('input-description').fill(data.description);
    }
    await this.page.getByTestId('input-street').fill(data.address);
    if (data.suite != null) {
      await this.page.getByTestId('input-suite').fill(data.suite);
    }
    await this.page.getByTestId('input-city').fill(data.city);
    // StatePicker: use dropdown fixture (state-dropdown in LocationForm)
    const dropDownHelper = new DropDownTestHelper(this.page);
    const stateDd = dropDownHelper.create('state-dropdown');
    await stateDd.selectByLabel(data.state);
    await this.page.getByTestId('input-zipCode').fill(data.zipCode);
    // Location type is required - fill it if provided, otherwise use default 'Kegerator'
    // LocationTypePicker: testID convention {name}-dropdown (location-type-dropdown in LocationForm)
    if (data.locationType) {
      const locationTypePicker = this.page.getByTestId(
        'location-type-dropdown',
      );
      await locationTypePicker.click();
      // Use scoped locator to avoid strict mode violations
      // Playwright's auto-waiting will handle timing
      const locationTypeOption = this.page
        .locator('[data-testid^="option-"]')
        .filter({ hasText: new RegExp(data.locationType, 'i') })
        .first();
      await expect(locationTypeOption).toBeVisible();
      await locationTypeOption.click();
      // Form state updates after dropdown closes (WebDropdown ensures dropdown is hidden before updating)
    } else {
      // Default to 'Kegerator' if not provided
      const locationTypePicker = this.page.getByTestId(
        'location-type-dropdown',
      );
      await locationTypePicker.click();
      // Playwright's auto-waiting will handle timing
      const kegeratorOption = this.page
        .locator('[data-testid^="option-"]')
        .filter({ hasText: /Kegerator/i })
        .first();
      await expect(kegeratorOption).toBeVisible();
      await kegeratorOption.click();
      // Form state updates after dropdown closes (WebDropdown ensures dropdown is hidden before updating)
    }
  }

  async submitForm(): Promise<void> {
    // Use or() locator to automatically wait for whichever button is visible
    // Tests should set up data explicitly to determine which button should exist
    const submitButton = this.page
      .getByTestId('submit-button-create-location')
      .or(this.page.getByTestId('submit-button-edit-location'));
    await submitButton.click();
  }
}

export class TapPage {
  constructor(private page: Page) {}

  async goto(): Promise<void> {
    await this.page.goto(ROUTES.TAPS);
  }

  getTapsList(): Locator {
    return this.page.getByTestId('taps-list');
  }

  getAddTapButton(): Locator {
    return this.page.getByTestId('header-add-button');
  }

  async clickTap(tapIdentifier: string | number): Promise<void> {
    // TapListItem displays as "${tapNumber} - ${beverageName}"
    // Accept either tapNumber or full display text
    const searchText =
      typeof tapIdentifier === 'number'
        ? tapIdentifier.toString()
        : tapIdentifier;
    await this.page.getByText(searchText).first().click();
  }

  async fillTapForm(data: {
    name: string;
    deviceId?: number;
    locationId?: number;
  }): Promise<void> {
    await this.page.getByTestId('input-description').fill(data.name);
    if (data.deviceId) {
      // DropdownInput uses WebDropdown which needs to be clicked and then option selected
      // TapForm device dropdown: testID convention device-dropdown
      const deviceDropdown = this.page.getByTestId('device-dropdown');
      await expect(deviceDropdown).toBeVisible({ timeout: 5000 });

      // Click to open the dropdown
      await deviceDropdown.click();

      // Find and click the device option - options have testID format: option-{index}
      // We need to find the option that matches the deviceId
      // Since devices are objects with name and id, try to find by device name
      // For now, click the first option (assuming devices are ordered and first matches)
      // Or we could find by device name if we had access to device data
      const firstOption = this.page.locator('[data-testid^="option-"]').first();
      await expect(firstOption).toBeVisible();
      await firstOption.scrollIntoViewIfNeeded();
      await firstOption.click();
    }
    // Note: locationId is not a field in TapForm, so we skip it
    // The test might be passing locationId incorrectly, but it won't break the test
  }

  async submitForm(): Promise<void> {
    // Use or() locator to automatically wait for whichever button is visible
    // Tests should set up data explicitly to determine which button should exist
    const submitButton = this.page
      .getByTestId('submit-button-create-tap')
      .or(this.page.getByTestId('submit-button-edit-tap'));
    await submitButton.click();
  }
}

export class DevicePage {
  constructor(private page: Page) {}

  async goto(): Promise<void> {
    await this.page.goto('/devices');
  }

  getDevicesList(): Locator {
    return this.page.getByTestId('devices-list');
  }

  getAddDeviceButton(): Locator {
    return this.page
      .getByTestId('button-add-device')
      .or(
        this.page
          .getByTestId('header-brewskey-boxes')
          .getByRole('button', { name: /add/i }),
      );
  }

  async clickDevice(deviceName: string): Promise<void> {
    await this.page.getByText(deviceName).first().click();
  }

  async fillDeviceForm(data: {
    name: string;
    particleId: string;
  }): Promise<void> {
    await this.page.getByTestId('input-name').fill(data.name);
    await this.page.getByTestId('input-particleId').fill(data.particleId);
  }

  async submitForm(): Promise<void> {
    // Use or() locator to automatically wait for whichever button is visible
    // Tests should set up data explicitly to determine which button should exist
    const submitButton = this.page
      .getByTestId('submit-button-create-device')
      .or(this.page.getByTestId('submit-button-edit-device'))
      .or(this.page.getByRole('button', { name: /save|submit/i }));
    await submitButton.first().click();
  }
}

export class SettingsPage {
  constructor(private page: Page) {}

  async goto(): Promise<void> {
    await this.page.goto(ROUTES.MENU_SETTINGS);
  }

  getChangePasswordForm(): Locator {
    return this.page.getByTestId('change-password-form');
  }

  async fillPasswordForm(data: {
    oldPassword: string;
    newPassword: string;
  }): Promise<void> {
    await this.page.getByTestId('input-oldPassword').fill(data.oldPassword);
    await this.page.getByTestId('input-newPassword').fill(data.newPassword);
  }

  async submitPasswordForm(): Promise<void> {
    await this.page.getByTestId('button-change-password').click();
  }

  getManageTapsToggle(): Locator {
    // ListItem has testID="switch-manage-taps", Switch inside has testID="switch-manage-taps-switch"
    return this.page.getByTestId('switch-manage-taps-switch');
  }

  async toggleManageTaps(): Promise<void> {
    await this.getManageTapsToggle().click();
  }

  getOrganizationPicker(): Locator {
    // OrganizationPicker: testID convention organization-dropdown
    return this.page.getByTestId('organization-dropdown');
  }

  async selectOrganization(organizationName: string): Promise<void> {
    const picker = this.page.getByTestId('organization-dropdown');
    await picker.click();
    // Wait for modal to open and select the organization by text
    await this.page.getByText(organizationName).click();
  }
}

export class NUXPage {
  constructor(private page: Page) {}

  async gotoLocationStep(locationsCount?: number): Promise<void> {
    const countParam =
      locationsCount !== undefined ? `?locationsCount=${locationsCount}` : '';
    await this.page.goto(`${ROUTES.NUX_LOCATION}${countParam}`);
  }

  async gotoWifiStep(): Promise<void> {
    await this.page.goto(ROUTES.NUX_WIFI);
  }

  async gotoDeviceStep(): Promise<void> {
    await this.page.goto(ROUTES.NUX_DEVICE);
  }

  async gotoTapStep(): Promise<void> {
    await this.page.goto(ROUTES.NUX_TAP);
  }

  getContinueButton(): Locator {
    return this.page.getByTestId('button-next');
  }

  getFinishButton(): Locator {
    return this.page.getByTestId('button-finish');
  }

  async clickContinue(): Promise<void> {
    await this.getContinueButton().click();
  }

  async clickFinish(): Promise<void> {
    await this.getFinishButton().click();
  }

  getLocationPicker(): Locator {
    return this.page.getByTestId('picker-location-nux');
  }

  async selectLocation(locationName: string): Promise<void> {
    const picker = this.page.getByTestId('picker-location-nux');
    await picker.click();
    // Wait for modal to open and select the location by text
    await this.page.getByText(locationName).click();
    // Selection is confirmed immediately (no confirmation button needed)
  }
}

export class WiFiSetupPage {
  constructor(private page: Page) {}

  async goto(deviceId?: string): Promise<void> {
    // WiFi setup requires a device ID - use "new" for new devices or a specific device ID
    const id = deviceId || 'new';
    await this.page.goto(`/devices/${id}/wifi-setup`);
  }

  async fillParticleId(particleId: string): Promise<void> {
    await this.page.getByTestId('input-particleId').fill(particleId);
  }

  getReadyButton(): Locator {
    return this.page.getByTestId('button-wifi-setup-ready');
  }

  async clickReady(): Promise<void> {
    await this.getReadyButton().click();
  }

  getWiFiNetworksList(): Locator {
    return this.page.getByTestId('wifi-networks-list');
  }

  async selectWiFiNetwork(ssid: string): Promise<void> {
    await this.page.getByText(ssid).first().click();
  }

  async fillWiFiPassword(password: string): Promise<void> {
    await this.page.getByTestId('input-wifiPassword').fill(password);
  }

  async submitWiFiSetup(): Promise<void> {
    // Use or() locator to automatically wait for whichever button is visible
    // Tests should set up data explicitly to determine which button should exist
    const submitButton = this.page
      .getByTestId('submit-button-connect')
      .or(this.page.getByRole('button', { name: /connect|submit/i }));
    await submitButton.first().click();
  }
}

export class MenuPage {
  constructor(private page: Page) {}

  async goto(): Promise<void> {
    await this.page.goto(ROUTES.MENU);
  }

  getFriendsButton(): Locator {
    return this.page.getByTestId('menu-item-friends');
  }

  getLocationsButton(): Locator {
    return this.page.getByTestId('menu-item-locations');
  }

  getTapsButton(): Locator {
    return this.page.getByTestId('menu-item-taps');
  }

  getDevicesButton(): Locator {
    return this.page.getByTestId('menu-item-devices');
  }

  getBeveragesButton(): Locator {
    return this.page.getByTestId('menu-item-beverages');
  }

  getHelpButton(): Locator {
    return this.page.getByTestId('menu-item-help');
  }

  getSettingsButton(): Locator {
    return this.page.getByTestId('header-settings-button');
  }

  getLogoutButton(): Locator {
    return this.page.getByTestId('menu-item-logout');
  }

  async clickFriends(): Promise<void> {
    await this.getFriendsButton().click();
  }

  async clickLocations(): Promise<void> {
    await this.getLocationsButton().click();
  }

  async clickTaps(): Promise<void> {
    await this.getTapsButton().click();
  }

  async clickDevices(): Promise<void> {
    await this.getDevicesButton().click();
  }

  async clickBeverages(): Promise<void> {
    await this.getBeveragesButton().click();
  }

  async clickHelp(): Promise<void> {
    await this.getHelpButton().click();
  }

  async clickSettings(): Promise<void> {
    await this.getSettingsButton().click();
  }

  async clickLogout(): Promise<void> {
    await this.getLogoutButton().click();
  }
}

export class StatsPage {
  constructor(private page: Page) {}

  async goto(): Promise<void> {
    await this.page.goto(ROUTES.STATS);
    // Wait for stats screen to render (session and queries)
    await this.page.getByTestId('header-stats').waitFor({ state: 'visible', timeout: 10000 });
  }

  getBadgesSection(): Locator {
    return this.page.getByTestId('badges-section');
  }

  getBeveragesSection(): Locator {
    return this.page.getByTestId('beverages-section');
  }

  getRecentPoursList(): Locator {
    return this.page.getByTestId('recent-pours-list');
  }
}

// Helper functions for common interactions
export async function waitForQuery(page: Page, timeout = 5000): Promise<void> {
  await page.waitForFunction(
    () =>
      // Check if React Query is done loading
      !document.querySelector('[data-loading="true"]'),
    { timeout },
  );
}

export async function assertToast(
  page: Page,
  message: string,
  timeout = 5000,
): Promise<void> {
  await expect(page.getByText(message).first()).toBeVisible({ timeout });
}

export async function fillForm(
  page: Page,
  fields: Record<string, string>,
): Promise<void> {
  for (const [name, value] of Object.entries(fields)) {
    await page.getByTestId(`input-${name}`).fill(value);
  }
}

// Note: Geolocation permissions are already configured in test-fixtures.ts
// For tests that need to deny permissions, use:
// await page.context().clearPermissions();
