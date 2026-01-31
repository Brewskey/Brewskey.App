import { test, expect } from '../../fixtures/test-fixtures';
import { mockLocationWithTaps } from '../../fixtures/entity-fixtures';

// Configure tests to auto-authenticate
test.use({ autoAuthenticate: true });

test('should display nearby locations', async ({ page, homePage }) => {
  // Set up explicit data: one location nearby
  // Geolocation permission is already granted via test-fixtures.ts
  const { location } = await mockLocationWithTaps(page, 0);
  await homePage.goto();

  await expect(homePage.getNearbyLocationsList()).toBeVisible();

  // Location name is dynamic content, but we can check within the nearby-locations-list
  // NearbyLocationsList shows location names in section headers
  const nearbyList = page.getByTestId('nearby-locations-list');
  await expect(nearbyList.locator(`text=${location.name}`)).toBeVisible();
});

test('should request location permission', async ({ page, homePage }) => {
  // Set up explicit data: location permission denied
  // Clear permissions to test permission request flow
  await page.context().clearPermissions();
  await homePage.goto();

  // Permission request text has testID - use that instead of text-based locator
  await expect(page.getByTestId('home-permission-request')).toBeVisible();
  await expect(page.getByTestId('home-permission-text')).toBeVisible();
});

test.describe(() => {
  test.use({
    permissions: [],
    geolocation: undefined,
  });
  test('should show permission request button', async ({ page, homePage }) => {
    // Set up explicit data: location permission denied
    // Clear permissions to test permission request flow
    await page.context().clearPermissions();
    await homePage.goto();

    await expect(homePage.getPermissionRequestButton()).toBeVisible();
  });
});
test.describe(() => {
  test.use({
    geolocation: undefined,
  });
  test('should show empty state when no nearby locations', async ({
    page,
    homePage,
  }) => {
    // Set up explicit data: no locations nearby
    // Geolocation permission is already granted via test-fixtures.ts
    // Store is already empty from resetStores fixture
    await homePage.goto();

    // Wait for nearby locations list to be visible (it shows empty state)
    // The list itself should be visible even when empty
    await expect(homePage.getNearbyLocationsList()).toBeVisible();
  });
});
test('should allow refreshing locations', async ({ page, homePage }) => {
  // Set up explicit data: one location nearby
  // Geolocation permission is already granted via test-fixtures.ts
  await mockLocationWithTaps(page, 0);
  await homePage.goto();

  // Refresh is typically handled via pull-to-refresh on mobile
  // Verify the page loads correctly - pull-to-refresh is tested separately
  await expect(homePage.getNearbyLocationsList()).toBeVisible();
});
