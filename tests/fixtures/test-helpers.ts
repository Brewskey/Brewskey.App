/* eslint-disable no-restricted-syntax */
/**
 * Reusable test helpers for common patterns
 * These helpers follow the constitution: use testID, explicit data setup, no conditional logic
 */

import { expect, Page } from '@playwright/test';

import { mockStore } from './api-mocks';
import { createMockPermission, createShortenedEntity } from './test-data';

import type {
  Account,
  Device,
  Location,
  Organization,
  Tap,
} from '@brewskey/js-api';

/**
 * Submit a form by clicking the submit button (create or edit)
 */
export async function submitForm(
  page: Page,
  entityType:
    | 'location'
    | 'tap'
    | 'device'
    | 'beverage'
    | 'keg'
    | 'flow-sensor',
  action: 'create' | 'edit',
): Promise<void> {
  const testId = `submit-button-${action}-${entityType}`;
  await expect(page.getByTestId(testId)).toBeVisible();
  await page.getByTestId(testId).click();
}

/**
 * Set up permissions for a tap
 */
export async function setupTapPermissions(
  authenticatedUser: Account,
  tap: Tap,
  organization: Organization,
  permissionTypes: ('Read' | 'Edit' | 'Administrator' | 'BannedFromTap')[] = [
    'Read',
  ],
): Promise<void> {
  for (const permissionType of permissionTypes) {
    const permission = createMockPermission({
      permissionType,
      tap: { id: tap.id, isDeleted: false },
      forUser: {
        id: authenticatedUser.id,
        userName: authenticatedUser.userName,
      },
      createdBy: {
        id: authenticatedUser.id,
        userName: authenticatedUser.userName,
      },
      organization: createShortenedEntity(organization.id, organization.name),
      invalid: false,
      isDeleted: false,
      createdDate: new Date(),
    });
    mockStore.setPermission(permission);
  }
}

/**
 * Set up permissions for a location
 */
export async function setupLocationPermissions(
  authenticatedUser: Account,
  location: Location,
  organization: Organization,
  permissionTypes: ('Read' | 'Edit' | 'Administrator' | 'BannedFromTap')[] = [
    'Read',
  ],
): Promise<void> {
  for (const permissionType of permissionTypes) {
    const permission = createMockPermission({
      permissionType,
      location: { id: location.id, name: location.name, isDeleted: false },
      forUser: {
        id: authenticatedUser.id,
        userName: authenticatedUser.userName,
      },
      createdBy: {
        id: authenticatedUser.id,
        userName: authenticatedUser.userName,
      },
      organization: createShortenedEntity(organization.id, organization.name),
      invalid: false,
      isDeleted: false,
      createdDate: new Date(),
    });
    mockStore.setPermission(permission);
  }
}

/**
 * Set up permissions for a device
 */
export async function setupDevicePermissions(
  authenticatedUser: Account,
  device: Device,
  organization: Organization,
  permissionTypes: ('Read' | 'Edit' | 'Administrator' | 'BannedFromTap')[] = [
    'Read',
  ],
): Promise<void> {
  for (const permissionType of permissionTypes) {
    const permission = createMockPermission({
      permissionType,
      device: { id: device.id, name: device.name, isDeleted: false },
      forUser: {
        id: authenticatedUser.id,
        userName: authenticatedUser.userName,
      },
      createdBy: {
        id: authenticatedUser.id,
        userName: authenticatedUser.userName,
      },
      organization: createShortenedEntity(organization.id, organization.name),
      invalid: false,
      isDeleted: false,
      createdDate: new Date(),
    });
    mockStore.setPermission(permission);
  }
}

/** URL path segment per entity type (Expo Router shared routes) */
const DETAIL_PATH: Record<
  'location' | 'tap' | 'device' | 'beverage' | 'keg',
  string
> = {
  location: 'locations',
  tap: 'taps',
  device: 'devices',
  beverage: 'beverages',
  keg: 'taps', // keg detail is under taps
};

/** URL path segment for create (flow-sensor is singular in routes) */
const CREATE_PATH: Record<
  'location' | 'tap' | 'device' | 'beverage' | 'keg' | 'flow-sensor',
  string
> = {
  location: 'locations',
  tap: 'taps',
  device: 'devices',
  beverage: 'beverages',
  keg: 'kegs', // keg create is taps/[tapId]/keg/new – use navigate via UI for keg
  'flow-sensor': 'flow-sensor',
};

/** URL path segment for edit (flow-sensor is singular) */
const EDIT_PATH: Record<
  'location' | 'tap' | 'device' | 'beverage' | 'keg' | 'flow-sensor',
  string
> = {
  location: 'locations',
  tap: 'taps',
  device: 'devices',
  beverage: 'beverages',
  keg: 'kegs',
  'flow-sensor': 'flow-sensor',
};

/**
 * Navigate to a detail page and wait for it to load
 */
export async function navigateToDetailPage(
  page: Page,
  entityType: 'location' | 'tap' | 'device' | 'beverage' | 'keg',
  id: number,
  headerTestId: string,
): Promise<void> {
  const segment = DETAIL_PATH[entityType];
  await page.goto(`/${segment}/${id}`);
  await expect(page.getByTestId(headerTestId)).toBeVisible();
}

/**
 * Navigate to a create page and wait for form to load
 */
export async function navigateToCreatePage(
  page: Page,
  entityType:
    | 'location'
    | 'tap'
    | 'device'
    | 'beverage'
    | 'keg'
    | 'flow-sensor',
  inputTestId: string,
): Promise<void> {
  const segment = CREATE_PATH[entityType];
  await page.goto(`/${segment}/new`);
  await expect(page.getByTestId(inputTestId)).toBeVisible();
}

/**
 * Navigate to an edit page and wait for form to load
 */
export async function navigateToEditPage(
  page: Page,
  entityType:
    | 'location'
    | 'tap'
    | 'device'
    | 'beverage'
    | 'keg'
    | 'flow-sensor',
  id: number,
  inputTestId: string,
): Promise<void> {
  const segment = EDIT_PATH[entityType];
  await page.goto(`/${segment}/${id}/edit`);
  await expect(page.getByTestId(inputTestId)).toBeVisible();
}
