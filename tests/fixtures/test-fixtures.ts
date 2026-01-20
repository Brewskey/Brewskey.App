/**
 * Playwright Test Fixtures with Dependency Injection
 * 
 * This module provides custom Playwright test fixtures that automatically:
 * - Reset mock data stores before each test
 * - Set up API monitoring and mocking
 * - Provide authenticated user sessions
 * - Configure mock data via test.use()
 * 
 * @example Basic usage with auto-authentication
 * ```ts
 * import { test, expect } from '../fixtures/test-fixtures';
 * 
 * test.use({ autoAuthenticate: true });
 * 
 * test('my test', async ({ page, authenticatedUser }) => {
 *   // authenticatedUser is automatically available
 *   await page.goto('/home');
 * });
 * ```
 * 
 * @example Configure mock data via test.use()
 * ```ts
 * import { test, expect } from '../fixtures/test-fixtures';
 * 
 * test.use({
 *   autoAuthenticate: true,
 *   user: { userName: 'customuser' },
 *   locationCount: 2,
 *   tapCount: 3,
 * });
 * 
 * test('my test', async ({ page }) => {
 *   // 2 locations with 3 taps each are automatically created
 *   await page.goto('/taps');
 * });
 * ```
 * 
 * @example Per-test configuration
 * ```ts
 * test('specific test', async ({ page, mockStore }) => {
 *   // Use mockStore to manually add data
 *   const customLocation = createMockLocation({ name: 'Custom' });
 *   mockStore.setLocation(customLocation);
 * });
 * ```
 */

import { test as base, Page, TestInfo } from '@playwright/test';
import type {
  Account,
  Location,
  Tap,
  Beverage,
  Keg,
  Device,
  Organization,
  AuthResponse,
} from '@brewskey/js-api';
import {
  createMockUser,
  createMockLocation,
  createMockTap,
  createMockBeverage,
  createMockKeg,
  createMockDevice,
  createMockOrganization,
  resetIdCounter,
} from './test-data';
import { mockStore, setupAPIMocks, resetMockStore } from './api-mocks';
import {
  setupAPIMonitoring,
  clearFailedRequests,
  writeFailureReport,
  getFailedRequests,
} from './api-monitoring';
import { setAuthStorage, setAppSettingsStorage } from './storage-helper';
import type { AppSettings } from '../../src/hooks/context/AppSettingsContext';
import * as path from 'path';
import {
  LoginPage,
  HomePage,
  LocationPage,
  TapPage,
  DevicePage,
  SettingsPage,
  NUXPage,
  WiFiSetupPage,
  MenuPage,
  StatsPage,
} from './page-objects';

// Store for authentication setup data (set by __setup fixture)
let authSetupData: { user: Account; authResponse: AuthResponse } | null = null;

// Test options that can be configured via test.use()
export type TestOptions = {
  // User configuration
  user?: Partial<Account>;
  autoAuthenticate?: boolean;

  // Location configuration
  locationCount?: number;
  tapCount?: number;

  // Device configuration
  deviceCount?: number;

  // Beverage configuration
  beverageCount?: number;

  // Organization configuration
  organizationCount?: number;
};

// Fixture return types
type TestFixtures = {
  __setup: void;
  authenticatedUser: { user: Account; authResponse: AuthResponse } | null;
  mockStore: typeof mockStore;
  resetStores: void;
  loginPage: LoginPage;
  homePage: HomePage;
  locationPage: LocationPage;
  tapPage: TapPage;
  devicePage: DevicePage;
  settingsPage: SettingsPage;
  nuxPage: NUXPage;
  wifiPage: WiFiSetupPage;
  menuPage: MenuPage;
  statsPage: StatsPage;
};

/**
 * Custom Playwright test fixtures with dependency injection
 * 
 * Usage:
 * ```ts
 * import { test, expect } from '../fixtures/test-fixtures';
 * 
 * test('my test', async ({ page, authenticatedUser }) => {
 *   // authenticatedUser is automatically set up if autoAuthenticate is true
 * });
 * 
 * // Configure via test.use()
 * test.use({ autoAuthenticate: true, user: { userName: 'customuser' } });
 * ```
 */
export const test = base.extend<TestOptions & TestFixtures>({
  // Default options
  user: [undefined, { option: true }],
  autoAuthenticate: [false, { option: true }],
  locationCount: [0, { option: true }],
  tapCount: [0, { option: true }],
  deviceCount: [0, { option: true }],
  beverageCount: [0, { option: true }],
  organizationCount: [0, { option: true }],

  // Auto fixture: Set up authentication if autoAuthenticate is true
  // This runs after resetStores and before authenticatedUser fixture
  __setup: [
    async ({ page, user, autoAuthenticate, resetStores: _ }, use) => {
      // Reset auth setup data
      authSetupData = null;

      if (autoAuthenticate) {
        const mockUser = createMockUser(user);
        mockStore.setUser(mockUser);

        const authResponse: AuthResponse = {
          accessToken: `mock_token_${mockUser.id}`,
          refreshToken: `mock_refresh_${mockUser.id}`,
          id: mockUser.id,
          email: mockUser.email || '',
          userName: mockUser.userName,
          phoneNumber: mockUser.phoneNumber || '',
          expiresIn: 3600,
          expiresAt: new Date(Date.now() + 3600000),
          issuedAt: new Date(),
          tokenType: 'Bearer',
          roles: [],
          userLogins: [],
        };

        mockStore.setAuthToken(authResponse.accessToken, authResponse);

        // Set auth state - this handles __PLAYWRIGHT_AUTH_DATA__ and Storage setup
        await setAuthStorage(page, authResponse);

        // Set app settings to enable manageTapsEnabled by default for tests
        const appSettings: AppSettings = {
          manageTapsEnabled: true,
          selectedOrganization: null,
        };
        await setAppSettingsStorage(page, appSettings);

        // Store the auth setup data for authenticatedUser fixture to use
        authSetupData = { user: mockUser, authResponse };
      }

      await use();
    },
    { auto: true },
  ],

  // Auto fixture: Reset stores and set up API monitoring for every test
  resetStores: [
    async (
      { page, locationCount, tapCount, deviceCount, beverageCount, organizationCount },
      use: () => Promise<void>,
      testInfo: TestInfo,
    ) => {
      // Reset mock store and ID counter before test
      resetMockStore();
      resetIdCounter();
      clearFailedRequests();

      // Set up API monitoring
      setupAPIMonitoring(page, testInfo.file, testInfo.title);

      // Set up API mocks
      setupAPIMocks(page);

      // Populate stores based on configuration options
      // Create locations with taps
      // Hierarchy: Organization => Location => Devices => Taps => Kegs
      const locations: Location[] = [];
      const devicesCreatedForLocations: Device[] = [];
      
      for (let i = 0; i < (locationCount || 0); i++) {
        const location = createMockLocation({ name: `Location ${i + 1}` });
        mockStore.setLocation(location);
        locations.push(location);

        // Create a device for this location (required for taps)
        const device = createMockDevice({
          name: `Device ${i + 1}`,
          location: { id: location.id, name: location.name, isDeleted: false },
        });
        mockStore.setDevice(device);
        devicesCreatedForLocations.push(device);

        // Create taps for this location with the device
        for (let j = 0; j < (tapCount || 0); j++) {
          const tap = createMockTap({
            locationId: location.id,
            deviceId: device.id,
          });
          mockStore.setTap(tap);
        }
      }

      // Create additional devices (beyond those created for locations)
      // Only create if deviceCount > devicesCreatedForLocations.length
      const additionalDeviceCount = Math.max(0, (deviceCount || 0) - devicesCreatedForLocations.length);
      for (let i = 0; i < additionalDeviceCount; i++) {
        const device = createMockDevice({ name: `Device ${devicesCreatedForLocations.length + i + 1}` });
        mockStore.setDevice(device);
      }

      // Create beverages
      for (let i = 0; i < (beverageCount || 0); i++) {
        const beverage = createMockBeverage({ name: `Beverage ${i + 1}` });
        mockStore.setBeverage(beverage);
      }

      // Create organizations
      for (let i = 0; i < (organizationCount || 0); i++) {
        const organization = createMockOrganization({
          name: `Organization ${i + 1}`,
        });
        mockStore.setOrganization(organization);
      }

      await use();

      // After test: Write failure report if there were failures
      const failedRequests = getFailedRequests();
      if (failedRequests.length > 0) {
        const reportPath = path.join(
          process.cwd(),
          'tests',
          'API_FAILURES.md',
        );
        await writeFailureReport(reportPath);
      }
    },
    { auto: true },
  ],

  // Mock store fixture - provides access to the mock data store
  mockStore: async ({}, use) => {
    await use(mockStore);
  },

  // Authenticated user fixture - reads from __setup fixture data
  authenticatedUser: async ({ __setup }, use) => {
    // Read from the auth setup data that was set by __setup fixture
    await use(authSetupData);
  },

  // Page object fixtures - automatically instantiated with page dependency
  loginPage: async ({ page }, use) => {
    await use(new LoginPage(page));
  },

  homePage: async ({ page }, use) => {
    await use(new HomePage(page));
  },

  locationPage: async ({ page }, use) => {
    await use(new LocationPage(page));
  },

  tapPage: async ({ page }, use) => {
    await use(new TapPage(page));
  },

  devicePage: async ({ page }, use) => {
    await use(new DevicePage(page));
  },

  settingsPage: async ({ page }, use) => {
    await use(new SettingsPage(page));
  },

  nuxPage: async ({ page }, use) => {
    await use(new NUXPage(page));
  },

  wifiPage: async ({ page }, use) => {
    await use(new WiFiSetupPage(page));
  },

  menuPage: async ({ page }, use) => {
    await use(new MenuPage(page));
  },

  statsPage: async ({ page }, use) => {
    await use(new StatsPage(page));
  },

  // Note: Mock data creation is handled via helper functions in entity-fixtures.ts
  // Use test.use() to configure options, and helper functions for complex data setup
});

export { expect } from '@playwright/test';
