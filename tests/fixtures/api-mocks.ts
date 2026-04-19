import { Page, Route } from '@playwright/test';

import {
  createMockBeverage,
  createMockDevice,
  createMockFlowSensor,
  createMockFriend,
  createMockKeg,
  createMockLocation,
  createMockOrganization,
  createMockPermission,
  createMockPour,
  createMockTap,
  createMockUser,
} from './test-data';

import type {
  Account,
  AuthResponse,
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
  Tap,
} from '@brewskey/js-api';
import type { Srm } from '@brewskey/js-api/dist/dao/SrmDAO';

// In-memory data store
class MockDataStore {
  private users = new Map<EntityID, Account>();

  private locations = new Map<EntityID, Location>();

  private taps = new Map<EntityID, Tap>();

  private beverages = new Map<EntityID, Beverage>();

  private kegs = new Map<EntityID, Keg>();

  private devices = new Map<EntityID, Device>();

  private pours = new Map<EntityID, Pour>();

  private friends = new Map<EntityID, Friend>();

  private permissions = new Map<EntityID, Permission>();

  private flowSensors = new Map<EntityID, FlowSensor>();

  private organizations = new Map<EntityID, Organization>();

  private srms = new Map<EntityID, Srm>();

  private authTokens = new Map<string, AuthResponse>();

  private refreshTokens = new Map<string, AuthResponse>();

  clear(): void {
    this.users.clear();
    this.locations.clear();
    this.taps.clear();
    this.beverages.clear();
    this.kegs.clear();
    this.devices.clear();
    this.pours.clear();
    this.friends.clear();
    this.permissions.clear();
    this.flowSensors.clear();
    this.organizations.clear();
    this.srms.clear();
    this.authTokens.clear();
    this.refreshTokens.clear();
  }

  // Getters
  getUsers(): Account[] {
    return Array.from(this.users.values());
  }

  getLocations(): Location[] {
    return Array.from(this.locations.values());
  }

  getTaps(): Tap[] {
    return Array.from(this.taps.values());
  }

  getBeverages(): Beverage[] {
    return Array.from(this.beverages.values());
  }

  getKegs(): Keg[] {
    return Array.from(this.kegs.values());
  }

  getDevices(): Device[] {
    return Array.from(this.devices.values());
  }

  getPours(): Pour[] {
    return Array.from(this.pours.values());
  }

  getFriends(): Friend[] {
    return Array.from(this.friends.values());
  }

  getPermissions(): Permission[] {
    return Array.from(this.permissions.values());
  }

  getFlowSensors(): FlowSensor[] {
    return Array.from(this.flowSensors.values());
  }

  getOrganizations(): Organization[] {
    return Array.from(this.organizations.values());
  }

  getSrms(): Srm[] {
    return Array.from(this.srms.values());
  }

  // Setters
  setUser(user: Account): void {
    this.users.set(user.id, user);
  }

  setLocation(location: Location): void {
    this.locations.set(location.id, location);
  }

  setTap(tap: Tap): void {
    this.taps.set(tap.id, tap);
  }

  setBeverage(beverage: Beverage): void {
    this.beverages.set(beverage.id, beverage);
  }

  setKeg(keg: Keg): void {
    this.kegs.set(keg.id, keg);
  }

  setDevice(device: Device): void {
    this.devices.set(device.id, device);
  }

  setPour(pour: Pour): void {
    this.pours.set(pour.id, pour);
  }

  setFriend(friend: Friend): void {
    this.friends.set(friend.id, friend);
  }

  setPermission(permission: Permission): void {
    this.permissions.set(permission.id, permission);
  }

  setFlowSensor(flowSensor: FlowSensor): void {
    this.flowSensors.set(flowSensor.id, flowSensor);
  }

  setOrganization(organization: Organization): void {
    this.organizations.set(organization.id, organization);
  }

  setSrm(srm: Srm): void {
    this.srms.set(srm.id, srm);
  }

  setAuthToken(token: string, authResponse: AuthResponse): void {
    this.authTokens.set(token, authResponse);
    // Also store by refresh token for lookup during refresh
    this.refreshTokens.set(authResponse.refreshToken, authResponse);
  }

  getAuthTokenByRefreshToken(refreshToken: string): AuthResponse | undefined {
    return this.refreshTokens.get(refreshToken);
  }

  // Get by ID
  getUser(id: EntityID): Account | undefined {
    return this.users.get(id);
  }

  getLocation(id: EntityID): Location | undefined {
    return this.locations.get(id);
  }

  getTap(id: EntityID): Tap | undefined {
    return this.taps.get(id);
  }

  getBeverage(id: EntityID): Beverage | undefined {
    return this.beverages.get(id);
  }

  getKeg(id: EntityID): Keg | undefined {
    return this.kegs.get(id);
  }

  getDevice(id: EntityID): Device | undefined {
    return this.devices.get(id);
  }

  getPour(id: EntityID): Pour | undefined {
    return this.pours.get(id);
  }

  getFriend(id: EntityID): Friend | undefined {
    return this.friends.get(id);
  }

  getPermission(id: EntityID): Permission | undefined {
    return this.permissions.get(id);
  }

  getFlowSensor(id: EntityID): FlowSensor | undefined {
    return this.flowSensors.get(id);
  }

  getOrganization(id: EntityID): Organization | undefined {
    return this.organizations.get(id);
  }

  getSrm(id: EntityID): Srm | undefined {
    return this.srms.get(id);
  }

  getAuthToken(token: string): AuthResponse | undefined {
    return this.authTokens.get(token);
  }
}

export const mockStore = new MockDataStore();

// Parse OData query string
function parseODataQuery(url: string): {
  entity: string;
  id?: EntityID;
  skip?: number;
  take?: number;
  filter?: string;
  orderBy?: string;
} {
  const urlObj = new URL(url);

  // Check for OData format: /api/v2/entity(id) or /api/v2/entity/id
  // Handle URLs like: /api/v2/taps(4)/?$format=json&$expand=...
  const idMatch = /\/api\/v2\/([^/(?]+)(?:\((\d+)\)|\/(\d+))(?:\/|\?|$)/.exec(
    url,
  );
  let entity = '';
  let id: EntityID | undefined;

  if (idMatch) {
    // Format: /api/v2/taps(1) or /api/v2/taps/1 or /api/v2/taps(1)/?query
    entity = idMatch[1];
    id =
      idMatch[2] || idMatch[3]
        ? parseInt(idMatch[2] || idMatch[3]!, 10)
        : undefined;
  } else {
    // Format: /api/v2/taps (list endpoint)
    const pathParts = urlObj.pathname.split('/');
    const entityIndex = pathParts.indexOf('api');
    if (entityIndex >= 0 && entityIndex + 2 < pathParts.length) {
      entity = pathParts[entityIndex + 2] || '';
    }
  }

  const skip = urlObj.searchParams.get('$skip')
    ? parseInt(urlObj.searchParams.get('$skip')!, 10)
    : undefined;
  const take = urlObj.searchParams.get('$take')
    ? parseInt(urlObj.searchParams.get('$take')!, 10)
    : undefined;
  const filter = urlObj.searchParams.get('$filter') || undefined;
  const orderBy = urlObj.searchParams.get('$orderby') || undefined;

  return { entity, id, skip, take, filter, orderBy };
}

// Helper to get nested property value from an object (e.g., "tap/id" -> obj.tap.id)
function getNestedProperty(
  obj: Record<string, unknown>,
  path: string,
): unknown {
  const parts = path.split('/');
  let current: unknown = obj;
  for (const part of parts) {
    if (current && typeof current === 'object' && part in current) {
      current = (current as Record<string, unknown>)[part];
    } else {
      return undefined;
    }
  }
  return current;
}

// Filter entities based on OData filter
function filterEntities<T extends { id: EntityID }>(
  entities: T[],
  filter?: string,
): T[] {
  if (!filter) {
    return entities;
  }

  // Simple filter parsing - can be extended for complex filters
  // For now, handle common cases like eq, ne, contains
  const filters = filter.split(' and ');
  return entities.filter((entity) =>
    filters.every((f) => {
      if (f.includes(' eq ')) {
        const [field, value] = f.split(' eq ');
        const fieldName = field.trim().replace(/[()']/g, '');
        const fieldValue = value.trim().replace(/[()']/g, '');
        const entityRecord = entity as Record<string, unknown>;

        // Handle nested properties (e.g., "tap/id" -> entity.tap.id)
        // Also handle flat properties (e.g., "tapId" -> entity.tapId)
        let fieldValueToCompare: string | undefined;
        if (fieldName.includes('/')) {
          // Nested property like "tap/id" - try nested first, then camelCase fallback
          fieldValueToCompare = getNestedProperty(
            entityRecord,
            fieldName,
          )?.toString();
          if (!fieldValueToCompare) {
            // Fallback to camelCase property (e.g., "tap/id" -> "tapId")
            const camelCaseField = fieldName.replace(/\/(\w)/g, (_, letter) =>
              letter.toUpperCase(),
            );
            fieldValueToCompare = entityRecord[camelCaseField]?.toString();
          }
        } else {
          // Flat property
          fieldValueToCompare = entityRecord[fieldName]?.toString();
        }
        return fieldValueToCompare === fieldValue;
      }
      if (f.includes(' ne ')) {
        const [field, value] = f.split(' ne ');
        const fieldName = field.trim().replace(/[()']/g, '');
        const fieldValue = value.trim().replace(/[()']/g, '');
        const entityRecord = entity as Record<string, unknown>;

        // Handle nested properties (e.g., "tap/id" -> entity.tap.id)
        // Also handle flat properties (e.g., "tapId" -> entity.tapId)
        let fieldValueToCompare: string | undefined;
        if (fieldName.includes('/')) {
          // Nested property like "tap/id" - try nested first, then camelCase fallback
          fieldValueToCompare = getNestedProperty(
            entityRecord,
            fieldName,
          )?.toString();
          if (!fieldValueToCompare) {
            // Fallback to camelCase property (e.g., "tap/id" -> "tapId")
            const camelCaseField = fieldName.replace(/\/(\w)/g, (_, letter) =>
              letter.toUpperCase(),
            );
            fieldValueToCompare = entityRecord[camelCaseField]?.toString();
          }
        } else {
          // Flat property
          fieldValueToCompare = entityRecord[fieldName]?.toString();
        }
        return fieldValueToCompare !== fieldValue;
      }
      return true;
    }),
  );
}

// Normalize entity name to match EntityType
function normalizeEntityName(entityName: string): string {
  // Map common variations to EntityType values
  const entityMap: Record<string, EntityType> = {
    locations: 'locations',
    location: 'locations',
    taps: 'taps',
    tap: 'taps',
    devices: 'devices',
    device: 'devices',
    beverages: 'beverages',
    beverage: 'beverages',
    kegs: 'kegs',
    keg: 'kegs',
    accounts: 'accounts',
    account: 'accounts',
    pours: 'pours',
    pour: 'pours',
    friends: 'friends',
    friend: 'friends',
    permissions: 'permissions',
    permission: 'permissions',
    'flow-sensors': 'flow-sensors',
    'flow-sensor': 'flow-sensors',
    flowSensors: 'flow-sensors',
    organizations: 'organizations',
    organization: 'organizations',
    'beverage-srms': 'beverage-srms',
    'beverage-srm': 'beverage-srms',
    'price-variants': 'price-variants',
    'price-variant': 'price-variants',
  };

  return entityMap[entityName.toLowerCase()] || entityName.toLowerCase();
}

// Parse form-urlencoded data
function parseFormData(body: string): Record<string, string> {
  const params: Record<string, string> = {};
  const pairs = body.split('&');
  for (const pair of pairs) {
    const [key, value] = pair.split('=');
    if (key && value) {
      params[decodeURIComponent(key)] = decodeURIComponent(value);
    }
  }
  return params;
}

// Helper to create AuthResponse from user
function createAuthResponseFromUser(
  user: Account,
  accessToken?: string,
  refreshToken?: string,
): AuthResponse {
  const now = Date.now();
  return {
    accessToken: accessToken || `mock_token_${user.id}`,
    refreshToken: refreshToken || `mock_refresh_${user.id}`,
    id: user.id,
    email: user.email || '',
    userName: user.userName,
    phoneNumber: user.phoneNumber || '',
    expiresIn: 3600,
    expiresAt: new Date(now + 3600000),
    issuedAt: new Date(now),
    tokenType: 'Bearer',
    roles: [],
    userLogins: [],
  };
}

// Helper to convert AuthResponse to LoginResponse format (snake_case)
function authResponseToLoginResponse(
  authResponse: AuthResponse,
): Record<string, string> {
  return {
    email: authResponse.email,
    id: authResponse.id.toString(),
    phoneNumber: authResponse.phoneNumber,
    userName: authResponse.userName,
    access_token: authResponse.accessToken,
    '.expires': authResponse.expiresAt.toISOString(),
    expires_in: authResponse.expiresIn.toString(),
    '.issued': authResponse.issuedAt.toISOString(),
    refresh_token: authResponse.refreshToken,
    roles: JSON.stringify(authResponse.roles),
    token_type: authResponse.tokenType,
    userLogins: JSON.stringify(authResponse.userLogins),
  };
}

// Helper to fulfill JSON responses
async function fulfillJSONResponse(
  route: Route,
  status: number,
  body: Record<string, unknown> | unknown[],
): Promise<void> {
  return route.fulfill({
    status,
    contentType: 'application/json',
    body: JSON.stringify(body),
  });
}

// Helper to fulfill error responses
async function fulfillErrorResponse(
  route: Route,
  status: number,
  error: string,
  errorDescription?: string,
): Promise<void> {
  return fulfillJSONResponse(route, status, {
    error,
    ...(errorDescription && { error_description: errorDescription }),
  });
}

// Entity type mapping for store operations
type EntityType =
  | 'accounts'
  | 'locations'
  | 'taps'
  | 'beverages'
  | 'kegs'
  | 'devices'
  | 'pours'
  | 'friends'
  | 'permissions'
  | 'flow-sensors'
  | 'organizations'
  | 'beverage-srms'
  | 'price-variants';

// Helper to get entity by ID from store
function getEntityById(entityType: EntityType, id: EntityID): any {
  switch (entityType) {
    case 'accounts':
      return mockStore.getUser(id);
    case 'locations':
      return mockStore.getLocation(id);
    case 'taps':
      return mockStore.getTap(id);
    case 'beverages':
      return mockStore.getBeverage(id);
    case 'kegs':
      return mockStore.getKeg(id);
    case 'devices':
      return mockStore.getDevice(id);
    case 'pours':
      return mockStore.getPour(id);
    case 'friends':
      return mockStore.getFriend(id);
    case 'permissions':
      return mockStore.getPermission(id);
    case 'flow-sensors':
      return mockStore.getFlowSensor(id);
    case 'organizations':
      return mockStore.getOrganization(id);
    case 'price-variants':
      return undefined;
    default:
      return undefined;
  }
}

// Helper to get all entities of a type from store
function getAllEntities(entityType: EntityType): any[] {
  switch (entityType) {
    case 'accounts':
      return mockStore.getUsers();
    case 'locations':
      return mockStore.getLocations();
    case 'taps':
      return mockStore.getTaps();
    case 'beverages':
      return mockStore.getBeverages();
    case 'kegs':
      return mockStore.getKegs();
    case 'devices':
      return mockStore.getDevices();
    case 'pours':
      return mockStore.getPours();
    case 'friends':
      return mockStore.getFriends();
    case 'permissions':
      return mockStore.getPermissions();
    case 'flow-sensors':
      return mockStore.getFlowSensors();
    case 'organizations':
      return mockStore.getOrganizations();
    case 'beverage-srms':
      return mockStore.getSrms();
    default:
      return [];
  }
}

// Setup API route handlers
export function setupAPIMocks(page: Page): void {
  // Handle token endpoint (login and refresh token)
  // Match both /token/ and /token (with or without trailing slash)
  page.route(/.*\/token\/?.*/, async (route: Route) => {
    const url = route.request().url();
    const method = route.request().method();

    if (method === 'POST') {
      try {
        const body = await route.request().postData();
        if (!body) {
          await route.fulfill({
            status: 400,
            contentType: 'application/json',
            body: JSON.stringify({ error: 'Missing request body' }),
          });
          return;
        }

        const params = parseFormData(body);
        const grantType = params.grant_type;

        if (grantType === 'password') {
          // Login request
          const { userName } = params;
          const user = mockStore
            .getUsers()
            .find((u) => u.userName === userName);

          if (user) {
            const authResponse = createAuthResponseFromUser(user);
            mockStore.setAuthToken(authResponse.accessToken, authResponse);
            return fulfillJSONResponse(
              route,
              200,
              authResponseToLoginResponse(authResponse),
            );
          }

          return fulfillErrorResponse(
            route,
            400,
            'invalid_grant',
            'Invalid credentials',
          );
        }

        if (grantType === 'refresh_token') {
          // Token refresh request
          const refreshToken = params.refresh_token;
          const authResponse =
            mockStore.getAuthTokenByRefreshToken(refreshToken);

          if (authResponse) {
            // Generate new tokens
            const now = Date.now();
            const newAccessToken = `mock_token_${authResponse.id}_${now}`;
            const newRefreshToken = `mock_refresh_${authResponse.id}_${now}`;

            const newAuthResponse: AuthResponse = {
              ...authResponse,
              accessToken: newAccessToken,
              refreshToken: newRefreshToken,
              expiresAt: new Date(now + 3600000),
              issuedAt: new Date(now),
            };
            mockStore.setAuthToken(newAccessToken, newAuthResponse);
            return fulfillJSONResponse(
              route,
              200,
              authResponseToLoginResponse(newAuthResponse),
            );
          }

          return fulfillErrorResponse(
            route,
            400,
            'invalid_grant',
            'Invalid refresh token',
          );
        }

        return fulfillErrorResponse(route, 400, 'unsupported_grant_type');
      } catch (error) {
        return fulfillErrorResponse(
          route,
          500,
          error instanceof Error ? error.message : 'Internal server error',
        );
      }
    }

    // Default: method not allowed
    return fulfillErrorResponse(route, 405, 'Method not allowed');
  });

  // Handle pour authorization endpoint
  page.route('**/api/authorizations/pour/**', async (route: Route) => {
    const method = route.request().method();

    if (method === 'POST') {
      try {
        const body = await route.request().postDataJSON();

        // Validate TOTP format (6 digits) if provided
        if (
          body.totp &&
          (typeof body.totp !== 'string' ||
            body.totp.length !== 6 ||
            !/^\d+$/.test(body.totp))
        ) {
          return fulfillErrorResponse(
            route,
            400,
            'Invalid code',
            'The passcode you entered was incorrect or expired. Please try a new code.',
          );
        }

        // Validate deviceId if provided
        if (body.deviceId && typeof body.deviceId !== 'number') {
          return fulfillErrorResponse(
            route,
            400,
            'Invalid device',
            'Invalid device ID',
          );
        }

        // Success response
        return fulfillJSONResponse(route, 200, { success: true });
      } catch (error) {
        return fulfillErrorResponse(
          route,
          500,
          error instanceof Error ? error.message : 'Internal server error',
        );
      }
    }

    return fulfillErrorResponse(route, 405, 'Method not allowed');
  });

  // Handle account endpoints (not under /api/v2/)
  page.route('**/api/account/**', async (route: Route) => {
    const url = route.request().url();
    const method = route.request().method();

    try {
      if (method === 'POST') {
        if (url.includes('/api/account/register/')) {
          const body = await route.request().postDataJSON();

          // Check for duplicate email
          const existingUser = mockStore
            .getUsers()
            .find((u) => u.email === body.email);
          if (existingUser) {
            return fulfillErrorResponse(
              route,
              400,
              'Duplicate email',
              'A user with this email already exists',
            );
          }

          // Check for duplicate userName
          const existingUserName = mockStore
            .getUsers()
            .find((u) => u.userName === body.userName);
          if (existingUserName) {
            return fulfillErrorResponse(
              route,
              400,
              'Duplicate userName',
              'A user with this user name already exists',
            );
          }

          const newUser = createMockUser({
            userName: body.userName,
            email: body.email,
          });
          mockStore.setUser(newUser);
          return fulfillJSONResponse(route, 200, { success: true });
        }

        // Both change-password and reset-password return empty success
        if (
          url.includes('/api/account/change-password/') ||
          url.includes('/api/account/reset-password/')
        ) {
          return fulfillJSONResponse(route, 200, {});
        }
      }

      // Default: 404
      return fulfillErrorResponse(route, 404, 'Not found');
    } catch (error) {
      return fulfillErrorResponse(
        route,
        500,
        error instanceof Error ? error.message : 'Internal server error',
      );
    }
  });

  page.route('**/api/v2/**', async (route: Route) => {
    const url = route.request().url();
    const method = route.request().method();

    const query = parseODataQuery(url);

    try {
      // Handle authentication endpoints
      if (url.includes('/Auth/login') && method === 'POST') {
        const body = await route.request().postDataJSON();
        const user = mockStore
          .getUsers()
          .find((u) => u.userName === body.userName);

        if (user) {
          const authResponse = createAuthResponseFromUser(user);
          mockStore.setAuthToken(authResponse.accessToken, authResponse);
          return fulfillJSONResponse(route, 200, authResponse);
          return;
        }

        return fulfillErrorResponse(route, 401, 'Invalid credentials');
        return;
      }

      if (url.includes('/Auth/register') && method === 'POST') {
        const body = await route.request().postDataJSON();

        // Check for duplicate email
        const existingUser = mockStore
          .getUsers()
          .find((u) => u.email === body.email);
        if (existingUser) {
          return fulfillErrorResponse(
            route,
            400,
            'Duplicate email',
            'A user with this email already exists',
          );
        }

        // Check for duplicate userName
        const existingUserName = mockStore
          .getUsers()
          .find((u) => u.userName === body.userName);
        if (existingUserName) {
          return fulfillErrorResponse(
            route,
            400,
            'Duplicate userName',
            'A user with this user name already exists',
          );
        }

        const newUser = createMockUser({
          userName: body.userName,
          email: body.email,
        });
        mockStore.setUser(newUser);
        return fulfillJSONResponse(route, 200, { success: true });
      }

      // Handle leaderboard endpoint (e.g., /api/v2/taps/{id}/Default.leaderboard(...))
      // The URL pattern can be: /api/v2/taps(123)/Default.leaderboard(...) or /api/v2/taps/123/Default.leaderboard(...)
      if (url.includes('Default.leaderboard') && method === 'GET') {
        // Extract tap ID from URL - handle both patterns: taps(123) and taps/123
        const tapIdMatch = /\/taps(?:\((\d+)\)|\/(\d+))\/?/.exec(url);
        const tapId = tapIdMatch
          ? parseInt(tapIdMatch[1] || tapIdMatch[2], 10)
          : null;

        if (!tapId) {
          return fulfillErrorResponse(route, 400, 'Invalid tap ID');
        }

        // Return empty leaderboard array for now
        // In a real scenario, you'd query pours and aggregate by user
        const leaderboard: any[] = [];

        return fulfillJSONResponse(route, 200, leaderboard);
      }

      // Handle fetchSquareLocations (organizations(id)/Default.fetchSquareLocations())
      if (url.includes('Default.fetchSquareLocations') && method === 'GET') {
        return fulfillJSONResponse(route, 200, []);
      }

      // Handle friends/Default.addByUserName() (add friend by userName)
      if (url.includes('Default.addByUserName') && method === 'POST') {
        return fulfillJSONResponse(route, 200, {});
      }

      // Handle custom function endpoints (e.g., Default.nearby())
      if (url.includes('Default.nearby()') && method === 'GET') {
        // Parse query params for latitude, longitude, radius
        const urlObj = new URL(url);
        const latitude = parseFloat(urlObj.searchParams.get('latitude') || '0');
        const longitude = parseFloat(
          urlObj.searchParams.get('longitude') || '0',
        );

        // Get all locations from mock store
        const allLocations = getAllEntities('locations');
        const allTaps = getAllEntities('taps');
        const allDevices = getAllEntities('devices');
        const allKegs = getAllEntities('kegs');
        const allBeverages = getAllEntities('beverages');

        // Convert to NearbyLocation format
        const nearbyLocations = allLocations.map((location: any) => {
          // Find taps for this location
          const locationTaps = allTaps.filter(
            (tap: any) =>
              tap.location?.id === location.id ||
              tap.locationId === location.id,
          );

          // Convert taps to NearbyTap format
          const nearbyTaps = locationTaps.map((tap: any) => {
            const device = allDevices.find(
              (d: any) => d.id === tap.device?.id || d.id === tap.deviceId,
            );
            const keg = allKegs.find(
              (k: any) => k.tap?.id === tap.id || k.tapId === tap.id,
            );
            const beverage = keg
              ? allBeverages.find(
                  (b: any) =>
                    b.id === keg.beverage?.id || b.id === keg.beverageId,
                )
              : null;

            return {
              id: tap.id,
              name: tap.name || '',
              tapNumber: tap.tapNumber || 1,
              currentKeg:
                keg && beverage
                  ? {
                      beverageId: beverage.id,
                      beverageName: beverage.name,
                      kegType: keg.kegType || 'HalfBarrel',
                      maxOunces: keg.maxOunces || keg.ouncesTotal || 1984,
                      ounces: keg.ounces || keg.ouncesRemaining || 0,
                    }
                  : null,
              device: device
                ? {
                    id: device.id,
                    name: device.name || '',
                    isDeleted: device.isDeleted ?? false,
                  }
                : { id: 0, name: '', isDeleted: false },
            };
          });

          return {
            id: location.id,
            name: location.name,
            summary: location.description || null,
            taps: nearbyTaps,
          };
        });

        return fulfillJSONResponse(route, 200, nearbyLocations);
      }

      // Handle entity endpoints — GET by ID only (PUT/PATCH/DELETE also have query.id from OData URLs)
      if (query.id && method === 'GET') {
        // Normalize entity name to match EntityType (handle plural/singular variations)
        const normalizedEntity = normalizeEntityName(query.entity);
        let entity = getEntityById(normalizedEntity as EntityType, query.id);

        // Fallback: organizations(id) often requested by id (e.g. device.organization.id);
        // return a default organization so the app does not 404
        if (
          !entity &&
          (normalizedEntity === 'organizations' ||
            query.entity === 'organizations')
        ) {
          const defaultOrg = createMockOrganization({
            id: query.id,
            name: 'Test Organization',
            canEnablePayments: false,
          });
          mockStore.setOrganization(defaultOrg);
          entity = defaultOrg;
        }

        if (entity) {
          return fulfillJSONResponse(route, 200, entity);
        }
        return fulfillErrorResponse(route, 404, 'Not found');
      }

      // Handle GET many
      if (method === 'GET') {
        // Normalize entity name to match EntityType
        const normalizedEntity = normalizeEntityName(query.entity);
        let entities = getAllEntities(normalizedEntity as EntityType);

        // Apply filters
        entities = filterEntities(entities, query.filter);

        // Apply pagination
        const skip = query.skip || 0;
        const take = query.take || 20;
        const paginatedEntities = entities.slice(skip, skip + take);
        const totalCount = entities.length;

        // Check for $inlinecount (OData count requests)
        const hasInlineCount =
          url.includes('$inlinecount') || url.includes('$count');
        if (hasInlineCount) {
          // OData format with inlinecount for LocationDAO.count() and similar
          return fulfillJSONResponse(route, 200, {
            value: paginatedEntities,
            '@odata.count': totalCount,
            inlinecount: totalCount,
          });
        }

        // If take is 1 (fetchSingle) and no results, return 404
        if (take === 1 && paginatedEntities.length === 0) {
          return fulfillErrorResponse(route, 404, 'Not found');
        }

        // If take is 1 (fetchSingle) and we have results, return the first item as a single object
        // This matches the behavior of fetchSingle which expects a single entity, not an array
        if (take === 1 && paginatedEntities.length > 0) {
          return fulfillJSONResponse(route, 200, paginatedEntities[0]);
        }

        return fulfillJSONResponse(route, 200, paginatedEntities);
      }

      // Handle POST (create)
      if (method === 'POST') {
        const body = await route.request().postDataJSON();
        let newEntity: any;

        switch (query.entity) {
          case 'locations':
            newEntity = createMockLocation(body);
            mockStore.setLocation(newEntity);
            break;
          case 'taps':
            // Ensure tap has both device and location (hierarchy: Organization => Location => Devices => Taps => Kegs)
            const tapBody = body as any;
            let { deviceId } = tapBody;
            let { locationId } = tapBody;

            // If deviceId is provided, get the device and ensure it has a location
            if (deviceId && !locationId) {
              const device = mockStore.getDevice(deviceId);
              if (device?.location) {
                locationId = device.location.id;
              }
            }

            // If locationId is provided but no deviceId, create a device for that location
            if (locationId && !deviceId) {
              const location = mockStore.getLocation(locationId);
              if (location) {
                const newDevice = createMockDevice({
                  location: {
                    id: location.id,
                    name: location.name,
                    isDeleted: false,
                  },
                });
                mockStore.setDevice(newDevice);
                deviceId = newDevice.id;
              }
            }

            // Create tap with both deviceId and locationId
            newEntity = createMockTap({
              ...tapBody,
              deviceId,
              locationId,
            });
            mockStore.setTap(newEntity);
            break;
          case 'beverages':
            newEntity = createMockBeverage(body);
            mockStore.setBeverage(newEntity);
            break;
          case 'kegs':
            newEntity = createMockKeg(body);
            mockStore.setKeg(newEntity);
            break;
          case 'devices':
            newEntity = createMockDevice(body);
            mockStore.setDevice(newEntity);
            break;
          case 'pours':
            newEntity = createMockPour(body);
            mockStore.setPour(newEntity);
            break;
          case 'friends':
            newEntity = createMockFriend(body);
            mockStore.setFriend(newEntity);
            break;
          case 'permissions':
            newEntity = createMockPermission(body);
            mockStore.setPermission(newEntity);
            break;
          case 'flow-sensors':
            newEntity = createMockFlowSensor(body);
            mockStore.setFlowSensor(newEntity);
            break;
        }

        if (newEntity) {
          return fulfillJSONResponse(route, 201, newEntity);
        }
        return fulfillErrorResponse(route, 400, 'Invalid entity type');
      }

      // Handle PUT (update)
      if (method === 'PUT') {
        let body: Record<string, unknown> = {};
        const rawBody = route.request().postData();
        if (rawBody != null && rawBody.length > 0) {
          try {
            body = JSON.parse(rawBody) as Record<string, unknown>;
          } catch {
            body = {};
          }
        } else {
          const jsonBody = route.request().postDataJSON();
          if (jsonBody != null && typeof jsonBody === 'object') {
            body = jsonBody as Record<string, unknown>;
          }
        }
        const id = (query.id ?? body.id) as EntityID | undefined;
        const normalizedEntity = normalizeEntityName(query.entity);
        const entity =
          id != null
            ? getEntityById(normalizedEntity as EntityType, id)
            : undefined;

        if (entity) {
          // OData JSON uses string ids; preserve the entity's canonical id/key for Map lookups
          const updated = {
            ...entity,
            ...body,
            id: entity.id,
          };
          // Update in store (simplified - would need setter for each type)
          switch (normalizedEntity) {
            case 'locations':
              mockStore.setLocation(updated);
              break;
            case 'taps':
              mockStore.setTap(updated);
              break;
            case 'kegs':
              mockStore.setKeg(updated);
              break;
            case 'devices':
              mockStore.setDevice(updated as Device);
              break;
            case 'beverages':
              mockStore.setBeverage(updated as Beverage);
              break;
            // Add other entities as needed
          }
          return fulfillJSONResponse(route, 200, updated);
        }
        return fulfillErrorResponse(route, 404, 'Not found');
      }

      // Handle DELETE
      if (method === 'DELETE') {
        // For simplicity, we'll just return success
        // In a real implementation, you'd remove from store
        return fulfillJSONResponse(route, 200, { success: true });
      }

      // Default: 404
      return fulfillErrorResponse(route, 404, 'Not found');
    } catch (error) {
      return fulfillErrorResponse(
        route,
        500,
        error instanceof Error ? error.message : 'Internal server error',
      );
    }
  });
}

// Reset mock store
export function resetMockStore(): void {
  mockStore.clear();
}
