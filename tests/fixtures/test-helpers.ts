/* eslint-disable no-restricted-syntax */
/**
 * Reusable test helpers for common patterns
 * These helpers follow the constitution: use testID, explicit data setup, no conditional logic
 */

import { expect, Page } from '@playwright/test';

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
 * Real-API: the creating user is granted an Administrator permission row by
 * the API itself on every POST (creator-grant), so entities seeded by the
 * authenticated user are already visible/editable — these helpers are
 * retained as no-ops so converted specs read the same. Specs that need a
 * DIFFERENT permission level must seed as a second account instead.
 */
export async function setupTapPermissions(
  _authenticatedUser: Account,
  _tap: Tap,
  _organization?: Organization,
  _permissionTypes?: ('Read' | 'Edit' | 'Administrator' | 'BannedFromTap')[],
): Promise<void> {}

export async function setupLocationPermissions(
  _authenticatedUser: Account,
  _location: Location,
  _organization?: Organization,
  _permissionTypes?: ('Read' | 'Edit' | 'Administrator' | 'BannedFromTap')[],
): Promise<void> {}

export async function setupDevicePermissions(
  _authenticatedUser: Account,
  _device: Device,
  _organization?: Organization,
  _permissionTypes?: ('Read' | 'Edit' | 'Administrator' | 'BannedFromTap')[],
): Promise<void> {}

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
