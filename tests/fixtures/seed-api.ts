/**
 * Seeding client for the real-API e2e stack (tests/e2e-stack).
 *
 * Drives the SAME @brewskey/js-api client the app uses — identical wire
 * shapes and translators, so seeded data can never drift from what the app
 * would create itself. js-api is a per-process singleton; Playwright workers
 * are separate processes and tests run serially within a worker, so
 * (re)initializing per test is safe.
 */
import BrewskeyApiDefault, {
  Auth,
  BeverageDAO,
  DeviceDAO,
  FlowSensorDAO,
  KegDAO,
  LocationDAO,
  OrganizationDAO,
  PermissionDAO,
  TapDAO,
} from '@brewskey/js-api';
import ConfigDefault from '@brewskey/js-api/dist/Config.js';

// The published dist is CommonJS: under Node's ESM interop the "default"
// import is module.exports itself, whose .default holds the real object.
// Unwrap once so this works under both module systems.
const unwrapDefault = <T>(mod: T): T =>
  (mod as { default?: T })?.default ?? mod;
const BrewskeyApi = unwrapDefault(
  BrewskeyApiDefault,
) as typeof BrewskeyApiDefault;
const Config = unwrapDefault(ConfigDefault) as typeof ConfigDefault;
import type {
  Account,
  AuthResponse,
  Beverage,
  Device,
  Location,
  Organization,
  Tap,
} from '@brewskey/js-api';

export const API_HOST =
  process.env.EXPO_PUBLIC_API_HOST ?? 'http://localhost:8080';

export const DEFAULT_E2E_PASSWORD = 'E2e_Pass1!';

let uniqueCounter = 0;

/**
 * Unique identifier: pid distinguishes parallel Playwright workers (which can
 * start in the same millisecond), the timestamp distinguishes runs against a
 * reused stack database, the counter distinguishes calls within a test.
 */
export const unique = (base: string): string => {
  uniqueCounter += 1;
  return `${base}${process.pid.toString(36)}${Date.now().toString(36)}${uniqueCounter}`;
};

/**
 * A unique 24-hex-char Particle device id (the ParticleId column is 24 chars,
 * and real Particle ids are 24 hex digits).
 */
export const uniqueParticleId = (): string => {
  uniqueCounter += 1;
  const hex = `${process.pid.toString(16)}${Date.now().toString(16)}${uniqueCounter.toString(16)}`;
  return hex.padStart(24, '0').slice(-24);
};

export type Credentials = {
  userName: string;
  email: string;
  password: string;
};

/**
 * One authenticated session against the e2e stack, with entity factories
 * that mirror the old mock factories' defaults (names like "Location 1")
 * so existing spec assertions keep working.
 */
export class SeedApi {
  session: AuthResponse | null = null;

  credentials: Credentials | null = null;

  constructor() {
    BrewskeyApi.initialize(API_HOST);
  }

  /**
   * Registers a fresh account without logging it in (js-api session
   * untouched — for specs that authenticate through the UI). Always
   * unique-suffixed: the stack database persists across tests in a run.
   */
  async register(
    overrides: Partial<Account> & { password?: string } = {},
  ): Promise<Credentials> {
    const userName = unique(overrides.userName ?? 'e2euser');
    const credentials: Credentials = {
      userName,
      email: overrides.email ?? `${userName}@brewskey.test`,
      password: overrides.password ?? DEFAULT_E2E_PASSWORD,
    };

    const response = await fetch(`${API_HOST}/api/Account/Register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: credentials.email,
        userName: credentials.userName,
        password: credentials.password,
      }),
    });
    if (!response.ok) {
      throw new Error(
        `Seed register failed (${response.status}): ${await response.text()}`,
      );
    }

    return credentials;
  }

  /**
   * Registers a second account and returns its real id, restoring the
   * current session afterwards (for specs that view another user's profile).
   */
  async registerOtherUser(
    overrides: Partial<Account> & { password?: string } = {},
  ): Promise<{ credentials: Credentials; id: string }> {
    const restore = this.credentials;
    const { credentials, authResponse } = await this.registerAndLogin(overrides);
    if (restore) {
      await this.login(restore);
    }
    return { credentials, id: String(authResponse.id) };
  }

  /** Register + login as the active js-api session (for entity seeding). */
  async registerAndLogin(
    overrides: Partial<Account> & { password?: string } = {},
  ): Promise<{ credentials: Credentials; authResponse: AuthResponse }> {
    const credentials = await this.register(overrides);
    const authResponse = await this.login(credentials);
    return { credentials, authResponse };
  }

  /** Password-grant login through js-api (becomes the active session). */
  async login(
    credentials: Pick<Credentials, 'userName' | 'password'>,
  ): Promise<AuthResponse> {
    const authResponse: AuthResponse = await Auth.login({
      userName: credentials.userName,
      password: credentials.password,
    });
    BrewskeyApi.initializeForSession(authResponse);
    this.session = authResponse;
    this.credentials = {
      userName: credentials.userName,
      password: credentials.password,
      email: (authResponse as { email?: string }).email ?? '',
    };
    return authResponse;
  }

  // Factories post the exact mutator shapes the app's own forms submit
  // (LocationMutator, DeviceMutator, TapMutator, BeverageMutator, KegMutator).

  async createLocation(
    overrides: Record<string, unknown> = {},
  ): Promise<Location> {
    return LocationDAO.post({
      id: undefined,
      name: unique('Seeded Location '),
      description: 'Seeded by e2e',
      street: '123 Test Street',
      suite: '',
      city: 'Seattle',
      state: 'WA',
      zipCode: 98101,
      locationType: 'Bar',
      squareLocationID: '',
      ...overrides,
    });
  }

  async createDevice(
    location: Location,
    overrides: Record<string, unknown> = {},
  ): Promise<Device> {
    return DeviceDAO.post({
      name: 'Seeded Device',
      deviceType: 'BrewskeyBox',
      deviceStatus: 'Active',
      nfcStatus: 'Disabled',
      particleId: uniqueParticleId(),
      locationId: location.id,
      isScreenDisabled: false,
      isTotpDisabled: false,
      shouldInvertScreen: false,
      ledBrightness: 50,
      secondsToStayOpen: 2,
      timeForValveOpen: 2,
      ...overrides,
    });
  }

  /** Tap without a flow sensor (for sensor-specific specs). */
  async createTapWithoutSensor(
    location: Location,
    device: Device,
    overrides: Record<string, unknown> = {},
  ): Promise<Tap> {
    return TapDAO.post({
      id: undefined,
      description: 'Seeded Tap',
      locationId: location.id,
      deviceId: device.id,
      disableBadges: false,
      hideLeaderboard: false,
      hideStats: false,
      isPaymentEnabled: false,
      requiresPourPrivilege: false,
      ...overrides,
    });
  }

  async createTap(
    location: Location,
    device: Device,
    overrides: Record<string, unknown> = {},
  ): Promise<Tap> {
    const tap = await this.createTapWithoutSensor(location, device, overrides);

    // A real tap can't pour without a flow sensor (the pipeline converts
    // pulses through it) — seed the standard Titan sensor like device setup
    // does.
    await this.createFlowSensor(tap);

    return tap;
  }

  /** Re-fetches a tap (e.g. after a keg attach updates currentKeg). */
  async fetchTap(id: Tap['id']): Promise<Tap> {
    return TapDAO.fetchByID(id);
  }

  /** Re-fetches a device (assert persisted edits against the real API). */
  async fetchDevice(id: Device['id']): Promise<Device> {
    return DeviceDAO.fetchByID(id);
  }

  /** All devices visible to the current session. */
  async fetchDevices(): Promise<Device[]> {
    return DeviceDAO.fetchMany();
  }

  /**
   * N real pours for `ownerUserName` on `tap`, fabricated through the pour
   * pipeline as the bootstrap admin, then restores the current session.
   */
  async createPours(
    tap: Tap,
    ownerUserName: string,
    count: number,
  ): Promise<unknown[]> {
    const restore = this.credentials;
    await this.loginAsAdmin();
    try {
      const pours: unknown[] = [];
      for (let i = 0; i < count; i++) {
        pours.push(await this.createPour(tap, ownerUserName));
      }
      return pours;
    } finally {
      if (restore) {
        await this.login(restore);
      }
    }
  }

  async createFlowSensor(
    tap: Tap,
    overrides: Record<string, unknown> = {},
  ): Promise<unknown> {
    return FlowSensorDAO.post({
      flowSensorType: 'Titan',
      pulsesPerGallon: 5375,
      tapId: tap.id,
      ...overrides,
    });
  }

  /**
   * Fabricates a pour through the REAL ingestion pipeline
   * (POST api/pour/test: device authorization → pour token →
   * PourBLL.AddPour → SignalR broadcast). Admin-only endpoint — call as
   * the bootstrap admin (loginAsAdmin) and pass the pour's owner.
   */
  async createPour(tap: Tap, ownerUserName: string): Promise<unknown> {
    // api/pour/test rolls a random pulse count (120-800); the real pour
    // pipeline rejects rolls that exceed the physical 2.5 oz/sec limit for
    // the Titan sensor, so retry until a valid roll lands (~60% pass rate).
    let lastError = '';
    for (let attempt = 0; attempt < 10; attempt++) {
      const response = await fetch(
        `${API_HOST}/api/pour/test?tapID=${tap.id}&userName=${encodeURIComponent(ownerUserName)}`,
        {
          method: 'POST',
          headers: { Authorization: `Bearer ${Config.token}` },
        },
      );
      if (response.ok) {
        return response.json();
      }
      lastError = `${response.status}: ${await response.text()}`;
    }
    throw new Error(`Seed pour failed after retries (${lastError})`);
  }

  /** Logs in as the stack's bootstrap admin (tests/e2e-stack compose env). */
  async loginAsAdmin(): Promise<AuthResponse> {
    return this.login({ userName: 'e2eadmin', password: 'E2e_Admin1!' });
  }

  /**
   * Sets a location's geolocation directly via the admin e2e seam (bypassing
   * Google geocoding). Restores the current session afterwards.
   */
  async geolocateLocation(
    locationId: Location['id'],
    latitude = 40.7128,
    longitude = -74.006,
    timeZone = 'America/New_York',
  ): Promise<void> {
    const restore = this.credentials;
    await this.loginAsAdmin();
    try {
      const response = await fetch(
        `${API_HOST}/api/e2e/locations/${locationId}/geolocation`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${Config.token}`,
          },
          body: JSON.stringify({ latitude, longitude, timeZone }),
        },
      );
      if (!response.ok) {
        throw new Error(
          `Seed geolocation failed (${response.status}): ${await response.text()}`,
        );
      }
    } finally {
      if (restore) {
        await this.login(restore);
      }
    }
  }

  /** A location geolocated at the browser's mocked coordinates (nearby). */
  async createNearbyLocation(
    overrides: Record<string, unknown> = {},
    latitude = 40.7128,
    longitude = -74.006,
  ): Promise<Location> {
    const location = await this.createLocation({
      name: unique('Nearby Location '),
      ...overrides,
    });
    await this.geolocateLocation(location.id, latitude, longitude);
    return location;
  }

  /** All taps visible to the current session. */
  async fetchTaps(): Promise<Tap[]> {
    return TapDAO.fetchMany();
  }

  /**
   * A fully pourable device placed at the given coordinates (defaults to the
   * Playwright fixture's mocked geolocation), with an active keg and its
   * current live TOTP code. Entering the returned `totp` in the pour modal
   * authorizes a real pour (TOTP+geolocation matches this device).
   */
  async createPourableDevice(
    latitude = 40.7128,
    longitude = -74.006,
  ): Promise<{ location: Location; device: Device; tap: Tap; totp: string }> {
    const location = await this.createLocation();
    const device = await this.createDevice(location);
    const tap = await this.createTap(location, device);
    const beverage = await this.createBeverage();
    await this.createKeg(tap, beverage);

    await this.geolocateLocation(location.id, latitude, longitude);
    const totp = await this.deviceTotp(device.id);
    return { location, device, tap, totp };
  }

  /**
   * The device's current live TOTP (admin-read, which also ensures its
   * authorization token exists). Call immediately before entering it — TOTP
   * codes roll every 30s and the pour endpoint strictly re-checks the
   * current-window code.
   */
  async deviceTotp(deviceId: Device['id']): Promise<string> {
    const restore = this.credentials;
    await this.loginAsAdmin();
    try {
      const response = await fetch(
        `${API_HOST}/api/devices/${deviceId}/totp`,
        { headers: { Authorization: `Bearer ${Config.token}` } },
      );
      if (!response.ok) {
        throw new Error(
          `Device TOTP fetch failed (${response.status}): ${await response.text()}`,
        );
      }
      const { totp } = (await response.json()) as { totp: string };
      return totp;
    } finally {
      if (restore) {
        await this.login(restore);
      }
    }
  }

  async createBeverage(
    overrides: Record<string, unknown> = {},
  ): Promise<Beverage> {
    return BeverageDAO.post({
      id: undefined,
      name: 'Seeded Beverage',
      description: 'Seeded by e2e',
      beverageType: 'Beer',
      isOrganic: false,
      abv: 5.5,
      ibu: 40,
      availableId: undefined,
      glasswareId: undefined,
      srmId: undefined,
      styleId: undefined,
      originalGravity: undefined,
      servingTemperature: undefined,
      year: undefined,
      ...overrides,
    });
  }

  async createKeg(
    tap: Tap,
    beverage: Beverage,
    overrides: Record<string, unknown> = {},
  ): Promise<unknown> {
    return KegDAO.post({
      beverageId: beverage.id,
      tapId: tap.id,
      kegType: 'HalfBarrel',
      startingPercentage: 100,
      ...overrides,
    });
  }

  /**
   * Organizations are admin-only to create (real 403 for regular users), and
   * users see them through permission rows. Creates the org as the bootstrap
   * admin, grants the current user an Administrator permission on it, then
   * restores the session.
   */
  async createOrganization(
    overrides: Record<string, unknown> = {},
  ): Promise<Organization> {
    const restore = this.credentials;
    const userId = this.session?.id;
    await this.loginAsAdmin();
    try {
      const organization = await OrganizationDAO.post({
        id: undefined,
        name: unique('Seeded Org '),
        ...overrides,
      });

      if (userId) {
        await PermissionDAO.post({
          id: undefined,
          entityId: organization.id,
          entityType: 'organizations',
          permissionType: 'Administrator',
          userId,
          startDate: undefined,
          expiresDate: undefined,
        });
      }

      return organization;
    } finally {
      if (restore) {
        await this.login(restore);
      }
    }
  }
}
