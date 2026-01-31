import { test, expect } from '../../fixtures/test-fixtures';
import { mockLocationWithTaps } from '../../fixtures/entity-fixtures';
import { setupLocationPermissions } from '../../fixtures/test-helpers';
import { createMockOrganization } from '../../fixtures/test-data';
import { mockStore } from '../../fixtures/api-mocks';

test.use({ autoAuthenticate: true });

test('should navigate to edit location', async ({
  page,
  authenticatedUser,
}) => {
  // Set up explicit data: one location with Edit permission
  const { location } = await mockLocationWithTaps(page, 0);

  // Create organization for permissions and associate with location
  const organization = createMockOrganization();
  mockStore.setOrganization(organization);

  // Update location to include organization, owner, and address (LocationAddress requires street, city, state, zipCode)
  if (!authenticatedUser) throw new Error('authenticatedUser is required');
  const locationWithOrg = {
    ...location,
    id: location.id,
    street: location.street ?? '123 Test St',
    organization: {
      id: organization.id,
      name: organization.name,
      isDeleted: false,
    },
    owner: {
      id: authenticatedUser.user.id,
      userName: authenticatedUser.user.userName,
    },
  };
  mockStore.setLocation(locationWithOrg);

  await setupLocationPermissions(
    authenticatedUser.user,
    locationWithOrg,
    organization,
    ['Edit'],
  );

  await page.goto(`/locations/${location.id}`);

  await expect(page.getByTestId('header-location-details')).toBeVisible();
  // Wait for location to load and Address section (LocationAddress) to render
  await expect(page.getByTestId('location-address')).toBeVisible({
    timeout: 10000,
  });

  // Use testID for edit button - should be visible because we set up Edit permission
  const editButton = page.getByTestId('button-edit-location');
  await expect(editButton).toBeVisible();
  await editButton.click();

  await expect(page).toHaveURL(/.*edit/i);
});
