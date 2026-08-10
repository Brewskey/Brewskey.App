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
  BeverageMutator,
  Device,
  DeviceMutator,
  FlowSensor,
  FlowSensorMutator,
  Keg,
  KegMutator,
  Location,
  LocationMutator,
  Organization,
  OrganizationMutator,
  Pour,
  Tap,
  TapMutator,
} from '@brewskey/js-api';

export const API_HOST =
  process.env.EXPO_PUBLIC_API_HOST ?? 'http://localhost:8080';

export const DEFAULT_E2E_PASSWORD = 'E2e_Pass1!';

/** The device cloud service in tests/e2e-stack/docker-compose.yml. */
export const CLOUD_HOST =
  process.env.E2E_CLOUD_HOST ?? 'http://localhost:8082';

/**
 * The cloud admin's deterministic access token, seeded by
 * tests/e2e-stack/mongo-init/seed-cloud-admin.js and also configured as the
 * API's Particle__CloudAccessToken in docker-compose.yml.
 */
export const CLOUD_ADMIN_TOKEN = 'e2e-cloud-admin-token-3f9c1a7e5d2b4860';

/**
 * Static RSA public key registered for every provisioned e2e device. The
 * cloud's provisioning endpoint requires a valid public key; e2e devices
 * never open a real TCP session, so one shared throwaway key is fine.
 */
const E2E_DEVICE_PUBLIC_KEY = `-----BEGIN PUBLIC KEY-----
MIGfMA0GCSqGSIb3DQEBAQUAA4GNADCBiQKBgQDU7/J78ObgTNAM7yauSw6351wx
eQPjfUEOVZUfaJjiiM220ttrs6PvYNpDorHGsViv0/egPvq922T992iaiMfUYDYO
YLm+D9aiPk68ImsAm6+zriX0a5s7dCklomC1nfe2n48F/gwfUjocsW2kflD4ucdo
r0wh5E3kR67TacqcYwIDAQAB
-----END PUBLIC KEY-----`;

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
 * Unique, widely-spread coordinates for pour tests. The pour-authorization
 * endpoint matches a TOTP against the devices at the 10 locations NEAREST the
 * caller's coordinates; because the stack DB persists and every pourable/
 * nearby seed drops a location at the SAME fixture point, a shared point would
 * eventually push a freshly-seeded device out of that top-10 window. Giving
 * each pour test its own coordinates (>3km from any other test's, the match
 * radius) isolates its device. Set both the browser geolocation AND the
 * seeded device to these coordinates.
 */
export const uniqueGeolocation = (): {
  latitude: number;
  longitude: number;
} => {
  uniqueCounter += 1;
  const seed = (process.pid * 100_000 + Date.now() + uniqueCounter) % 4_000_000;
  // 0.1° steps (~11km lat, >5km lon at these latitudes) across a wide land box.
  const latitude = 10 + (seed % 500) * 0.1; // 10.0 .. 59.9
  const longitude = -160 + (Math.floor(seed / 500) % 800) * 0.1; // -160 .. -80.1
  return { latitude, longitude };
};

/**
 * Declarative seed configuration. Every entity accepts either a count (create
 * N with defaults) or an array of per-item configs (override fields on each).
 * The hierarchy auto-fills: request `taps` without `devices`/`locations` and
 * the parents are created for you.
 *
 * @example
 * ```ts
 * test.use({ seed: { organization: true, devices: 2, taps: 1 } });
 * test('...', async ({ organization, devices, taps }) => { ... });
 * ```
 */
export type LocationSeed = Partial<LocationMutator> & {
  /** Geolocate at the browser's mocked coordinates (appears in "nearby"). */
  nearby?: boolean;
};
export type DeviceSeed = Partial<DeviceMutator> & {
  /** Index into the seeded locations to place this device (default: spread). */
  locationIndex?: number;
};
export type TapSeed = Partial<TapMutator> & {
  /** Index into the seeded devices to attach this tap to (default: spread). */
  deviceIndex?: number;
  /** Flow sensor to attach: 'Titan' (default), 'Custom', or false for none. */
  flowSensor?: 'Titan' | 'Custom' | false;
  /** Attach an active keg — true for a default beverage, or a beverage config. */
  keg?: boolean | BeverageSeed;
  /**
   * Fabricate N real pours for the authenticated user on this tap through
   * the actual pour pipeline (admin POST api/pour/test). Auto-attaches a
   * keg when none is configured — pours need an active keg.
   */
  pours?: number;
};
export type BeverageSeed = Partial<BeverageMutator>;
export type OrganizationSeed = Partial<OrganizationMutator>;

export type SeedSpec = {
  /**
   * Create ONE organization and select it — scopes all seeded entities AND
   * the app (via app settings) to that org. `true` for defaults, or a config.
   */
  organization?: boolean | OrganizationSeed;
  /** Extra organizations (created but NOT selected). */
  organizations?: number | OrganizationSeed[];
  locations?: number | LocationSeed[];
  devices?: number | DeviceSeed[];
  taps?: number | TapSeed[];
  beverages?: number | BeverageSeed[];
};

export type SeedResult = {
  /** The selected organization (from `organization`), or null. */
  organization: Organization | null;
  organizations: Organization[];
  locations: Location[];
  devices: Device[];
  taps: Tap[];
  beverages: Beverage[];
  /** Pours fabricated via `taps[n].pours`, in creation order. */
  pours: Pour[];
};

const toConfigs = <T>(value: number | T[] | undefined): T[] => {
  if (value == null) {
    return [];
  }
  if (typeof value === 'number') {
    return Array.from({ length: value }, () => ({}) as T);
  }
  return value;
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
    // Config is a process singleton shared across tests in a worker; clear any
    // organization scope a previous test selected so seeding starts unscoped.
    BrewskeyApi.setOrganizationID(null);
  }

  /**
   * Scope all subsequent seed writes/reads to an organization (appends
   * `?organizationID=` on every DAO call, exactly as the app does when an org
   * is selected). Pass null to clear.
   */
  useOrganization(organizationID: Organization['id'] | null): void {
    BrewskeyApi.setOrganizationID(organizationID);
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
    overrides: Partial<LocationMutator> = {},
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
    overrides: Partial<DeviceMutator> = {},
  ): Promise<Device> {
    const particleId = overrides.particleId ?? uniqueParticleId();
    const device = await DeviceDAO.post({
      name: 'Seeded Device',
      deviceType: 'BrewskeyBox',
      deviceStatus: 'Active',
      nfcStatus: 'Disabled',
      locationId: location.id,
      isScreenDisabled: false,
      isTotpDisabled: false,
      shouldInvertScreen: false,
      ledBrightness: 50,
      secondsToStayOpen: 2,
      timeForValveOpen: 2,
      ...overrides,
      particleId,
    });

    // Register the device with the real device cloud so cloud-backed reads
    // (online status via /api/v2/cloud-devices/{particleId}) return real
    // data instead of "no such device".
    await this.registerCloudDevice(particleId);

    return device;
  }

  /**
   * Registers a device in the device cloud through its real provisioning
   * API (creates the device's key + attribute records — what a physical
   * device's first handshake would). The device never connects, so the
   * cloud reports it offline; that is the real, expected state for e2e
   * hardware. Requires spark-server >= 1.0.17 in the cloud image (earlier
   * versions 400 on provisioning never-connected devices).
   */
  async registerCloudDevice(particleId: string): Promise<void> {
    const response = await fetch(
      `${CLOUD_HOST}/v1/provisioning/${particleId}`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${CLOUD_ADMIN_TOKEN}`,
        },
        body: JSON.stringify({
          algorithm: 'rsa',
          publicKey: E2E_DEVICE_PUBLIC_KEY,
          filename: 'cli',
          order: 'e2e',
        }),
      },
    ).catch((error: Error) => {
      throw new Error(
        `Cloud device provisioning failed (${error.message}). If the stack ` +
          'predates the devicecloud service, recreate it: ' +
          'npm run e2e-stack:down && npm run e2e-stack:up',
      );
    });
    if (!response.ok) {
      throw new Error(
        `Cloud device provisioning failed (${response.status}): ` +
          `${await response.text()}`,
      );
    }
  }

  /** Tap without a flow sensor (for sensor-specific specs). */
  async createTapWithoutSensor(
    location: Location,
    device: Device,
    overrides: Partial<TapMutator> = {},
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
    overrides: Partial<TapMutator> = {},
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
  ): Promise<Pour[]> {
    const restore = this.credentials;
    await this.loginAsAdmin();
    try {
      const pours: Pour[] = [];
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
    overrides: Partial<FlowSensorMutator> = {},
  ): Promise<FlowSensor> {
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
  async createPour(tap: Tap, ownerUserName: string): Promise<Pour> {
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
        return (await response.json()) as Pour;
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
    overrides: Partial<LocationMutator> = {},
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
    overrides: Partial<BeverageMutator> = {},
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
    overrides: Partial<KegMutator> = {},
  ): Promise<Keg> {
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
    overrides: Partial<OrganizationMutator> = {},
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

  /**
   * Resolves a declarative {@link SeedSpec} into real entities through the
   * live API. The parent hierarchy auto-fills (ask for taps and the device +
   * location are created), each entity accepts a count or per-item configs,
   * and a selected `organization` scopes everything to that org.
   *
   * `nearbyCoordinates` (the browser context's geolocation, injected by the
   * seededEntities fixture) is where `nearby: true` locations are placed, so
   * seeded coordinates can never drift from where the app thinks it is.
   */
  async seed(
    spec: SeedSpec,
    nearbyCoordinates?: { latitude: number; longitude: number },
  ): Promise<SeedResult> {
    const result: SeedResult = {
      organization: null,
      organizations: [],
      locations: [],
      devices: [],
      beverages: [],
      taps: [],
      pours: [],
    };

    // A selected organization scopes every subsequent write to that org (so
    // the app, also scoped to it, can see the seeded entities).
    if (spec.organization) {
      const overrides =
        typeof spec.organization === 'object' ? spec.organization : {};
      const organization = await this.createOrganization(overrides);
      this.useOrganization(organization.id);
      result.organization = organization;
      result.organizations.push(organization);
    }

    // Extra, unselected organizations.
    for (const overrides of toConfigs<OrganizationSeed>(spec.organizations)) {
      result.organizations.push(await this.createOrganization(overrides));
    }

    for (const config of toConfigs<LocationSeed>(spec.locations)) {
      const { nearby, ...overrides } = config;
      result.locations.push(
        nearby
          ? await this.createNearbyLocation(
              overrides,
              nearbyCoordinates?.latitude,
              nearbyCoordinates?.longitude,
            )
          : await this.createLocation(overrides),
      );
    }

    // Track each device's location so taps land in the right place.
    const deviceLocations: Location[] = [];
    const deviceConfigs = toConfigs<DeviceSeed>(spec.devices);
    if (deviceConfigs.length > 0 && result.locations.length === 0) {
      result.locations.push(await this.createLocation());
    }
    for (let i = 0; i < deviceConfigs.length; i++) {
      const { locationIndex, ...overrides } = deviceConfigs[i];
      const location =
        result.locations[locationIndex ?? i % result.locations.length];
      result.devices.push(await this.createDevice(location, overrides));
      deviceLocations.push(location);
    }

    const tapConfigs = toConfigs<TapSeed>(spec.taps);
    if (tapConfigs.length > 0 && result.devices.length === 0) {
      if (result.locations.length === 0) {
        result.locations.push(await this.createLocation());
      }
      result.devices.push(await this.createDevice(result.locations[0]));
      deviceLocations.push(result.locations[0]);
    }
    for (let i = 0; i < tapConfigs.length; i++) {
      const {
        deviceIndex,
        flowSensor = 'Titan',
        keg,
        pours,
        ...overrides
      } = tapConfigs[i];
      const index = deviceIndex ?? i % result.devices.length;
      const device = result.devices[index];
      const location = deviceLocations[index];

      const tap = await this.createTapWithoutSensor(location, device, overrides);
      if (flowSensor) {
        await this.createFlowSensor(
          tap,
          flowSensor === 'Custom'
            ? { flowSensorType: 'Custom', pulsesPerGallon: 1000 }
            : {},
        );
      }
      // Pours flow through the real pipeline, which needs an active keg.
      const kegConfig = keg ?? (pours ? true : undefined);
      if (kegConfig) {
        const beverage = await this.createBeverage(
          typeof kegConfig === 'object' ? kegConfig : {},
        );
        result.beverages.push(beverage);
        await this.createKeg(tap, beverage);
      }
      if (pours) {
        const owner = this.credentials?.userName;
        if (!owner) {
          throw new Error('Seeding pours requires an authenticated user.');
        }
        result.pours.push(...(await this.createPours(tap, owner, pours)));
      }
      // Re-fetch so server-assigned fields (tapNumber, currentKeg) are
      // populated on the fixture value.
      result.taps.push(await this.fetchTap(tap.id));
    }

    for (const overrides of toConfigs<BeverageSeed>(spec.beverages)) {
      result.beverages.push(await this.createBeverage(overrides));
    }

    return result;
  }
}
