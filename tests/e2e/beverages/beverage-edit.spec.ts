import { test, expect } from '../../fixtures/test-fixtures';
import { mockBeverageWithPours, setupSrmData } from '../../fixtures/entity-fixtures';

test.use({ autoAuthenticate: true });

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
  // SimplePicker uses default mode (inline), options appear in a positioned container
  // Options use testID format: {pickerTestID}-option-{index}
  await expect(page.getByTestId('picker-beverage-type-option-1')).toBeVisible();
  await page.getByTestId('picker-beverage-type-option-1').click();
  
  // Update SRM/Color (required field) - verify it's pre-filled, then change it
  const colorPicker = page.getByTestId('picker-color');
  await expect(colorPicker).toBeVisible();
  await colorPicker.click();
  // Select a different SRM option (index 2)
  // SrmPicker uses default mode (inline) with search enabled, options use testID format: {pickerTestID}-option-{index}
  // Wait for the color picker's search input to be visible (unique to this picker) to ensure dropdown is open
  await expect(page.getByTestId('picker-color-search')).toBeVisible();
  // Now wait for option-2 to be available (setupSrmData creates 40 SRMs, so index 2 should exist)
  await expect(page.getByTestId('picker-color-option-2')).toBeVisible();
  await page.getByTestId('picker-color-option-2').click();
  // In default mode, selection is confirmed immediately (no confirmation button needed)
  // Form state updates after dropdown closes (WebDropdown ensures dropdown is hidden before updating)
  
  // Submit the form
  const submitButton = page.getByTestId('submit-button-edit-beverage');
  await expect(submitButton).toBeEnabled();
  await submitButton.click();

  // Success messages use SnackBar component with testID
  // Verify exact success message text (appears before navigation)
  await expect(page.getByTestId('snackbar-message')).toBeVisible();
  await expect(page.getByTestId('snackbar-message')).toHaveText('The beverage edited.');
  
  // Wait for navigation back to beverage details page (happens after snackbar)
  await expect(page).toHaveURL(new RegExp(`/beverages/${beverage.id}(?:/edit)?$`), { timeout: 10000 });
});
