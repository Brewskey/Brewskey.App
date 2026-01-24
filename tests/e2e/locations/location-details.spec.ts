import { test, expect } from '../../fixtures/test-fixtures';
import { mockLocationWithTaps } from '../../fixtures/entity-fixtures';
import { setupLocationPermissions } from '../../fixtures/test-helpers';
import { createMockOrganization } from '../../fixtures/test-data';
import { mockStore } from '../../fixtures/api-mocks';

test.use({ autoAuthenticate: true });

test('should navigate to edit location', async ({ page, authenticatedUser }) => {
  // Set up explicit data: one location with Edit permission
  const { location } = await mockLocationWithTaps(page, 0);
  
  // Create organization for permissions and associate with location
  const organization = createMockOrganization();
  mockStore.setOrganization(organization);
  
  // Update location to include organization and set owner to authenticated user
  // authenticatedUser is always available when autoAuthenticate: true
  if (!authenticatedUser) throw new Error('authenticatedUser is required');
  const locationWithOrg = {
    ...location,
    id: location.id, // Ensure ID is preserved
    organization: { id: organization.id, name: organization.name, isDeleted: false },
    owner: { id: authenticatedUser.user.id, userName: authenticatedUser.user.userName },
  };
  mockStore.setLocation(locationWithOrg);
  
  // Set up Edit permission so edit button is visible
  await setupLocationPermissions(authenticatedUser.user, locationWithOrg, organization, ['Edit']);

  await page.goto(`/locations/${location.id}`);

  // Wait for header to ensure page loaded (header appears even during loading)
  await expect(page.getByTestId('header-location-details')).toBeVisible();
  
  // Wait for loading to complete - loading indicator should disappear
  await expect(page.getByTestId('location-details-loading')).toBeHidden({ timeout: 10000 });
  
  // Wait for content to appear after loading completes
  await expect(page.getByTestId('location-address')).toBeVisible();
  
  // Use testID for edit button - should be visible because we set up Edit permission
  const editButton = page.getByTestId('button-edit-location');
  await expect(editButton).toBeVisible();
  await editButton.click();
  
  await expect(page).toHaveURL(/.*edit/i);
});
