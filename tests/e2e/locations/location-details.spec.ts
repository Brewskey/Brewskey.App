import { test, expect } from '../../fixtures/test-fixtures';
import { seedLocationWithTaps } from '../../fixtures/entity-fixtures';

test.use({ autoAuthenticate: true });

test('should navigate to edit location', async ({
  page,
  authenticatedUser, seedApi,}) => {
  // The authenticated user creates the location, so the API's creator-grant
  // gives them Administrator (edit) permission — real, not mocked. The seeded
  // location carries a full street address.
  if (!authenticatedUser) throw new Error('authenticatedUser is required');
  const { location } = await seedLocationWithTaps(seedApi, 0);

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
