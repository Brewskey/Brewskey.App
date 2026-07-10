/**
 * Playwright Test Fixtures — real-API e2e
 *
 * Every test runs against the actual Brewskey.Web Docker stack
 * (tests/e2e-stack/docker-compose.yml) — there are no API mocks. Fixtures
 * follow the canonical Playwright patterns (https://playwright.dev/docs/test-fixtures):
 * dependency injection between fixtures, option fixtures via test.use(),
 * auto fixtures for per-test setup, and no module-level shared state.
 *
 * @example Auto-authentication (registers + logs in a real account)
 * ```ts
 * import { test, expect } from '../fixtures/test-fixtures';
 *
 * test.use({ autoAuthenticate: true });
 *
 * test('my test', async ({ page, authenticatedUser }) => {
 *   await page.goto('/home');
 * });
 * ```
 *
 * @example Entity seeding via test.use() (created through the real API)
 * ```ts
 * test.use({ autoAuthenticate: true, locationCount: 2, tapCount: 3 });
 *
 * test('my test', async ({ page, seededEntities }) => {
 *   // 2 locations (each with a device) and 3 taps each, owned by the
 *   // authenticated user
 *   await page.goto('/taps');
 * });
 * ```
 *
 * @example Ad-hoc seeding inside a test
 * ```ts
 * test('specific test', async ({ seedApi, authenticatedUser }) => {
 *   const location = await seedApi.createLocation({ name: 'Custom' });
 * });
 * ```
 */

import { test as base, TestInfo } from '@playwright/test';
import type {
  Account,
  AuthResponse,
  Beverage,
  Device,
  Location,
  Organization,
  Tap,
} from '@brewskey/js-api';
import * as path from 'path';

import { SeedApi, Credentials } from './seed-api';
import { createMockUser } from './test-data';
import {
  setupAPIMonitoring,
  clearFailedRequests,
  writeFailureReport,
  getFailedRequests,
} from './api-monitoring';
import { setAuthStorage, setAppSettingsStorage } from './storage-helper';
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
  NotificationsPage,
  StatsPage,
} from './page-objects';
import { DropDownTestHelper } from './DropDownTestHelper';

// Test options configured via test.use()
export type TestOptions = {
  // User configuration
  user?: Partial<Account>;
  autoAuthenticate?: boolean;

  // Entity seeding configuration (created through the real API, owned by
  // the authenticated user)
  locationCount?: number;
  tapCount?: number;
  deviceCount?: number;
  beverageCount?: number;
  organizationCount?: number;
};

export type AuthenticatedUser = {
  user: Account;
  authResponse: AuthResponse;
  credentials: Credentials;
};

export type SeededEntities = {
  locations: Location[];
  devices: Device[];
  taps: Tap[];
  beverages: Beverage[];
  organizations: Organization[];
};

type TestFixtures = {
  /** Authenticated js-api client bound to the e2e stack, for seeding. */
  seedApi: SeedApi;
  /** Auto: API monitoring + failure report around every test. */
  apiMonitoring: void;
  /**
   * Auto: when `autoAuthenticate` is set, registers a fresh real account,
   * logs it in, and pre-loads the app's session storage — the app boots
   * authenticated exactly as after a real login. Null otherwise.
   */
  authenticatedUser: AuthenticatedUser | null;
  /**
   * Auto: entities created through the real API per the count options,
   * owned by the authenticated user (mirrors the legacy mock hierarchy:
   * Location → Device → Taps, plus beverages/organizations).
   */
  seededEntities: SeededEntities;
  /**
   * Registers a real account WITHOUT logging the app in — for specs that
   * exercise the login flow itself. Returns the credentials to type.
   */
  seedUser: (overrides?: Partial<Account>) => Promise<Credentials>;
  loginPage: LoginPage;
  homePage: HomePage;
  locationPage: LocationPage;
  tapPage: TapPage;
  devicePage: DevicePage;
  settingsPage: SettingsPage;
  nuxPage: NUXPage;
  wifiPage: WiFiSetupPage;
  menuPage: MenuPage;
  notificationsPage: NotificationsPage;
  statsPage: StatsPage;
  dropDown: DropDownTestHelper;
};

export const test = base.extend<TestOptions & TestFixtures>({
  permissions: ['geolocation'],
  geolocation: { latitude: 40.7128, longitude: -74.006 },

  // Option fixtures (overridable via test.use())
  user: [undefined, { option: true }],
  autoAuthenticate: [false, { option: true }],
  locationCount: [0, { option: true }],
  tapCount: [0, { option: true }],
  deviceCount: [0, { option: true }],
  beverageCount: [0, { option: true }],
  organizationCount: [0, { option: true }],

  seedApi: async ({}, use) => {
    await use(new SeedApi());
  },

  // Auto fixture: request monitoring + failure report around every test
  apiMonitoring: [
    async ({ page }, use: () => Promise<void>, testInfo: TestInfo) => {
      clearFailedRequests();
      setupAPIMonitoring(page, testInfo.file, testInfo.title);

      await use();

      const failedRequests = getFailedRequests();
      if (failedRequests.length > 0) {
        const reportPath = path.join(process.cwd(), 'tests', 'API_FAILURES.md');
        await writeFailureReport(reportPath);
      }
    },
    { auto: true },
  ],

  // Auto fixture: real authentication when autoAuthenticate is set
  authenticatedUser: [
    async ({ page, seedApi, user, autoAuthenticate, apiMonitoring: _ }, use) => {
      if (!autoAuthenticate) {
        await use(null);
        return;
      }

      const { credentials, authResponse } = await seedApi.registerAndLogin(
        user ?? {},
      );

      // Account-shaped view of the real user for specs that read
      // authenticatedUser.user.*
      const account = createMockUser({
        ...user,
        id: authResponse.id,
        userName: credentials.userName,
        email: credentials.email,
      });

      // Pre-load the app's session storage so it boots authenticated
      await setAuthStorage(page, authResponse);
      await setAppSettingsStorage(page, {
        manageTapsEnabled: true,
        selectedOrganization: null,
      });

      await use({ user: account, authResponse, credentials });
    },
    { auto: true },
  ],

  // Auto fixture: entity seeding through the real API
  seededEntities: [
    async (
      {
        seedApi,
        authenticatedUser,
        locationCount,
        tapCount,
        deviceCount,
        beverageCount,
        organizationCount,
      },
      use,
    ) => {
      const seeded: SeededEntities = {
        locations: [],
        devices: [],
        taps: [],
        beverages: [],
        organizations: [],
      };

      const requested =
        (locationCount || 0) +
        (tapCount || 0) +
        (deviceCount || 0) +
        (beverageCount || 0) +
        (organizationCount || 0);

      if (requested > 0) {
        if (!authenticatedUser) {
          throw new Error(
            'Entity seeding requires autoAuthenticate: entities are owned ' +
              'by (and visible to) the user that creates them.',
          );
        }

        // Hierarchy mirrors the legacy mock seeding:
        // Location → Device → Taps
        for (let i = 0; i < (locationCount || 0); i++) {
          const location = await seedApi.createLocation({
            name: `Location ${i + 1}`,
          });
          seeded.locations.push(location);

          const device = await seedApi.createDevice(location, {
            name: `Device ${i + 1}`,
          });
          seeded.devices.push(device);

          for (let j = 0; j < (tapCount || 0); j++) {
            seeded.taps.push(await seedApi.createTap(location, device));
          }
        }

        // Additional devices beyond those created for locations need a
        // location to live in — create one if none was requested.
        const additionalDeviceCount = Math.max(
          0,
          (deviceCount || 0) - seeded.devices.length,
        );
        if (additionalDeviceCount > 0) {
          let deviceLocation = seeded.locations[0];
          if (!deviceLocation) {
            deviceLocation = await seedApi.createLocation({
              name: 'Device Location',
            });
            seeded.locations.push(deviceLocation);
          }
          for (let i = 0; i < additionalDeviceCount; i++) {
            seeded.devices.push(
              await seedApi.createDevice(deviceLocation, {
                name: `Device ${seeded.devices.length + 1}`,
              }),
            );
          }
        }

        for (let i = 0; i < (beverageCount || 0); i++) {
          seeded.beverages.push(
            await seedApi.createBeverage({ name: `Beverage ${i + 1}` }),
          );
        }

        for (let i = 0; i < (organizationCount || 0); i++) {
          seeded.organizations.push(
            await seedApi.createOrganization({ name: `Organization ${i + 1}` }),
          );
        }
      }

      await use(seeded);
    },
    { auto: true },
  ],

  seedUser: async ({ seedApi }, use) => {
    await use(async (overrides = {}) => seedApi.register(overrides));
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

  notificationsPage: async ({ page }, use) => {
    await use(new NotificationsPage(page));
  },

  statsPage: async ({ page }, use) => {
    await use(new StatsPage(page));
  },

  dropDown: async ({ page }, use) => {
    await use(new DropDownTestHelper(page));
  },
});

export { expect } from '@playwright/test';
