import { test, expect } from '../../fixtures/test-fixtures';
import { mockLocationWithTaps } from '../../fixtures/entity-fixtures';

test.use({ autoAuthenticate: true });

test('should navigate to edit location', async ({ page }) => {
  // Set up explicit data: one location
  const { location } = await mockLocationWithTaps(page, 0);

  await page.goto(`/locations/${location.id}/edit`);

  await expect(page).toHaveURL(/.*location.*edit|edit.*location/i);
  await expect(page.getByTestId('input-name')).toBeVisible();
});

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
  await expect(locationTypePicker.getByTestId('option-1')).toBeVisible();
  await locationTypePicker.getByTestId('option-1').click();
  
  // Update state (required field)
  // State picker uses STATE_LIST - California (CA) is at index 4
  const statePicker = page.getByTestId('picker-state');
  await expect(statePicker).toBeVisible();
  await statePicker.click();
  await expect(statePicker.getByTestId('option-4')).toBeVisible();
  await statePicker.getByTestId('option-4').click();
  
  // Submit the form
  await expect(page.getByTestId('submit-button-edit-location')).toBeVisible();
  await page.getByTestId('submit-button-edit-location').click();

  // Success messages use SnackBar component with testID
  await expect(page.getByTestId('snackbar-message')).toBeVisible();
});
