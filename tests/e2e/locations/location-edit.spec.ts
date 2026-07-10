import { test, expect } from '../../fixtures/test-fixtures';
import { seedLocationWithTaps } from '../../fixtures/entity-fixtures';

test.use({ autoAuthenticate: true });

test('should pre-fill form with existing data', async ({ page, seedApi}) => {
  // Set up explicit data: one location
  const { location } = await seedLocationWithTaps(seedApi, 0);

  await page.goto(`/locations/${location.id}/edit`);
  await expect(page.getByTestId('input-name')).toBeVisible();

  await expect(page.getByTestId('input-name')).toHaveValue(location.name);
});

test('should successfully update location', async ({ page, dropDown, seedApi}) => {
  // Set up explicit data: one location
  const { location } = await seedLocationWithTaps(seedApi, 0);

  await page.goto(`/locations/${location.id}/edit`);
  await expect(page.getByTestId('input-name')).toBeVisible();

  // Mutate every form field: name, description, locationType, street, suite, city, state, zipCode
  await page.getByTestId('input-name').fill('Updated Location Name');
  await page
    .getByTestId('input-description')
    .fill('Updated location description');
  await page.getByTestId('input-street').fill('456 Updated St');
  await page.getByTestId('input-suite').fill('Apt 2B');
  await page.getByTestId('input-city').fill('Updated City');
  await page.getByTestId('input-zipCode').fill('54321');

  // Location type and state (WebDropdown uses option-{index})
  const locationTypeDd = dropDown.create('location-type-dropdown');
  await locationTypeDd.input.click();
  await locationTypeDd.scrollToItemByIndex(1);
  await locationTypeDd.select(1);

  const stateDd = dropDown.create('state-dropdown');
  await stateDd.input.click();
  await stateDd.scrollToItemByIndex(4);
  await stateDd.select(4);

  const submitButton = page.getByTestId('submit-button-edit-location');
  await expect(submitButton).toBeEnabled();
  await submitButton.click();

  await expect(page.getByTestId('snackbar-message')).toBeVisible();
  await expect(page.getByTestId('snackbar-message')).toHaveText(
    'Location edited.',
  );
});
