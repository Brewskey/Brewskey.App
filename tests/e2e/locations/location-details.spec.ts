import { test, expect } from '../../fixtures/test-fixtures';
import { mockLocationWithTaps } from '../../fixtures/entity-fixtures';
import { setupLocationPermissions } from '../../fixtures/test-helpers';
import { createMockOrganization } from '../../fixtures/test-data';
import { mockStore } from '../../fixtures/api-mocks';

test.use({ autoAuthenticate: true });

test('should display location information', async ({ page, authenticatedUser }) => {
  // Set up explicit data: one location with no taps
  const { location } = await mockLocationWithTaps(page, 0);
  
  // Create organization for permissions
  const organization = createMockOrganization();
  mockStore.setOrganization(organization);
  
  // Set up permissions so user can view the location
  if (authenticatedUser) {
    await setupLocationPermissions(authenticatedUser.user, location, organization, ['Read']);
  }

  await page.goto(`/locations/${location.id}`);

  // Location name and city are dynamic content from API, so text-based locators are acceptable
  await expect(page.locator(`text=${location.name}`)).toBeVisible();
  // Location address is displayed as city, state zipCode
  await expect(page.locator(`text=${location.city}`)).toBeVisible();
});

test('should navigate to edit location', async ({ page, authenticatedUser }) => {
  // Set up explicit data: one location with Edit permission
  const { location } = await mockLocationWithTaps(page, 0);
  
  // Create organization for permissions
  const organization = createMockOrganization();
  mockStore.setOrganization(organization);
  
  // Set up Edit permission so edit button is visible
  if (authenticatedUser) {
    await setupLocationPermissions(authenticatedUser.user, location, organization, ['Edit']);
  }

  await page.goto(`/locations/${location.id}`);

  // Use testID for edit button - should be visible because we set up Edit permission
  const editButton = page.getByTestId('button-edit-location');
  await expect(editButton).toBeVisible();
  await editButton.click();
  
  await expect(page).toHaveURL(/.*edit/i);
});

test('should display associated taps', async ({ page, authenticatedUser }) => {
  // Set up explicit data: one location with 3 taps
  const { location, taps } = await mockLocationWithTaps(page, 3);
  
  // Create organization for permissions
  const organization = createMockOrganization();
  mockStore.setOrganization(organization);
  
  // Set up permissions so user can view the location
  if (authenticatedUser) {
    await setupLocationPermissions(authenticatedUser.user, location, organization, ['Read']);
  }

  await page.goto(`/locations/${location.id}`);

  for (const tap of taps) {
    // TapListItem displays as "${tapNumber} - ${beverageName}"
    // Tap number is dynamic content, so text-based locator is acceptable
    await expect(page.locator(`text=${tap.tapNumber}`)).toBeVisible();
  }
});
