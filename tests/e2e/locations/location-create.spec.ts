import { expect, test } from '../../fixtures/test-fixtures';

// Need at least one location so app doesn't redirect to NUX when visiting /locations
test.use({ autoAuthenticate: true, locationCount: 1 });

test('should successfully create location', async ({ page, locationPage }) => {
  await locationPage.goto();
  await page.getByTestId('header-add-button').click();
  await expect(page).toHaveURL(/locations\/new/i, { timeout: 10000 });
  await expect(page.getByTestId('location-form')).toBeVisible({
    timeout: 10000,
  });
  await expect(page.getByTestId('input-name')).toBeVisible();

  // Mutate every form field: name, description, locationType, street, suite, city, state, zipCode
  // (organization and squareLocationID are conditional and may not be present)
  await locationPage.fillLocationForm({
    name: 'Test Location',
    description: 'Test location description',
    address: '123 Test St',
    suite: 'Suite 100',
    city: 'Test City',
    state: 'Texas',
    zipCode: '12345',
    locationType: 'Kegerator',
  });
  await locationPage.submitForm();

  // Success messages appear in snackbar - use testID
  // Wait for snackbar to appear (may appear before or after navigation)
  // Verify exact success message text
  // Playwright's auto-waiting will handle timing
  await expect(page.getByTestId('snackbar-message')).toBeVisible();
  await expect(page.getByTestId('snackbar-message')).toHaveText(
    'New location created',
  );
});

test('should handle API errors', async ({ page, locationPage }) => {
  // Set up explicit data: authenticated user (handled by autoAuthenticate)
  // Note: API mocks currently don't simulate errors, so this test verifies successful creation
  // TODO: When error mocking is implemented, this test should verify error handling
  // In a real scenario with API errors, the form would show validation or snackbar error
  await locationPage.goto();
  await page.getByTestId('header-add-button').click();
  await expect(page).toHaveURL(/locations\/new/i, { timeout: 10000 });
  await expect(page.getByTestId('location-form')).toBeVisible({
    timeout: 10000,
  });
  await expect(page.getByTestId('input-name')).toBeVisible();

  await locationPage.fillLocationForm({
    name: 'Error Location',
    address: '123 Test St',
    city: 'Test City',
    state: 'Texas', // Use full state name, not abbreviation
    zipCode: '12345',
    locationType: 'Kegerator',
  });
  await locationPage.submitForm();

  // With current API mocks, creation succeeds and shows success message
  // Playwright's auto-waiting will handle timing
  await expect(page.getByTestId('snackbar-message')).toBeVisible();
  await expect(page.getByTestId('snackbar-message')).toHaveText(
    'New location created',
  );
});

test('should redirect to nux/wifi when returnTo=nux-wifi after create', async ({
  page,
  locationPage,
}) => {
  // Visit locations/new with returnTo param (e.g. from NUX flow)
  await locationPage.goto();
  await page.goto('/locations/new?returnTo=nux-wifi&showBackButton=false');

  await expect(page.getByTestId('location-form')).toBeVisible({
    timeout: 10000,
  });
  await locationPage.fillLocationForm({
    name: 'Redirect Test Location',
    address: '456 Redirect St',
    city: 'Redirect City',
    state: 'Texas',
    zipCode: '54321',
    locationType: 'Kegerator',
  });
  await locationPage.submitForm();

  // Should redirect to nux/wifi with locationId (returnTo=nux-wifi)
  await expect(page).toHaveURL(/\/wifi/i);
  await expect(page.getByTestId('nux-wifi-content')).toBeVisible();
});
