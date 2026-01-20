import { Page } from '@playwright/test';
import type {
  Account,
  Location,
  Tap,
  Beverage,
  Keg,
  Device,
  Organization,
  AuthResponse,
  Pour,
  FlowSensor,
} from '@brewskey/js-api';
import {
  createMockUser,
  createMockLocation,
  createMockTap,
  createMockBeverage,
  createMockKeg,
  createMockDevice,
  createMockOrganization,
  createMockPour,
  createMockFlowSensor,
} from './test-data';
import { mockStore } from './api-mocks';

/**
 * Sets up an authenticated user session
 * Note: setupAPIMocks is handled by the auto fixture, so it's not called here
 */
export async function mockAuthenticatedUser(
  page: Page,
  overrides?: Partial<Account>,
): Promise<{ user: Account; authResponse: AuthResponse }> {
  const user = createMockUser(overrides);
  mockStore.setUser(user);

  const authResponse: AuthResponse = {
    accessToken: `mock_token_${user.id}`,
    refreshToken: `mock_refresh_${user.id}`,
    id: user.id,
    email: user.email || '',
    userName: user.userName,
    phoneNumber: user.phoneNumber || '',
    expiresIn: 3600,
    expiresAt: new Date(Date.now() + 3600000),
    issuedAt: new Date(),
    tokenType: 'Bearer',
    roles: [],
    userLogins: [],
  };

  mockStore.setAuthToken(authResponse.accessToken, authResponse);

  // Set auth state in localStorage/sessionStorage
  await page.addInitScript((authData) => {
    localStorage.setItem('session_data', JSON.stringify(authData));
  }, authResponse);

  return { user, authResponse };
}

/**
 * Sets up a location with associated taps
 * Note: setupAPIMocks is handled by the auto fixture, so it's not called here
 * Hierarchy: Organization => Location => Devices => Taps => Kegs
 */
export async function mockLocationWithTaps(
  page: Page,
  tapCount: number = 3,
): Promise<{ location: Location; taps: Tap[]; devices: Device[] }> {
  const location = createMockLocation();
  mockStore.setLocation(location);

  // Create a device for this location (required for taps)
  const device = createMockDevice({
    location: { id: location.id, name: location.name, isDeleted: false },
  });
  mockStore.setDevice(device);

  const taps: Tap[] = [];
  const devices: Device[] = [device];
  for (let i = 0; i < tapCount; i++) {
    const tap = createMockTap({
      locationId: location.id,
      deviceId: device.id,
      description: `Tap ${i + 1}`,
    });
    mockStore.setTap(tap);
    taps.push(tap);
  }

  return { location, taps, devices };
}

/**
 * Sets up a tap with an active keg
 * Note: setupAPIMocks is handled by the auto fixture, so it's not called here
 * Hierarchy: Organization => Location => Devices => Taps => Kegs
 */
export async function mockTapWithKeg(
  page: Page,
): Promise<{ tap: Tap; keg: Keg; beverage: Beverage; organization: Organization; location: Location; device: Device }> {
  const organization = createMockOrganization();
  mockStore.setOrganization(organization);

  const location = createMockLocation();
  mockStore.setLocation(location);

  const device = createMockDevice({
    location: { id: location.id, name: location.name, isDeleted: false },
    organization: { id: organization.id, name: organization.name, isDeleted: false },
  });
  mockStore.setDevice(device);

  const beverage = createMockBeverage();
  mockStore.setBeverage(beverage);

  const tap = createMockTap({
    locationId: location.id,
    deviceId: device.id,
    organization: { id: organization.id, name: organization.name, isDeleted: false },
    isPaymentEnabled: false, // Ensure this field exists
  });
  mockStore.setTap(tap);

  const keg = createMockKeg({
    tapId: tap.id,
    beverage: { id: beverage.id, name: beverage.name, isDeleted: false },
    ouncesTotal: 1984, // Half barrel
    ouncesRemaining: 1500,
  });
  mockStore.setKeg(keg);

  // Set currentKeg on the tap - this is required for TapDetailsScreen
  // Ensure beverage.id is a string as required by CurrentKeg type
  const updatedTap = {
    ...tap,
    currentKeg: {
      id: String(keg.id),
      beverage: {
        id: String(keg.beverage!.id),
        name: keg.beverage!.name,
      },
      kegType: keg.kegType,
      maxOunces: keg.maxOunces ?? 1984,
      ounces: keg.ounces ?? 1500,
    },
  };
  mockStore.setTap(updatedTap);

  return { tap: updatedTap, keg, beverage, organization, location, device };
}

/**
 * Sets up empty state for new users
 * Note: setupAPIMocks is handled by the auto fixture, so it's not called here
 */
export async function mockEmptyState(page: Page): Promise<void> {
  // Store is already empty, mocks are set up by auto fixture
}

/**
 * Sets up new user state with no entities (for NUX flow)
 * Note: setupAPIMocks is handled by the auto fixture, so it's not called here
 */
export async function mockNewUserState(
  page: Page,
  user?: Partial<Account>,
): Promise<{ user: Account; authResponse: AuthResponse }> {
  const newUser = createMockUser(user);
  mockStore.setUser(newUser);

  const authResponse: AuthResponse = {
    accessToken: `mock_token_${newUser.id}`,
    refreshToken: `mock_refresh_${newUser.id}`,
    id: newUser.id,
    email: newUser.email || '',
    userName: newUser.userName,
    phoneNumber: newUser.phoneNumber || '',
    expiresIn: 3600,
    expiresAt: new Date(Date.now() + 3600000),
    issuedAt: new Date(),
    tokenType: 'Bearer',
    roles: [],
    userLogins: [],
  };

  mockStore.setAuthToken(authResponse.accessToken, authResponse);

  await page.addInitScript((authData) => {
    localStorage.setItem('session_data', JSON.stringify(authData));
  }, authResponse);

  return { user: newUser, authResponse };
}

/**
 * Sets up a device with associated taps
 * Note: setupAPIMocks is handled by the auto fixture, so it's not called here
 * Hierarchy: Organization => Location => Devices => Taps => Kegs
 */
export async function mockDeviceWithTaps(
  page: Page,
  tapCount: number = 2,
): Promise<{ device: Device; taps: Tap[]; location: Location }> {
  // Create location first (required for device)
  const location = createMockLocation();
  mockStore.setLocation(location);

  // Create device with location
  const device = createMockDevice({
    location: { id: location.id, name: location.name, isDeleted: false },
  });
  mockStore.setDevice(device);

  const taps: Tap[] = [];
  for (let i = 0; i < tapCount; i++) {
    const tap = createMockTap({
      locationId: location.id,
      deviceId: device.id,
      tapNumber: i + 1,
      description: `Tap ${i + 1}`,
    });
    mockStore.setTap(tap);
    taps.push(tap);
  }

  return { device, taps, location };
}

/**
 * Sets up a beverage with pour history
 * Note: setupAPIMocks is handled by the auto fixture, so it's not called here
 */
export async function mockBeverageWithPours(
  page: Page,
  pourCount: number = 5,
  userID?: EntityID,
  userName?: string,
): Promise<{ beverage: Beverage; pours: any[] }> {
  // Get the authenticated user from mockStore if userID not provided
  let finalUserID = userID;
  let finalUserName = userName;
  
  if (!finalUserID) {
    const users = mockStore.getUsers();
    if (users.length > 0) {
      finalUserID = users[0].id;
      finalUserName = users[0].userName;
    }
  }
  
  const beverage = createMockBeverage({
    ...(finalUserID && finalUserName ? { 
      createdBy: { 
        id: finalUserID, 
        userName: finalUserName 
      } 
    } : {}),
  });
  mockStore.setBeverage(beverage);

  const pours: Pour[] = [];
  for (let i = 0; i < pourCount; i++) {
    const pour = createMockPour({
      beverage: { id: beverage.id, name: beverage.name, isDeleted: false },
      ounces: 16,
      pourDate: new Date(Date.now() - i * 86400000).toISOString(), // Days ago
    });
    mockStore.setPour(pour);
    pours.push(pour);
  }

  return { beverage, pours };
}

/**
 * Sets up a user with multiple organizations
 * Note: setupAPIMocks is handled by the auto fixture, so it's not called here
 */
export async function mockUserWithOrganizations(
  page: Page,
  orgCount: number = 2,
): Promise<{ user: Account; organizations: Organization[] }> {
  const user = createMockUser();
  mockStore.setUser(user);

  const organizations: Organization[] = [];
  for (let i = 0; i < orgCount; i++) {
    const org = createMockOrganization({
      name: `Organization ${i + 1}`,
    });
    mockStore.setOrganization(org);
    organizations.push(org);
  }

  return { user, organizations };
}

/**
 * Sets up a tap with a flow sensor
 * Note: setupAPIMocks is handled by the auto fixture, so it's not called here
 */
export async function mockTapWithFlowSensor(
  page: Page,
): Promise<{ tap: Tap; flowSensor: FlowSensor; organization: Organization; location: Location; device: Device }> {
  const organization = createMockOrganization();
  mockStore.setOrganization(organization);

  const location = createMockLocation();
  mockStore.setLocation(location);

  const device = createMockDevice({
    location: { id: location.id, name: location.name, isDeleted: false },
    organization: { id: organization.id, name: organization.name, isDeleted: false },
  });
  mockStore.setDevice(device);

  const tap = createMockTap({
    locationId: location.id,
    deviceId: device.id,
    organization: { id: organization.id, name: organization.name, isDeleted: false },
  });
  mockStore.setTap(tap);

  const flowSensor = createMockFlowSensor({
    tap: { id: tap.id, isDeleted: false },
  });
  mockStore.setFlowSensor(flowSensor);

  return { tap, flowSensor, organization, location, device };
}

/**
 * Sets up available WiFi networks for device setup
 * Note: setupAPIMocks is handled by the auto fixture, so it's not called here
 */
export async function mockWiFiNetworks(
  page: Page,
): Promise<Array<{ ssid: string; signal: number; security: string }>> {
  const networks = [
    { ssid: 'TestWiFi1', signal: -50, security: 'WPA2' },
    { ssid: 'TestWiFi2', signal: -60, security: 'WPA2' },
    { ssid: 'TestWiFi3', signal: -70, security: 'WPA' },
  ];
  return networks;
}

/**
 * Sets up a Particle device for WiFi setup
 */
export async function mockParticleDevice(
  page: Page,
): Promise<{ id: string; name: string; online: boolean }> {
  const device = {
    id: 'particle_12345',
    name: 'Test Particle Device',
    online: true,
  };
  return device;
}

/**
 * Sets up stats data (badges, beverages, pours) for stats screen
 * Ensures stats sections are always visible with data
 */
export async function setupStatsData(
  page: Page,
  pourCount: number = 10,
  beverageCount: number = 5,
): Promise<{ beverages: Beverage[]; pours: Pour[] }> {
  const beverages: Beverage[] = [];
  const pours: Pour[] = [];

  // Create beverages
  for (let i = 0; i < beverageCount; i++) {
    const beverage = createMockBeverage({ name: `Beverage ${i + 1}` });
    mockStore.setBeverage(beverage);
    beverages.push(beverage);
  }

  // Create pours for stats (recent pours list)
  for (let i = 0; i < pourCount; i++) {
    const beverage = beverages[i % beverageCount];
    const pour = createMockPour({
      beverage: { id: beverage.id, name: beverage.name, isDeleted: false },
      ounces: 16,
      pourDate: new Date(Date.now() - i * 3600000).toISOString(), // Hours ago
    });
    mockStore.setPour(pour);
    pours.push(pour);
  }

  return { beverages, pours };
}
