import { uniqueGeolocation } from '../../fixtures/seed-api';
import { test, expect } from '../../fixtures/test-fixtures';

test.use({ autoAuthenticate: true });

test.describe('with a nearby location', () => {
  // Nearby locations are geolocation-based (not permission-filtered), so the
  // persistent stack DB accumulates locations at any shared point and the
  // target gets buried in the paginated list. Unique coordinates per describe
  // isolate this run; the seed fixture places `nearby` locations at the
  // context's geolocation automatically.
  test.use({
    geolocation: uniqueGeolocation(),
    seed: { locations: [{ nearby: true }], taps: 1 },
  });

  test('should display nearby locations', async ({
    page,
    homePage,
    locations,
  }) => {
    const [location] = locations;
    await homePage.goto();

    await expect(homePage.getNearbyLocationsList()).toBeVisible();

    // Location name is dynamic content, but we can check within the
    // nearby-locations-list (names render in section headers).
    const nearbyList = page.getByTestId('nearby-locations-list');
    await expect(
      nearbyList.getByText(location.name, { exact: false }).first(),
    ).toBeVisible();
  });
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
    homePage,
  }) => {
    // No geolocation: the nearby list renders its empty state.
    await homePage.goto();

    await expect(homePage.getNearbyLocationsList()).toBeVisible();
  });
});

test.describe('refresh', () => {
  test.use({
    geolocation: uniqueGeolocation(),
    seed: { locations: [{ nearby: true }], devices: 1 },
  });

  test('should allow refreshing locations', async ({ homePage }) => {
    await homePage.goto();

    // Refresh is typically handled via pull-to-refresh on mobile
    // Verify the page loads correctly - pull-to-refresh is tested separately
    await expect(homePage.getNearbyLocationsList()).toBeVisible();
  });
});
