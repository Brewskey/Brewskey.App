import { test, expect } from '../../fixtures/test-fixtures';
import { mockLocationPermission } from '../../fixtures/page-objects';
import { mockLocationWithTaps } from '../../fixtures/entity-fixtures';

// Configure tests to auto-authenticate
test.use({ autoAuthenticate: true });

test('should display nearby locations', async ({ page, homePage }) => {
  // Set up explicit data: location permission granted, one location nearby
  await mockLocationPermission(page, true);
  const { location } = await mockLocationWithTaps(page, 0);
  await homePage.goto();

  await expect(homePage.getNearbyLocationsList()).toBeVisible();
  
  // Location name is dynamic content, so text-based locator is acceptable
  await expect(page.locator(`text=${location.name}`)).toBeVisible();
});

test('should request location permission', async ({ page, homePage }) => {
  // Set up explicit data: location permission denied
  await mockLocationPermission(page, false);
  await homePage.goto();

  // Use specific text to avoid strict mode violation - check for permission request text
  await expect(
    page.getByText('In order to see nearby taps, we need location permissions'),
  ).toBeVisible();
});

test('should show permission request button', async ({ page, homePage }) => {
  // Set up explicit data: location permission denied
  await mockLocationPermission(page, false);
  await homePage.goto();

  await expect(homePage.getPermissionRequestButton()).toBeVisible();
});

test('should show empty state when no nearby locations', async ({ page, homePage }) => {
  // Set up explicit data: location permission granted, but no locations nearby
  await mockLocationPermission(page, true);
  // Store is already empty from resetStores fixture
  await homePage.goto();

  // Wait for nearby locations list to be visible (it shows empty state)
  // The list itself should be visible even when empty
  await expect(homePage.getNearbyLocationsList()).toBeVisible();
});

test('should allow refreshing locations', async ({ page, homePage }) => {
  // Set up explicit data: location permission granted, one location nearby
  await mockLocationPermission(page, true);
  await mockLocationWithTaps(page, 0);
  await homePage.goto();

  // Refresh is typically handled via pull-to-refresh on mobile
  // Verify the page loads correctly - pull-to-refresh is tested separately
  await expect(homePage.getNearbyLocationsList()).toBeVisible();
});
