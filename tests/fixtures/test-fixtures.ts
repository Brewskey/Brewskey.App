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
 * @example Declarative entity seeding via test.use() (real API)
 * ```ts
 * test.use({ autoAuthenticate: true, seed: { locations: 2, taps: 3 } });
 *
 * test('my test', async ({ page, locations, taps }) => {
 *   // `locations` and `taps` are the real seeded entities, owned by the
 *   // authenticated user. Each entity option is `number | Config[]`:
 *   //   seed: { taps: [{ description: 'Left', flowSensor: 'Custom' }] }
 *   await page.goto('/taps');
 * });
 * ```
 *
 * @example Organization-scoped seeding
 * ```ts
 * // Creates + selects an org; every seeded entity (and the app) is scoped to it.
 * test.use({ autoAuthenticate: true, seed: { organization: true, devices: 1 } });
 *
 * test('my test', async ({ organization, devices }) => { ... });
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
  Pour,
  Tap,
} from '@brewskey/js-api';
import * as path from 'path';

import type { Notification } from '../../src/stores/NotificationTypes';

import { SeedApi, Credentials, SeedSpec, SeedResult } from './seed-api';
import { createMockUser } from './test-data';
import {
  setupAPIMonitoring,
  clearFailedRequests,
  writeFailureReport,
  getFailedRequests,
} from './api-monitoring';
import { setupSoftApMocks, SoftApMockOptions } from './soft-ap-mocks';
import {
  setAuthStorage,
  setAppSettingsStorage,
  setNotificationsStorage,
} from './storage-helper';
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

  /**
   * Declarative entity seeding, created through the real API and owned by the
   * authenticated user. Each entity is `number | Config[]` and the parent
   * hierarchy auto-fills. See {@link SeedSpec}.
   */
  seed?: SeedSpec;

  /**
   * Install the device SoftAP shim (the Brewskey box's WiFi-setup HTTP server
   * at 192.168.0.1 — physical hardware that cannot exist in e2e). `true` for
   * defaults, or per-test networks/particleId. Everything else stays real.
   */
  softAp?: SoftApMockOptions | boolean;

  /**
   * Pre-load the app's client-side notification store. Notifications arrive
   * via native push (no API surface on web), so they are injected into app
   * storage rather than seeded server-side. Wrapped in an object because a
   * bare array in test.use() is parsed as a [value, options] fixture tuple.
   */
  notifications?: { list: Notification[] };
};

export type AuthenticatedUser = {
  user: Account;
  authResponse: AuthResponse;
  credentials: Credentials;
};

export type SeededEntities = SeedResult;

type TestFixtures = {
  /** Authenticated js-api client bound to the e2e stack, for seeding. */
  seedApi: SeedApi;
  /** Auto: API monitoring + failure report around every test. */
  apiMonitoring: void;
  /** Auto: installs the SoftAP shim when the `softAp` option is set. */
  softApShim: void;
  /** Auto: injects the `notifications` option into the app's store. */
  notificationsStore: void;
  /**
   * Auto: when `autoAuthenticate` is set, registers a fresh real account,
   * logs it in, and pre-loads the app's session storage — the app boots
   * authenticated exactly as after a real login. Null otherwise.
   */
  authenticatedUser: AuthenticatedUser | null;
  /**
   * Auto: entities created through the real API per the `seed` option, owned
   * by the authenticated user. The individual entity fixtures below
   * (`locations`, `devices`, `taps`, `beverages`, `organizations`,
   * `organization`) are derived from this and are the ergonomic way to reach
   * the seeded data.
   */
  seededEntities: SeededEntities;
  /** The selected organization from `seed.organization`, or null. */
  organization: Organization | null;
  /** All organizations created by `seed` (selected + extra). */
  organizations: Organization[];
  /** Locations created by `seed`. */
  locations: Location[];
  /** Devices created by `seed`. */
  devices: Device[];
  /** Taps created by `seed`. */
  taps: Tap[];
  /** Beverages created by `seed` (standalone + any attached via `keg`). */
  beverages: Beverage[];
  /** Pours fabricated by `seed` (via `taps[n].pours`). */
  pours: Pour[];
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
  seed: [undefined, { option: true }],
  softAp: [false, { option: true }],
  notifications: [undefined, { option: true }],

  // Auto fixture: SoftAP hardware shim (see the `softAp` option)
  softApShim: [
    async ({ page, softAp }, use: () => Promise<void>) => {
      if (softAp) {
        setupSoftApMocks(page, typeof softAp === 'object' ? softAp : {});
      }
      await use();
    },
    { auto: true },
  ],

  // Auto fixture: client-side notification store (see the `notifications`
  // option). Depends on authenticatedUser so injection follows session setup.
  notificationsStore: [
    async (
      { page, notifications, authenticatedUser: _ },
      use: () => Promise<void>,
    ) => {
      if (notifications) {
        await setNotificationsStorage(page, notifications.list);
      }
      await use();
    },
    { auto: true },
  ],

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

  // Auto fixture: declarative entity seeding through the real API
  seededEntities: [
    async ({ page, seedApi, authenticatedUser, seed, geolocation }, use) => {
      const empty: SeededEntities = {
        organization: null,
        organizations: [],
        locations: [],
        devices: [],
        taps: [],
        beverages: [],
        pours: [],
      };

      if (!seed) {
        await use(empty);
        return;
      }

      if (!authenticatedUser) {
        throw new Error(
          'Entity seeding requires autoAuthenticate: entities are owned ' +
            'by (and visible to) the user that creates them.',
        );
      }

      // `nearby: true` locations are seeded at the context's geolocation so
      // the app and the data always agree on where "here" is.
      const seeded = await seedApi.seed(seed, geolocation ?? undefined);

      // A selected organization must be reflected in the app's settings so the
      // app scopes its queries to it (matching how the seeded entities were
      // created). This overrides the default set by authenticatedUser.
      if (seeded.organization) {
        await setAppSettingsStorage(page, {
          manageTapsEnabled: true,
          selectedOrganization: seeded.organization,
        });
      }

      await use(seeded);
    },
    { auto: true },
  ],

  // Derived fixtures: ergonomic access to the seeded entities so tests can
  // destructure `{ organization, taps, devices }` directly.
  organization: async ({ seededEntities }, use) => {
    await use(seededEntities.organization);
  },
  organizations: async ({ seededEntities }, use) => {
    await use(seededEntities.organizations);
  },
  locations: async ({ seededEntities }, use) => {
    await use(seededEntities.locations);
  },
  devices: async ({ seededEntities }, use) => {
    await use(seededEntities.devices);
  },
  taps: async ({ seededEntities }, use) => {
    await use(seededEntities.taps);
  },
  beverages: async ({ seededEntities }, use) => {
    await use(seededEntities.beverages);
  },
  pours: async ({ seededEntities }, use) => {
    await use(seededEntities.pours);
  },

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
