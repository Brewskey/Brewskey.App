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

  // Location name is dynamic content, but we can use location-item testID
  // LocationsList uses ListItem with testID
  await expect(page.getByTestId(`location-item-${location.id}`)).toBeVisible();
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
  // Check for empty state - NuxNoEntity component shows this message
  await expect(page.getByTestId('nux-no-entity-content')).toBeVisible();
  await expect(page.getByTestId('button-get-started')).toBeVisible();
});

test('should navigate to location details', async ({ page, locationPage, menuPage }) => {
  // Set up explicit data: one location with no taps
  const { location } = await mockLocationWithTaps(page, 0);
  
  // Navigate through menu to locations
  await menuPage.goto();
  await menuPage.clickLocations();
  
  // Wait for list to load
  await expect(locationPage.getLocationsList()).toBeVisible();
  
  // Location name is dynamic content, but we can use location-item testID
  await page.getByTestId(`location-item-${location.id}`).click();

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
