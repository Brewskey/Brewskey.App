/**
 * Reusable test helpers for common patterns
 * These helpers follow the constitution: use testID, explicit data setup, no conditional logic
 */

import { Page, expect } from '@playwright/test';
import { mockStore } from './api-mocks';
import { createMockPermission } from './test-data';
import type { Account, Tap, Location, Device, Organization } from '@brewskey/js-api';


/**
 * Submit a form by clicking the submit button (create or edit)
 */
export async function submitForm(
  page: Page,
  entityType: 'location' | 'tap' | 'device' | 'beverage' | 'keg' | 'flow-sensor',
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
  permissionTypes: ('Read' | 'Edit' | 'Administrator' | 'BannedFromTap')[] = ['Read'],
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
      organization: { id: organization.id, name: organization.name, isDeleted: false },
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
  permissionTypes: ('Read' | 'Edit' | 'Administrator' | 'BannedFromTap')[] = ['Read'],
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
      organization: { id: organization.id, name: organization.name, isDeleted: false },
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
  permissionTypes: ('Read' | 'Edit' | 'Administrator' | 'BannedFromTap')[] = ['Read'],
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
      organization: { id: organization.id, name: organization.name, isDeleted: false },
      invalid: false,
      isDeleted: false,
      createdDate: new Date(),
    });
    mockStore.setPermission(permission);
  }
}

/**
 * Navigate to a detail page and wait for it to load
 */
export async function navigateToDetailPage(
  page: Page,
  entityType: 'location' | 'tap' | 'device' | 'beverage' | 'keg',
  id: number,
  headerTestId: string,
): Promise<void> {
  await page.goto(`/${entityType}s/${id}`);
  await expect(page.getByTestId(headerTestId)).toBeVisible();
}

/**
 * Navigate to a create page and wait for form to load
 */
export async function navigateToCreatePage(
  page: Page,
  entityType: 'location' | 'tap' | 'device' | 'beverage' | 'keg' | 'flow-sensor',
  inputTestId: string,
): Promise<void> {
  await page.goto(`/${entityType}s/new`);
  await expect(page.getByTestId(inputTestId)).toBeVisible();
}

/**
 * Navigate to an edit page and wait for form to load
 */
export async function navigateToEditPage(
  page: Page,
  entityType: 'location' | 'tap' | 'device' | 'beverage' | 'keg' | 'flow-sensor',
  id: number,
  inputTestId: string,
): Promise<void> {
  await page.goto(`/${entityType}s/${id}/edit`);
  await expect(page.getByTestId(inputTestId)).toBeVisible();
}
