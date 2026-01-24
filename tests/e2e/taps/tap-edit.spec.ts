import { test, expect } from '../../fixtures/test-fixtures';
import { mockTapWithKeg } from '../../fixtures/entity-fixtures';

test.use({ autoAuthenticate: true });

test('should pre-fill form with existing data when tap has description', async ({ page }) => {
  // Set up explicit data: one tap with description
  const { tap } = await mockTapWithKeg(page, 'Test Tap Description');

  await page.goto(`/taps/${tap.id}/edit/basic`);

  // Wait for the page to load - check for Edit Tap header using testID
  await expect(page.getByTestId('header-edit-tap')).toBeVisible();
  
  // Wait for the form to be visible (loading indicator will disappear automatically)
  // TapForm shows tap-form-loading while organization query is loading
  await expect(page.getByTestId('tap-form')).toBeVisible({ timeout: 10000 });
  
  // Wait for the form input to be visible (with longer timeout for organization query)
  await expect(page.getByTestId('input-description')).toBeVisible({ timeout: 10000 });
  
  // TapForm has description field - assert it has the value
  await expect(page.getByTestId('input-description')).toHaveValue('Test Tap Description');
});

test('should pre-fill form with existing data when tap has no description', async ({ page }) => {
  // Set up explicit data: one tap without description
  // mockTapWithKeg creates a tap with a description, so we need to create one without
  const { createMockTap } = await import('../../fixtures/test-data');
  const { mockStore } = await import('../../fixtures/api-mocks');
  const { mockLocationWithTaps, mockDeviceWithTaps } = await import('../../fixtures/entity-fixtures');
  
  const { location } = await mockLocationWithTaps(page, 0);
  const { device } = await mockDeviceWithTaps(page, 0);
  
  // Create a tap without description
  const tap = createMockTap({
    locationId: location.id,
    deviceId: device.id,
    description: '', // Explicitly set to empty string
  });
  mockStore.setTap(tap);

  await page.goto(`/taps/${tap.id}/edit/basic`);

  // Wait for the page to load - check for Edit Tap header using testID
  // Playwright's auto-waiting will handle timing
  await expect(page.getByTestId('header-edit-tap')).toBeVisible();
  
  // Wait for loading indicator to disappear (if present) and form to appear
  // TapForm shows tap-form-loading while organization query is loading
  // Playwright's auto-waiting will handle the transition from loading to form
  await expect(page.getByTestId('tap-form')).toBeVisible();
  
  // Wait for the form input to be visible
  await expect(page.getByTestId('input-description')).toBeVisible();
  
  // Description field should be empty when tap has no description
  await expect(page.getByTestId('input-description')).toHaveValue('');
});

test('should successfully update tap', async ({ page }) => {
  // Set up explicit data: one tap with keg
  const { tap } = await mockTapWithKeg(page);

  await page.goto(`/taps/${tap.id}/edit/basic`);

  // Wait for the page to load
  // Playwright's auto-waiting will handle timing
  await expect(page.getByTestId('header-edit-tap')).toBeVisible();
  
  // Wait for the tap-form to be visible
  await expect(page.getByTestId('tap-form')).toBeVisible();
  
  // Wait for the form input to be visible
  await expect(page.getByTestId('input-description')).toBeVisible();

  await page.getByTestId('input-description').fill('Updated Tap Description');
  await expect(page.getByTestId('submit-button-edit-tap')).toBeVisible();
  await page.getByTestId('submit-button-edit-tap').click();

  // Success messages use SnackBar component with testID
  // Verify exact success message text
  await expect(page.getByTestId('snackbar-message')).toBeVisible();
  await expect(page.getByTestId('snackbar-message')).toHaveText('Successfully edited tap');
});
