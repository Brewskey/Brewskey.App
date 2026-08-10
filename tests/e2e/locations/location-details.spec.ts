import { test, expect } from '../../fixtures/test-fixtures';

test.use({ autoAuthenticate: true, seed: { devices: 1 } });

test('should navigate to edit location', async ({ page, locations }) => {
  // The authenticated user creates the location, so the API's creator-grant
  // gives them Administrator (edit) permission — real, not mocked. The seeded
  // location carries a full street address.
  const [location] = locations;

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
