import { test, expect } from '../../fixtures/test-fixtures';

test.use({ autoAuthenticate: true });

test('should validate required fields', async ({ page }) => {
  // Set up explicit data: authenticated user (handled by autoAuthenticate)
  await page.goto('/devices/new');
  await expect(page.getByTestId('input-name')).toBeVisible();

  // Clear name field to make form invalid (name is required)
  await page.getByTestId('input-name').clear();

  // Button should be disabled when form is invalid (missing required fields)
  // This IS the validation - disabled button prevents submission of invalid form
  const submitButton = page.getByTestId('submit-button-create-device');
  await expect(submitButton).toBeVisible();
  await expect(submitButton).toBeDisabled();

  // Form validation also shows errors via FormValidationMessage when fields are touched
  // But since button is disabled, user can't submit invalid form
});

test('should successfully create device', async ({
  page,
  devicePage,
  dropDown,
}) => {
  // Set up explicit data: authenticated user (handled by autoAuthenticate)
  // Need location for device creation
  const { mockLocationWithTaps } =
    await import('../../fixtures/entity-fixtures');
  const { location } = await mockLocationWithTaps(page, 0);

  await page.goto('/devices/new');
  await expect(page.getByTestId('input-name')).toBeVisible();

  await devicePage.fillDeviceForm({
    name: 'New Device',
    particleId: 'particle_12345',
  });

  // Select location (required field) - one location from mock, use index 0
  const locationPicker = dropDown.create('location-dropdown');
  await locationPicker.select(0);
  await expect(locationPicker.modal).not.toBeVisible();

  // Wait for form to become valid (submit button enabled) after location selection
  // Form re-validation after dropdown close can take a moment
  const submitButton = page.getByTestId('submit-button-create-device');
  await expect(submitButton).toBeEnabled({ timeout: 15000 });
  await submitButton.scrollIntoViewIfNeeded();
  await submitButton.click();

  // Wait for navigation to device details page
  await expect(page).toHaveURL(/.*devices\/\d+/i);

  // Success messages use SnackBar component with testID
  // Verify exact success message text
  await expect(page.getByTestId('snackbar-message')).toBeVisible();
  await expect(page.getByTestId('snackbar-message')).toHaveText(
    'New Brewskey box created',
  );
});
