import { test, expect } from '../../fixtures/test-fixtures';
import { mockLocationWithTaps } from '../../fixtures/entity-fixtures';

// Configure tests to auto-authenticate
test.use({ autoAuthenticate: true });

test('should display list of locations', async ({ page, locationPage, menuPage }) => {
  // Set up explicit data: one location with 2 taps
  const { location } = await mockLocationWithTaps(page, 2);
  
  // Navigate through menu to locations (since LocationsStack is nested in MenuStack)
  await menuPage.goto();
  await menuPage.clickLocations();

  // Wait for screen to load - check header first
  await expect(page.getByTestId('header-locations')).toBeVisible();
  
  // Wait for list to be visible (it may take a moment for the query to load)
  await expect(locationPage.getLocationsList()).toBeVisible();

  // Location name is dynamic content (user-generated), so text-based locator is acceptable
  // But we check within the locations list container
  const locationsList = page.getByTestId('locations-list');
  await expect(locationsList.locator(`text=${location.name}`)).toBeVisible();
});

test('should show empty state when no locations exist', async ({ page, locationPage, menuPage }) => {
  // Set up explicit data: no locations (empty state)
  // Store is already empty from resetStores fixture
  
  // Navigate through menu to locations
  await menuPage.goto();
  await menuPage.clickLocations();

  // When empty, the list shows ListEmptyComponent
  // The list container is always visible, and the empty message is shown inside it
  await expect(locationPage.getLocationsList()).toBeVisible();
  // Check for empty state message
  await expect(page.getByText('Create a location and set up the address')).toBeVisible();
});

test('should navigate to location details', async ({ page, locationPage, menuPage }) => {
  // Set up explicit data: one location with no taps
  const { location } = await mockLocationWithTaps(page, 0);
  
  // Navigate through menu to locations
  await menuPage.goto();
  await menuPage.clickLocations();
  
  // Wait for list to load
  await expect(locationPage.getLocationsList()).toBeVisible();
  
  // Location name is dynamic content, so text-based locator is acceptable
  await locationPage.clickLocation(location.name);

  await expect(page).toHaveURL(/.*location.*details|location.*\d+/i);
});

test('should navigate to create location', async ({ page, locationPage, menuPage }) => {
  // Navigate through menu to locations
  await menuPage.goto();
  await menuPage.clickLocations();
  
  // Wait for page to load
  await expect(locationPage.getLocationsList()).toBeVisible();
  
  await locationPage.getAddLocationButton().click();

  await expect(page).toHaveURL(/.*location.*new|new.*location/i);
});
