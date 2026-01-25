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

  // Mutate every form field: name, description, locationType, street, suite, city, state, zipCode
  await page.getByTestId('input-name').fill('Updated Location Name');
  await page.getByTestId('input-description').fill('Updated location description');
  await page.getByTestId('input-street').fill('456 Updated St');
  await page.getByTestId('input-suite').fill('Apt 2B');
  await page.getByTestId('input-city').fill('Updated City');
  await page.getByTestId('input-zipCode').fill('54321');

  // Scope options to picker modals (WebDropdown uses option-{index})
  const locationTypePicker = page.getByTestId('picker-location-type');
  await locationTypePicker.click();
  const locationTypeModal = page.getByTestId('picker-location-type-modal');
  await expect(locationTypeModal.getByTestId('option-1')).toBeVisible();
  await locationTypeModal.getByTestId('option-1').click();

  const statePicker = page.getByTestId('picker-state');
  await statePicker.click();
  const stateModal = page.getByTestId('picker-state-modal');
  await expect(stateModal.getByTestId('option-4')).toBeVisible();
  await stateModal.getByTestId('option-4').click();

  const submitButton = page.getByTestId('submit-button-edit-location');
  await expect(submitButton).toBeEnabled();
  await submitButton.click();

  await expect(page.getByTestId('snackbar-message')).toBeVisible();
  await expect(page.getByTestId('snackbar-message')).toHaveText('Location edited.');
});
