import { faker } from '@faker-js/faker';

import type {
  Account,
  Achievement,
  Beverage,
  Device,
  EntityID,
  FlowSensor,
  Friend,
  Keg,
  Location,
  Organization,
  Permission,
  Pour,
  ShortenedEntity,
  ShortenedTap,
  Tap,
} from '@brewskey/js-api';
import type { Srm } from '@brewskey/js-api/dist/dao/SrmDAO';

let idCounter = 1;

function generateId(): EntityID {
  return idCounter++;
}

/** Build a ShortenedEntity (id, isDeleted, name) for use in mocks. */
export function createShortenedEntity(
  id: EntityID,
  name: string,
  isDeleted = false,
): ShortenedEntity {
  return { id, name, isDeleted };
}

export function createMockUser(overrides?: Partial<Account>): Account {
  const id = generateId();
  return {
    id,
    userName: faker.internet.username(),
    email: faker.internet.email(),
    emailConfirmed: true,
    fullName: faker.person.fullName(),
    phoneNumber: faker.phone.number(),
    phoneNumberConfirmed: false,
    accessFailedCount: 0,
    banned: false,
    lockoutEnabled: false,
    lockoutEndDateUtc: null,
    logins: null,
    roles: null,
    twoFactorEnabled: false,
    createdDate: faker.date.past(),
    ...overrides,
  };
}

export function createMockLocation(overrides?: Partial<Location>): Location {
  const id = generateId();
  const base: Location = {
    id,
    name: `Test Location ${id}`,
    city: 'Test City',
    state: 'TS',
    zipCode: 12345,
    description: null,
    createdDate: faker.date.past(),
    isDeleted: false,
    locationType: 'Bar',
    organization: createShortenedEntity(1, 'Test Organization'),
    squareLocationID: '',
    street: '',
    suite: '',
    timeZone: 'UTC',
  };
  return { ...base, ...overrides } satisfies Location;
}

type TapOverrides = Partial<Tap> & {
  locationId?: EntityID;
  deviceId?: EntityID;
  tapNumber?: number;
  description?: string;
};

export function createMockTap(overrides?: TapOverrides): Tap {
  const id = generateId();
  const { locationId, deviceId, tapNumber, description, ...restOverrides } =
    overrides || {};

  // Ensure both deviceId and locationId are present (required hierarchy: Organization => Location => Devices => Taps => Kegs)
  // If deviceId is provided but no locationId, generate a locationId
  // If locationId is provided but no deviceId, generate a deviceId
  // If neither is provided, generate both
  const finalLocationId =
    locationId ?? restOverrides.location?.id ?? generateId();
  const finalDeviceId = deviceId ?? restOverrides.device?.id ?? generateId();

  // Convert locationId to ShortenedEntity
  const location: ShortenedEntity =
    restOverrides.location ??
    createShortenedEntity(finalLocationId, faker.company.name());

  // Convert deviceId to ShortenedEntity
  const device: ShortenedEntity =
    restOverrides.device ??
    createShortenedEntity(finalDeviceId, faker.commerce.productName());

  const defaultCurrentKeg: Tap['currentKeg'] = {
    id: '0',
    beverage: { id: '0', name: '' },
    kegType: 'HalfBarrel',
    maxOunces: 1984,
    ounces: 0,
  };
  const base: Tap = {
    id,
    location,
    device,
    hideStats: false,
    hideLeaderboard: false,
    tapNumber: tapNumber ?? faker.number.int({ min: 1, max: 20 }),
    description: description ?? faker.lorem.sentence(),
    createdDate: faker.date.past(),
    currentKeg: defaultCurrentKeg,
    disableBadges: false,
    isPaymentEnabled: false,
    organization:
      restOverrides.organization ??
      createShortenedEntity(1, 'Test Organization'),
    requiresPourPrivilege: false,
  };

  return { ...base, ...restOverrides } satisfies Tap;
}

export function createMockBeverage(overrides?: Partial<Beverage>): Beverage {
  const id = generateId();
  const now = faker.date.recent();
  const base: Beverage = {
    id,
    name: faker.commerce.productName(),
    description: faker.lorem.paragraph(),
    abv: faker.number.float({ min: 3, max: 12, fractionDigits: 1 }),
    ibu: faker.number.int({ min: 10, max: 100 }),
    beverageType: 'Beer',
    createDate: now,
    createdBy: { id: 1, userName: 'testuser' },
    isDeleted: false,
    isOrganic: false,
    labels: { icon: '', large: '', medium: '' },
    updateDate: now,
    availability: undefined,
    beerVariationId: undefined,
    externalId: undefined,
    foodPairings: undefined,
    glass: undefined,
    originalGravity: undefined,
    servingTemperature: undefined,
    servingTemperatureDisplay: undefined,
    srm: undefined,
    style: undefined,
    year: undefined,
  };
  return { ...base, ...overrides } satisfies Beverage;
}

type KegOverrides = Partial<Keg> & {
  tapId?: EntityID;
  beverageId?: EntityID;
  ouncesTotal?: number;
  ouncesRemaining?: number;
};

export function createMockKeg(overrides?: KegOverrides): Keg {
  const id = generateId();
  const { tapId, beverageId, ouncesTotal, ouncesRemaining, ...restOverrides } =
    overrides || {};

  // Convert tapId to ShortenedTap if provided
  const tap: ShortenedTap | undefined = tapId
    ? { id: tapId, isDeleted: false }
    : (restOverrides.tap ?? undefined);

  // Convert beverageId to ShortenedEntity if provided
  const beverage: ShortenedEntity = beverageId
    ? createShortenedEntity(beverageId, faker.commerce.productName())
    : (restOverrides.beverage ??
      createShortenedEntity(generateId(), faker.commerce.productName()));

  // Map ouncesTotal to maxOunces and ouncesRemaining to ounces
  const mappedOverrides: Record<string, unknown> = { ...restOverrides };
  if (ouncesTotal !== undefined) {
    mappedOverrides.maxOunces = ouncesTotal;
  }
  if (ouncesRemaining !== undefined) {
    mappedOverrides.ounces = ouncesRemaining;
  }

  const now = faker.date.recent();
  const base: Keg = {
    id,
    tap,
    beverage,
    kegType: 'HalfBarrel',
    floatedDate: now,
    isDeleted: false,
    location: undefined,
    maxOunces: ouncesTotal ?? 1984,
    organization: createShortenedEntity(1, 'Test Organization'),
    ounces: ouncesRemaining ?? 0,
    pulses: 0,
    tapDate: now,
  };

  return { ...base, ...mappedOverrides } satisfies Keg;
}

/** Default org id for mock devices when organization is not provided */
const DEFAULT_DEVICE_ORG_ID = 1;

export function createMockDevice(overrides?: Partial<Device>): Device {
  const id = generateId();
  const now = faker.date.recent();
  const base: Device = {
    id,
    name: `Device ${id}`,
    particleId: `particle_${id}`,
    location: undefined,
    deviceStatus: 'Active',
    deviceType: 'BrewskeyBox',
    isDeleted: false,
    isScreenDisabled: false,
    isTotpDisabled: false,
    lastEdited: now,
    lastEditedBy: { id: 1, userName: 'testuser' },
    ledBrightness: 100,
    nfcStatus: 'PhoneAndCard',
    organization: createShortenedEntity(
      DEFAULT_DEVICE_ORG_ID,
      'Test Organization',
    ),
    secondsToStayOpen: 5,
    shouldInvertScreen: false,
    temperature: 38,
    timeForValveOpen: 2,
    createdBy: { id: 1, userName: 'testuser' },
  };
  return { ...base, ...overrides } satisfies Device;
}

export function createMockPour(overrides?: Partial<Pour>): Pour {
  const id = generateId();
  const base: Pour = {
    id,
    ounces: faker.number.float({ min: 4, max: 32, fractionDigits: 2 }),
    pourDate: faker.date.recent().toISOString(),
    total: 0,
    beverage: undefined,
    device: undefined,
    isDeleted: false,
    keg: { id: 1 },
    location: undefined,
    organization: createShortenedEntity(1, 'Test Organization'),
    owner: { id: 1, userName: 'testuser' },
    pulses: 0,
    tap: undefined,
  };
  return { ...base, ...overrides } satisfies Pour;
}

export function createMockFriend(overrides?: Partial<Friend>): Friend {
  const id = generateId();
  const base: Friend = {
    id,
    friendAccount: { id: 0, userName: '' },
    owningAccount: { id: 0, userName: '' },
    friendStatus: 'Pending',
    createdDate: faker.date.past(),
  };
  return { ...base, ...overrides } satisfies Friend;
}

export function createMockPermission(
  overrides?: Partial<Permission>,
): Permission {
  const id = generateId();
  const base: Permission = {
    id,
    permissionType: 'Read',
    createdBy: { id: 1, userName: 'testuser' },
    createdDate: faker.date.past(),
    device: undefined,
    expiresDate: undefined,
    forUser: { id: 1, userName: 'testuser' },
    invalid: false,
    isDeleted: false,
    location: undefined,
    organization: undefined,
    startDate: undefined,
    tap: undefined,
  };
  return { ...base, ...overrides } satisfies Permission;
}

export function createMockFlowSensor(
  overrides?: Partial<FlowSensor>,
): FlowSensor {
  const id = generateId();
  const base: FlowSensor = {
    id,
    tap: { id: 1, isDeleted: false },
    flowSensorType: 'Titan',
    isDeleted: false,
    pulsesPerGallon: 5375,
  };
  return { ...base, ...overrides } satisfies FlowSensor;
}

export function createMockOrganization(
  overrides?: Partial<Organization>,
): Organization {
  const id = generateId();
  const base: Organization = {
    id,
    name: faker.company.name(),
    canEnablePayments: false,
    createdDate: faker.date.past(),
    isDeleted: false,
  };
  return { ...base, ...overrides } satisfies Organization;
}

export function createMockSrm(overrides?: Partial<Srm>): Srm {
  const id = generateId();
  const srmNumber = overrides?.name ? parseInt(overrides.name, 10) : id;
  // Generate a hex color code (format: #RRGGBB)
  const hexColor =
    overrides?.hex ??
    `#${Math.floor(Math.random() * 16777215)
      .toString(16)
      .padStart(6, '0')}`;
  const base: Srm = {
    id,
    name: srmNumber.toString(),
    hex: hexColor,
  };
  return { ...base, ...overrides } satisfies Srm;
}

export function createMockAchievement(
  overrides?: Partial<Achievement>,
): Achievement {
  const id = generateId();
  const base: Achievement = {
    id,
    achievementType: 'FirstPourOfTheDay',
    createdDate: faker.date.past(),
  };
  return { ...base, ...overrides } satisfies Achievement;
}

export function createMockWiFiNetwork(
  overrides?: Partial<{ ssid: string; signal: number; security: string }>,
) {
  return {
    ssid: `WiFi_Network_${generateId()}`,
    signal: -50,
    security: 'WPA2',
    ...overrides,
  };
}

export function createMockParticleDevice(
  overrides?: Partial<{ id: string; name: string; online: boolean }>,
) {
  return {
    id: faker.string.alphanumeric({ length: 24 }),
    name: faker.commerce.productName(),
    online: faker.datatype.boolean(),
    ...overrides,
  };
}

// Reset ID counter for consistent test data
export function resetIdCounter(): void {
  idCounter = 1;
}
