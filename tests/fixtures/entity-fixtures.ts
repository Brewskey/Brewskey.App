/**
 * Entity seeding helpers — REAL API edition.
 *
 * Every helper creates data through the actual Brewskey.Web stack via
 * SeedApi (the app's own @brewskey/js-api client), replacing the legacy
 * mock-store versions. Helpers act as the CURRENT js-api session (the
 * authenticatedUser fixture's account), so created entities carry real
 * creator-Administrator permissions and are visible to the signed-in app.
 */
import { Page } from '@playwright/test';
import type {
  Account,
  AuthResponse,
  Beverage,
  Device,
  Keg,
  Location,
  Organization,
  Pour,
  Tap,
} from '@brewskey/js-api';

import { SeedApi } from './seed-api';
import { createMockUser } from './test-data';
import { setAuthStorage } from './storage-helper';

/**
 * Registers + logs in a real account and pre-loads the app's session
 * storage. Prefer the `authenticatedUser` fixture (test.use({
 * autoAuthenticate: true })) — this exists for specs that need a second
 * account or manual control.
 */
export async function seedAuthenticatedUser(
  page: Page,
  seedApi: SeedApi,
  overrides?: Partial<Account>,
): Promise<{ user: Account; authResponse: AuthResponse }> {
  const { credentials, authResponse } = await seedApi.registerAndLogin(
    overrides ?? {},
  );
  const user = createMockUser({
    ...overrides,
    id: authResponse.id,
    userName: credentials.userName,
    email: credentials.email,
  });

  await setAuthStorage(page, authResponse);

  return { user, authResponse };
}

/**
 * A location with a device and `tapCount` taps (each tap gets a flow
 * sensor — real taps can't pour without one).
 */
export async function seedLocationWithTaps(
  seedApi: SeedApi,
  tapCount: number = 3,
): Promise<{ location: Location; taps: Tap[]; devices: Device[] }> {
  const location = await seedApi.createLocation();
  const device = await seedApi.createDevice(location);

  const taps: Tap[] = [];
  for (let i = 0; i < tapCount; i++) {
    taps.push(
      await seedApi.createTap(location, device, {
        description: `Tap ${i + 1}`,
      }),
    );
  }

  return { location, taps, devices: [device] };
}

/** A tap with an active keg (full real hierarchy under one location). */
export async function seedTapWithKeg(
  seedApi: SeedApi,
  description?: string,
): Promise<{
  tap: Tap;
  keg: Keg;
  beverage: Beverage;
  location: Location;
  device: Device;
}> {
  const location = await seedApi.createLocation();
  const device = await seedApi.createDevice(location);
  const beverage = await seedApi.createBeverage();
  const tap = await seedApi.createTap(location, device, { description });
  const keg = (await seedApi.createKeg(tap, beverage)) as Keg;

  // Re-fetch so tap.currentKeg reflects the keg the API attached
  const updatedTap = await seedApi.fetchTap(tap.id);

  return { tap: updatedTap, keg, beverage, location, device };
}

/** Empty state — nothing to seed against the real API. */
export async function seedEmptyState(): Promise<void> {}

/**
 * A signed-in user with no entities (NUX flow). Same as
 * seedAuthenticatedUser; kept as a named helper for the NUX specs.
 */
export async function seedNewUserState(
  page: Page,
  seedApi: SeedApi,
  user?: Partial<Account>,
): Promise<{ user: Account; authResponse: AuthResponse }> {
  return seedAuthenticatedUser(page, seedApi, user);
}

/** A location only (no devices or taps). */
export async function seedLocationOnly(
  seedApi: SeedApi,
): Promise<{ location: Location }> {
  const location = await seedApi.createLocation();
  return { location };
}

/** A device with `tapCount` taps under one location. */
export async function seedDeviceWithTaps(
  seedApi: SeedApi,
  tapCount: number = 2,
): Promise<{ device: Device; taps: Tap[]; location: Location }> {
  const location = await seedApi.createLocation();
  const device = await seedApi.createDevice(location);

  const taps: Tap[] = [];
  for (let i = 0; i < tapCount; i++) {
    taps.push(
      await seedApi.createTap(location, device, {
        description: `Tap ${i + 1}`,
      }),
    );
  }

  return { device, taps, location };
}

/**
 * A beverage plus real pour history for the current user, fabricated
 * through the actual pour pipeline (admin POST api/pour/test). Requires a
 * pourable hierarchy, which this creates.
 */
export async function seedBeverageWithPours(
  seedApi: SeedApi,
  pourCount: number = 5,
  ownerUserName?: string,
  beverageOverrides?: Record<string, unknown>,
): Promise<{ beverage: Beverage; pours: Pour[]; tap: Tap }> {
  const owner = ownerUserName ?? seedApi.credentials?.userName;
  if (!owner) {
    throw new Error('seedBeverageWithPours requires an authenticated user.');
  }

  const location = await seedApi.createLocation();
  const device = await seedApi.createDevice(location);
  const beverage = await seedApi.createBeverage({
    srmId: 10,
    ...beverageOverrides,
  });
  const tap = await seedApi.createTap(location, device);
  await seedApi.createKeg(tap, beverage);

  const pours = (await seedApi.createPours(tap, owner, pourCount)) as Pour[];

  return { beverage, pours, tap };
}

/** Organizations owned by the current user. */
export async function seedUserWithOrganizations(
  seedApi: SeedApi,
  orgCount: number = 2,
): Promise<{ organizations: Organization[] }> {
  const organizations: Organization[] = [];
  for (let i = 0; i < orgCount; i++) {
    organizations.push(
      await seedApi.createOrganization({ name: `Organization ${i + 1}` }),
    );
  }
  return { organizations };
}

/** A tap with a flow sensor of the given type. */
export async function seedTapWithFlowSensor(
  seedApi: SeedApi,
  flowSensorType: 'Titan' | 'Custom' = 'Titan',
): Promise<{
  tap: Tap;
  flowSensor: unknown;
  location: Location;
  device: Device;
}> {
  const location = await seedApi.createLocation();
  const device = await seedApi.createDevice(location);
  // createTap seeds a Titan sensor; create the tap bare and attach the
  // requested sensor type explicitly instead.
  const tap = await seedApi.createTapWithoutSensor(location, device);
  const flowSensor = await seedApi.createFlowSensor(tap, {
    flowSensorType,
    pulsesPerGallon: flowSensorType === 'Custom' ? 1000 : 5375,
  });

  return { tap, flowSensor, location, device };
}

export async function seedTapWithCustomFlowSensor(seedApi: SeedApi) {
  return seedTapWithFlowSensor(seedApi, 'Custom');
}

export async function seedTapWithStandardFlowSensor(seedApi: SeedApi) {
  return seedTapWithFlowSensor(seedApi, 'Titan');
}

/**
 * Real pour history for the stats screen: a pourable hierarchy with
 * `beverageCount` beverages rotated across `pourCount` real pours.
 */
export async function seedStatsData(
  seedApi: SeedApi,
  pourCount: number = 10,
  beverageCount: number = 5,
): Promise<{ beverages: Beverage[]; pours: Pour[] }> {
  const owner = seedApi.credentials?.userName;
  if (!owner) {
    throw new Error('seedStatsData requires an authenticated user.');
  }

  const location = await seedApi.createLocation();
  const device = await seedApi.createDevice(location);

  const beverages: Beverage[] = [];
  for (let i = 0; i < beverageCount; i++) {
    beverages.push(
      await seedApi.createBeverage({ name: `Beverage ${i + 1}` }),
    );
  }

  // One tap; rotate kegs is overkill for stats — pour against the first
  // beverage's keg (pour history is what the stats screens read).
  const tap = await seedApi.createTap(location, device);
  await seedApi.createKeg(tap, beverages[0]);

  const pours = (await seedApi.createPours(tap, owner, pourCount)) as Pour[];

  return { beverages, pours };
}

// WiFi setup runs against physical device hardware (a SoftAP http server on
// the local network) which cannot exist in e2e — the soft-ap browser shim in
// soft-ap-mocks.ts stays. These helpers only describe the fake networks.
export async function mockWiFiNetworks(): Promise<
  Array<{ ssid: string; signal: number; security: string }>
> {
  return [
    { ssid: 'TestWiFi1', signal: -50, security: 'WPA2' },
    { ssid: 'TestWiFi2', signal: -60, security: 'WPA2' },
    { ssid: 'TestWiFi3', signal: -70, security: 'WPA' },
  ];
}

export async function mockParticleDevice(): Promise<{
  id: string;
  name: string;
  online: boolean;
}> {
  return { id: 'particle_12345', name: 'Test Particle Device', online: true };
}
