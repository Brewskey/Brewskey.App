import { faker } from '@faker-js/faker';
import type {
  EntityID,
  Account,
  Location,
  Tap,
  Beverage,
  Keg,
  Device,
  Pour,
  Friend,
  Permission,
  FlowSensor,
  Organization,
  Achievement,
  ShortenedEntity,
  ShortenedTap,
  KegType,
  DeviceStatus,
  PermissionType,
  FriendStatus,
  AchievementType,
} from '@brewskey/js-api';
import type { Srm } from '@brewskey/js-api/dist/dao/SrmDAO';

let idCounter = 1;

function generateId(): EntityID {
  return idCounter++;
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
  const base: Partial<Location> = {
    id,
    name: `Test Location ${id}`,
    city: 'Test City',
    state: 'TS',
    zipCode: 12345,
    description: null,
  };
  return { ...base, ...overrides } as Location;
}

type TapOverrides = Partial<Tap> & {
  locationId?: EntityID;
  deviceId?: EntityID;
  tapNumber?: number;
  description?: string;
};

export function createMockTap(overrides?: TapOverrides): Tap {
  const id = generateId();
  const { locationId, deviceId, tapNumber, description, ...restOverrides } = overrides || {};
  
  // Ensure both deviceId and locationId are present (required hierarchy: Organization => Location => Devices => Taps => Kegs)
  // If deviceId is provided but no locationId, generate a locationId
  // If locationId is provided but no deviceId, generate a deviceId
  // If neither is provided, generate both
  const finalLocationId = locationId ?? (restOverrides.location?.id ?? generateId());
  const finalDeviceId = deviceId ?? (restOverrides.device?.id ?? generateId());
  
  // Convert locationId to ShortenedEntity
  const location: ShortenedEntity = restOverrides.location ?? {
    id: finalLocationId,
    name: faker.company.name(),
    isDeleted: false,
  };
  
  // Convert deviceId to ShortenedEntity
  const device: ShortenedEntity = restOverrides.device ?? {
    id: finalDeviceId,
    name: faker.commerce.productName(),
    isDeleted: false,
  };
  
  const base: Partial<Tap> = {
    id,
    location,
    device,
    hideStats: false,
    hideLeaderboard: false,
    tapNumber: tapNumber ?? faker.number.int({ min: 1, max: 20 }),
    description: description ?? faker.lorem.sentence(),
  };
  
  return { ...base, ...restOverrides } as Tap;
}

export function createMockBeverage(overrides?: Partial<Beverage>): Beverage {
  const id = generateId();
  const base: Partial<Beverage> = {
    id,
    name: faker.commerce.productName(),
    description: faker.lorem.paragraph(),
    abv: faker.number.float({ min: 3, max: 12, fractionDigits: 1 }),
    ibu: faker.number.int({ min: 10, max: 100 }),
  };
  return { ...base, ...overrides } as Beverage;
}

type KegOverrides = Partial<Keg> & {
  tapId?: EntityID;
  beverageId?: EntityID;
  ouncesTotal?: number;
  ouncesRemaining?: number;
};

export function createMockKeg(overrides?: KegOverrides): Keg {
  const id = generateId();
  const { tapId, beverageId, ouncesTotal, ouncesRemaining, ...restOverrides } = overrides || {};
  
  // Convert tapId to ShortenedTap if provided
  const tap: ShortenedTap | undefined = tapId 
    ? { id: tapId, isDeleted: false }
    : (restOverrides.tap ?? undefined);
  
  // Convert beverageId to ShortenedEntity if provided
  const beverage: ShortenedEntity | undefined = beverageId 
    ? { id: beverageId, name: faker.commerce.productName(), isDeleted: false }
    : (restOverrides.beverage ?? undefined);
  
  // Map ouncesTotal to maxOunces and ouncesRemaining to ounces
  const mappedOverrides: any = { ...restOverrides };
  if (ouncesTotal !== undefined) {
    mappedOverrides.maxOunces = ouncesTotal;
  }
  if (ouncesRemaining !== undefined) {
    mappedOverrides.ounces = ouncesRemaining;
  }
  
  const base: Partial<Keg> = {
    id,
    tap,
    beverage,
    kegType: 'HalfBarrel' as KegType,
    // Ensure tapId is set as flat property for filtering (filter checks both tap.id and tapId)
    tapId: tap?.id,
  };
  
  return { ...base, ...mappedOverrides } as Keg;
}

export function createMockDevice(overrides?: Partial<Device>): Device {
  const id = generateId();
  const base: Partial<Device> = {
    id,
    name: `Device ${id}`,
    particleId: `particle_${id}`,
    location: undefined,
    deviceStatus: 'Online' as DeviceStatus,
  };
  return { ...base, ...overrides } as Device;
}

export function createMockPour(overrides?: Partial<Pour>): Pour {
  const id = generateId();
  const base: Partial<Pour> = {
    id,
    ounces: faker.number.float({ min: 4, max: 32, fractionDigits: 2 }),
    pourDate: faker.date.recent().toISOString(),
  };
  return { ...base, ...overrides } as Pour;
}

export function createMockFriend(overrides?: Partial<Friend>): Friend {
  const id = generateId();
  const base: Partial<Friend> = {
    id,
    friendAccount: undefined,
    owningAccount: undefined,
    friendStatus: 'Pending' as FriendStatus,
  };
  return { ...base, ...overrides } as Friend;
}

export function createMockPermission(overrides?: Partial<Permission>): Permission {
  const id = generateId();
  const base: Partial<Permission> = {
    id,
    permissionType: 'Read' as PermissionType,
  };
  return { ...base, ...overrides } as Permission;
}

export function createMockFlowSensor(overrides?: Partial<FlowSensor>): FlowSensor {
  const id = generateId();
  const base: Partial<FlowSensor> = {
    id,
    tap: undefined,
  };
  return { ...base, ...overrides } as FlowSensor;
}

export function createMockOrganization(overrides?: Partial<Organization>): Organization {
  const id = generateId();
  const base: Partial<Organization> = {
    id,
    name: faker.company.name(),
  };
  return { ...base, ...overrides } as Organization;
}

export function createMockSrm(overrides?: Partial<Srm>): Srm {
  const id = generateId();
  const srmNumber = overrides?.name ? parseInt(overrides.name, 10) : id;
  // Generate a hex color code (format: #RRGGBB)
  const hexColor = overrides?.hex ?? `#${Math.floor(Math.random() * 16777215).toString(16).padStart(6, '0')}`;
  const base: Partial<Srm> = {
    id,
    name: srmNumber.toString(),
    hex: hexColor,
  };
  return { ...base, ...overrides } as Srm;
}

export function createMockAchievement(overrides?: Partial<Achievement>): Achievement {
  const id = generateId();
  const base: Partial<Achievement> = {
    id,
    achievementType: 'FirstPour' as AchievementType,
  };
  return { ...base, ...overrides } as Achievement;
}

export function createMockWiFiNetwork(overrides?: Partial<{ ssid: string; signal: number; security: string }>) {
  return {
    ssid: `WiFi_Network_${generateId()}`,
    signal: -50,
    security: 'WPA2',
    ...overrides,
  };
}

export function createMockParticleDevice(overrides?: Partial<{ id: string; name: string; online: boolean }>) {
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
