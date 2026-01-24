import { test, expect } from '../../fixtures/test-fixtures';
import { setupSrmData } from '../../fixtures/entity-fixtures';

test.use({ autoAuthenticate: true });

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
  // SimplePicker uses default mode (inline), options appear after clicking
  const beverageTypePicker = page.getByTestId('picker-beverage-type');
  await expect(beverageTypePicker).toBeVisible();
  await beverageTypePicker.click();
  // Options appear in a positioned container (sibling to picker, not child)
  // Wait for dropdown to open and options to be visible
  // Options use testID format: {pickerTestID}-option-{index}
  await expect(page.getByTestId('picker-beverage-type-option-0')).toBeVisible();
  // Click the "Beer" option using testID (first option, index 0)
  await page.getByTestId('picker-beverage-type-option-0').click();
  
  // Select SRM/Color (required field)
  // SrmPicker uses default mode (inline) with search enabled, options appear at page level
  const colorPicker = page.getByTestId('picker-color');
  await expect(colorPicker).toBeVisible();
  await colorPicker.click();
  // Wait for the color picker's search input to be visible (unique to this picker) to ensure dropdown is open
  await expect(page.getByTestId('picker-color-search')).toBeVisible();
  // Wait for first SRM option to appear (options use testID format: {pickerTestID}-option-{index})
  await expect(page.getByTestId('picker-color-option-0')).toBeVisible();
  // Click first SRM option using testID (index 0)
  await page.getByTestId('picker-color-option-0').click();
  // In default mode, selection is confirmed immediately (no confirmation button needed)
  // Form state updates after dropdown closes (WebDropdown ensures dropdown is hidden before updating)

  // Now button should be enabled (all required fields filled)
  // Form state updates after dropdown is hidden
  const submitButton = page.getByTestId('submit-button-create-beverage');
  await expect(submitButton).toBeEnabled();
  await submitButton.click();

  // Success messages are displayed in SnackBar with testID
  // The snackbar appears after navigation to the beverage details page
  // Wait for navigation to complete first, then check for snackbar
  await expect(page).toHaveURL(/.*beverages\/\d+/, { timeout: 10000 });
  // Snackbar appears after navigation, so wait for it on the new page
  await expect(page.getByTestId('snackbar-message')).toBeVisible({ timeout: 10000 });
  await expect(page.getByTestId('snackbar-message')).toHaveText('New beverage created.');
});
