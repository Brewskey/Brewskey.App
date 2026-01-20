import { Page, Locator, expect } from '@playwright/test';

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
  }): Promise<void> {
    await this.page.getByTestId('input-name').fill(data.name);
    await this.page.getByTestId('input-street').fill(data.address);
    await this.page.getByTestId('input-city').fill(data.city);
    await this.page.getByTestId('input-state').fill(data.state);
    await this.page.getByTestId('input-zipCode').fill(data.zipCode);
  }

  async submitForm(): Promise<void> {
    // Use or() locator to automatically wait for whichever button is visible
    // Tests should set up data explicitly to determine which button should exist
    const submitButton = this.page.getByTestId('submit-button-create-location')
      .or(this.page.getByTestId('submit-button-edit-location'));
    await submitButton.click();
  }
}

export class TapPage {
  constructor(private page: Page) {}

  async goto(): Promise<void> {
    await this.page.goto('/taps');
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
    const searchText = typeof tapIdentifier === 'number' 
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
      await this.page.getByTestId('dropdown-deviceId').selectOption(data.deviceId.toString());
    }
    if (data.locationId) {
      await this.page.getByTestId('dropdown-locationId').selectOption(data.locationId.toString());
    }
  }

  async submitForm(): Promise<void> {
    // Use or() locator to automatically wait for whichever button is visible
    // Tests should set up data explicitly to determine which button should exist
    const submitButton = this.page.getByTestId('submit-button-create-tap')
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
    return this.page.getByTestId('header-brewskey-boxes').getByRole('button', { name: /add/i });
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
    const submitButton = this.page.getByTestId('submit-button-create-device')
      .or(this.page.getByTestId('submit-button-edit-device'))
      .or(this.page.getByRole('button', { name: /save|submit/i }));
    await submitButton.first().click();
  }
}

export class SettingsPage {
  constructor(private page: Page) {}

  async goto(): Promise<void> {
    await this.page.goto('/settings');
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
    return this.page.getByTestId('switch-manage-taps');
  }

  async toggleManageTaps(): Promise<void> {
    await this.getManageTapsToggle().click();
  }

  getOrganizationPicker(): Locator {
    return this.page.getByTestId('input-organization');
  }

  async selectOrganization(organizationName: string): Promise<void> {
    await this.page.getByTestId('input-organization').selectOption({ label: organizationName });
  }
}

export class NUXPage {
  constructor(private page: Page) {}

  async gotoLocationStep(): Promise<void> {
    await this.page.goto('/nux/location');
  }

  async gotoWifiStep(): Promise<void> {
    await this.page.goto('/nux/wifi');
  }

  async gotoDeviceStep(): Promise<void> {
    await this.page.goto('/nux/device');
  }

  async gotoTapStep(): Promise<void> {
    await this.page.goto('/nux/tap');
  }

  async gotoFinishStep(): Promise<void> {
    await this.page.goto('/nux/finish');
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
    return this.page.getByTestId('input-location');
  }

  async selectLocation(locationName: string): Promise<void> {
    await this.page.getByTestId('input-location').selectOption({ label: locationName });
  }
}

export class WiFiSetupPage {
  constructor(private page: Page) {}

  async goto(): Promise<void> {
    await this.page.goto('/wifi-setup');
  }

  async fillParticleId(particleId: string): Promise<void> {
    await this.page.getByTestId('input-particleId').fill(particleId);
  }

  getReadyButton(): Locator {
    return this.page.getByTestId('button-ready');
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
    const submitButton = this.page.getByTestId('submit-button-connect')
      .or(this.page.getByRole('button', { name: /connect|submit/i }));
    await submitButton.first().click();
  }
}

export class MenuPage {
  constructor(private page: Page) {}

  async goto(): Promise<void> {
    await this.page.goto('/menu');
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
    await this.page.goto('/stats');
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
export async function waitForQuery(page: Page, timeout: number = 5000): Promise<void> {
  await page.waitForFunction(
    () => {
      // Check if React Query is done loading
      return !document.querySelector('[data-loading="true"]');
    },
    { timeout },
  );
}

export async function assertToast(
  page: Page,
  message: string,
  timeout: number = 5000,
): Promise<void> {
  await expect(
    page.getByText(message).first(),
  ).toBeVisible({ timeout });
}

export async function fillForm(
  page: Page,
  fields: Record<string, string>,
): Promise<void> {
  for (const [name, value] of Object.entries(fields)) {
    await page.getByTestId(`input-${name}`).fill(value);
  }
}

export async function mockLocationPermission(
  page: Page,
  granted: boolean = true,
): Promise<void> {
  await page.addInitScript((granted) => {
    // Mock Expo Location API
    if (typeof window !== 'undefined') {
      // Mock expo-location module
      const mockLocation = {
        getForegroundPermissionsAsync: async () => ({
          status: granted ? 'granted' : 'denied',
          granted,
          canAskAgain: true,
          expires: 'never' as const,
        }),
        requestForegroundPermissionsAsync: async () => ({
          status: granted ? 'granted' : 'denied',
          granted,
          canAskAgain: true,
          expires: 'never' as const,
        }),
        getCurrentPositionAsync: async () => ({
          coords: {
            latitude: 40.7128,
            longitude: -74.0060,
            accuracy: 10,
            altitude: null,
            altitudeAccuracy: null,
            heading: null,
            speed: null,
          },
          timestamp: Date.now(),
        }),
      };
      
      // Store mock in window for expo-location to use
      (window as any).__EXPO_LOCATION_MOCK__ = mockLocation;
      
      // Also mock navigator.geolocation for compatibility
      const mockGetCurrentPosition: Geolocation['getCurrentPosition'] = (
        success: PositionCallback,
        error?: PositionErrorCallback,
      ) => {
        if (granted) {
          success({
            coords: {
              latitude: 40.7128,
              longitude: -74.0060,
              accuracy: 10,
              altitude: null,
              altitudeAccuracy: null,
              heading: null,
              speed: null,
            },
            timestamp: Date.now(),
          } as GeolocationPosition);
        } else {
          error?.({
            code: 1,
            message: 'User denied geolocation',
            PERMISSION_DENIED: 1,
            POSITION_UNAVAILABLE: 2,
            TIMEOUT: 3,
          } as GeolocationPositionError);
        }
      };
      Object.assign(navigator.geolocation, { getCurrentPosition: mockGetCurrentPosition });
    }
  }, granted);
}
