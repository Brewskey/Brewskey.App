import { test, expect } from '../../fixtures/test-fixtures';

test.use({ autoAuthenticate: true });

test('should navigate to create device form', async ({ page }) => {
  // Set up explicit data: authenticated user (handled by autoAuthenticate)
  await page.goto('/devices/new');

  await expect(page).toHaveURL(/.*device.*new|new.*device/i);
  await expect(page.getByTestId('input-name')).toBeVisible();
});

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

test('should successfully create device', async ({ page, devicePage }) => {
  // Set up explicit data: authenticated user (handled by autoAuthenticate)
  // Need location for device creation
  const { mockLocationWithTaps } = await import('../../fixtures/entity-fixtures');
  const { location } = await mockLocationWithTaps(page, 0);
  
  await page.goto('/devices/new');
  await expect(page.getByTestId('input-name')).toBeVisible();
  
  await devicePage.fillDeviceForm({
    name: 'New Device',
    particleId: 'particle_12345',
  });
  
  // Select location (required field) - LocationPicker opens a modal when clicked
  // PickerInput has testID: picker-location (from LocationPicker component)
  await page.getByTestId('picker-location').click();
  
  // Wait for modal to open - Modal testID is {testID}-modal
  await expect(page.getByTestId('picker-location-modal')).toBeVisible();
  
  // Click on the location item using testID
  const locationItem = page.getByTestId(`location-item-${location.id}`);
  await expect(locationItem).toBeVisible();
  await locationItem.click();
  
  // Click the Select button to confirm selection and close modal
  await page.getByTestId('picker-control-select-button').click();
  
  // Wait for modal to close
  await expect(page.getByTestId('picker-location-modal')).not.toBeVisible();
  
  // Scroll to ensure submit button is visible and clickable
  await page.getByTestId('submit-button-create-device').scrollIntoViewIfNeeded();
  await devicePage.submitForm();

  // Wait for navigation to device details page
  await expect(page).toHaveURL(/.*devices\/\d+/i);
  
  // Success messages use SnackBar component with testID
  await expect(page.getByTestId('snackbar-message')).toBeVisible();
});
