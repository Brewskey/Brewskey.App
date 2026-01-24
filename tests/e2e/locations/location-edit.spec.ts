import { test, expect } from '../../fixtures/test-fixtures';
import { mockLocationWithTaps } from '../../fixtures/entity-fixtures';

test.use({ autoAuthenticate: true });

test('should pre-fill form with existing data', async ({ page }) => {
  // Set up explicit data: one location
  const { location } = await mockLocationWithTaps(page, 0);

  await page.goto(`/locations/${location.id}/edit`);
  await expect(page.getByTestId('input-name')).toBeVisible();

  await expect(page.getByTestId('input-name')).toHaveValue(location.name);
});

test('should successfully update location', async ({ page }) => {
  // Set up explicit data: one location
  const { location } = await mockLocationWithTaps(page, 0);

  await page.goto(`/locations/${location.id}/edit`);
  await expect(page.getByTestId('input-name')).toBeVisible();

  // Fill all required fields: name, street, city, state, zipCode, locationType
  // Even though form is pre-filled, we update fields to test form inputs properly
  await page.getByTestId('input-name').fill('Updated Location Name');
  await page.getByTestId('input-street').fill('456 Updated St');
  await page.getByTestId('input-city').fill('Updated City');
  await page.getByTestId('input-zipCode').fill('54321');
  
  // Update locationType (required field)
  // Location type picker has options: Kegerator (index 0), Bar (index 1)
  const locationTypePicker = page.getByTestId('picker-location-type');
  await expect(locationTypePicker).toBeVisible();
  await locationTypePicker.click();
  // Select "Bar" which is at index 1
  // SimplePicker uses default mode (inline), options use testID format: {pickerTestID}-option-{index}
  await expect(page.getByTestId('picker-location-type-option-1')).toBeVisible();
  await page.getByTestId('picker-location-type-option-1').click();
  // Form state updates after dropdown closes (WebDropdown ensures dropdown is hidden before updating)
  
  // Update state (required field)
  // State picker uses STATE_LIST - California (CA) is at index 4
  const statePicker = page.getByTestId('picker-state');
  await expect(statePicker).toBeVisible();
  await statePicker.click();
  // Options use testID format: {pickerTestID}-option-{index}
  await expect(page.getByTestId('picker-state-option-4')).toBeVisible();
  await page.getByTestId('picker-state-option-4').click();
  // Form state updates after dropdown closes (WebDropdown ensures dropdown is hidden before updating)
  
  // Submit the form
  const submitButton = page.getByTestId('submit-button-edit-location');
  await expect(submitButton).toBeEnabled();
  await submitButton.click();

  // Success messages use SnackBar component with testID
  // Verify exact success message text
  await expect(page.getByTestId('snackbar-message')).toBeVisible();
  await expect(page.getByTestId('snackbar-message')).toHaveText('Location edited.');
});
