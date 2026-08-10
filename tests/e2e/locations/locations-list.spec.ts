import { test, expect } from '../../fixtures/test-fixtures';

// Configure tests to auto-authenticate
test.use({ autoAuthenticate: true });

test('should show empty state when no locations exist', async ({
  page,
  locationPage,
  menuPage,
}) => {
  // No seed: a fresh account owns no locations.

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

test.describe('with one location', () => {
  test.use({ seed: { devices: 1 } });

  test('should navigate to location details', async ({
    page,
    locationPage,
    menuPage,
    locations,
  }) => {
    const [location] = locations;

    // Navigate through menu to locations
    await menuPage.goto();
    await menuPage.clickLocations();

    // Wait for list to load
    await expect(locationPage.getLocationsList()).toBeVisible();

    // Location name is dynamic content, but we can use location-item testID
    await page.getByTestId(`location-item-${location.id}`).click();

    await expect(page).toHaveURL(/.*location.*details|location.*\d+/i);
  });
});

test('should navigate to create location', async ({
  page,
  locationPage,
  menuPage,
}) => {
  // Navigate through menu to locations
  await menuPage.goto();
  await menuPage.clickLocations();

  // Wait for page to load
  await expect(locationPage.getLocationsList()).toBeVisible();

  await locationPage.getAddLocationButton().click();

  await expect(page).toHaveURL(/.*location.*new|new.*location/i);
});
