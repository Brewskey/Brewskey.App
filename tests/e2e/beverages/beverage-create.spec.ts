import { test, expect } from '../../fixtures/test-fixtures';
import { setupSrmData } from '../../fixtures/entity-fixtures';

test.use({ autoAuthenticate: true });

test('should navigate to create beverage form', async ({ page, menuPage }) => {
  // Set up explicit data: authenticated user (handled by autoAuthenticate)
  // Navigate through menu to beverages, then click the add button
  await menuPage.goto();
  await menuPage.clickBeverages();
  
  // Click the add button in the header to navigate to new beverage screen
  await page.getByTestId('header-add-button').click();

  await expect(page.getByTestId('input-name')).toBeVisible();
});

test('should validate required fields', async ({ page, menuPage }) => {
  // Set up explicit data: authenticated user (handled by autoAuthenticate)
  // Navigate through menu to beverages, then click the add button
  await menuPage.goto();
  await menuPage.clickBeverages();
  await page.getByTestId('header-add-button').click();
  
  await expect(page.getByTestId('input-name')).toBeVisible();

  // Submit button should be visible but disabled when form is invalid
  // Button is disabled when !isValid || !isDirty || isSubmitting
  // Form requires: name, beverageType, and srm to be valid
  const submitButton = page.getByTestId('submit-button-create-beverage');
  await expect(submitButton).toBeVisible();
  await expect(submitButton).toBeDisabled();

  // Verify that required fields are present (form structure validation)
  // The button being disabled indicates validation is working
  // We don't need to check for error messages since they only appear after submission attempt
});

test('should successfully create beverage', async ({ page, menuPage }) => {
  // Set up explicit data: SRMs for the picker
  await setupSrmData(page, 40);
  
  // Navigate through menu to beverages, then click the add button
  await menuPage.goto();
  await menuPage.clickBeverages();
  await page.getByTestId('header-add-button').click();
  
  await expect(page.getByTestId('input-name')).toBeVisible();

  // Fill required fields: name, beverageType, and srm
  await page.getByTestId('input-name').fill('New Beverage');
  
  // Select beverage type (required field)
  // SimplePicker opens a modal when clicked - use testID for picker
  // Wait for the picker to be visible (it may take a moment to render)
  const beverageTypePicker = page.getByTestId('picker-beverage-type');
  await expect(beverageTypePicker).toBeVisible();
  await beverageTypePicker.click();
  // Wait for modal to be visible - SimplePicker uses mode="modal"
  // Modal has testID "{picker-testID}-modal", options are "option-{index}"
  // Use chained locators to scope to the specific modal
  await expect(page.getByTestId('picker-beverage-type-modal').getByTestId('option-0')).toBeVisible();
  // Click the "Beer" option using testID (first option, index 0)
  await page.getByTestId('picker-beverage-type-modal').getByTestId('option-0').click();
  
  // Select SRM/Color (required field)
  // SrmPicker uses DAOPicker with label "Color" (from FormField)
  const colorPicker = page.getByTestId('picker-color');
  await expect(colorPicker).toBeVisible();
  await colorPicker.click();
  // Wait for SRM picker modal to appear and SRM list to load
  await expect(page.getByTestId('picker-color-modal')).toBeVisible();
  await expect(page.getByTestId('picker-color-modal').getByTestId('option-0')).toBeVisible();
  // Click first SRM option using testID (index 0)
  await page.getByTestId('picker-color-modal').getByTestId('option-0').click();
  // DAOPicker requires confirmation - click the select button using testID
  await expect(page.getByTestId('picker-control-select-button')).toBeVisible();
  await page.getByTestId('picker-control-select-button').click();
  // Wait for modal to close after selection
  await expect(page.getByTestId('picker-color')).toBeVisible();

  // Now button should be enabled (all required fields filled)
  // Wait for form validation to update
  const submitButton = page.getByTestId('submit-button-create-beverage');
  await expect(submitButton).toBeEnabled();
  await submitButton.click();

  // Success messages are displayed in SnackBar with testID
  await expect(page.getByTestId('snackbar-message')).toBeVisible();
});
