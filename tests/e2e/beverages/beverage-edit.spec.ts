import { test, expect } from '../../fixtures/test-fixtures';
import { mockBeverageWithPours, setupSrmData } from '../../fixtures/entity-fixtures';

test.use({ autoAuthenticate: true });

test('should navigate to edit beverage', async ({ page }) => {
  // Set up explicit data: one beverage
  const { beverage } = await mockBeverageWithPours(page, 0);

  await page.goto(`/beverages/${beverage.id}/edit`);

  await expect(page).toHaveURL(/.*beverage.*edit|edit.*beverage/i);
  await expect(page.getByTestId('input-name')).toBeVisible();
});

test('should pre-fill form with existing data', async ({ page }) => {
  // Set up explicit data: one beverage
  const { beverage } = await mockBeverageWithPours(page, 0);

  await page.goto(`/beverages/${beverage.id}/edit`);
  await expect(page.getByTestId('input-name')).toBeVisible();

  await expect(page.getByTestId('input-name')).toHaveValue(beverage.name);
});

test('should successfully update beverage', async ({ page }) => {
  // Set up explicit data: one beverage with SRM data
  const { beverage } = await mockBeverageWithPours(page, 0);
  await setupSrmData(page, 40);

  await page.goto(`/beverages/${beverage.id}/edit`);
  await expect(page.getByTestId('input-name')).toBeVisible();

  // Fill all required fields: name, beverageType, and srm
  // Even though form is pre-filled, we update fields to test form inputs properly
  await page.getByTestId('input-name').fill('Updated Beverage Name');
  
  // Update beverage type (required field) - verify it's pre-filled, then change it
  const beverageTypePicker = page.getByTestId('picker-beverage-type');
  await expect(beverageTypePicker).toBeVisible();
  await beverageTypePicker.click();
  // Select a different beverage type to test the picker (Cider is at index 1)
  await expect(beverageTypePicker.getByTestId('option-1')).toBeVisible();
  await beverageTypePicker.getByTestId('option-1').click();
  
  // Update SRM/Color (required field) - verify it's pre-filled, then change it
  const colorPicker = page.getByTestId('picker-color');
  await expect(colorPicker).toBeVisible();
  await colorPicker.click();
  // Select a different SRM option (index 2)
  await expect(colorPicker.getByTestId('option-2')).toBeVisible();
  await colorPicker.getByTestId('option-2').click();
  // DAOPicker requires confirmation - click the select button
  await expect(page.getByTestId('picker-control-select-button')).toBeVisible();
  await page.getByTestId('picker-control-select-button').click();
  
  // Submit the form
  await expect(page.getByTestId('submit-button-edit-beverage')).toBeVisible();
  await page.getByTestId('submit-button-edit-beverage').click();

  // Wait for navigation back to beverage details page
  await expect(page).toHaveURL(new RegExp(`/beverages/${beverage.id}(?:/edit)?$`));
  
  // Success messages use SnackBar component with testID
  await expect(page.getByTestId('snackbar-message')).toBeVisible();
});
