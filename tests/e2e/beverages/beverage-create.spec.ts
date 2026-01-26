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

const BEVERAGE_TYPES = [
  { label: 'Beer', optionIndex: 0 },
  { label: 'Cider', optionIndex: 1 },
  { label: 'Coffee', optionIndex: 2 },
  { label: 'Soda', optionIndex: 3 },
] as const;

test.describe('create with each Beverage Type', () => {
  for (const { label, optionIndex } of BEVERAGE_TYPES) {
    test(`should successfully create beverage with type ${label}`, async ({ page, menuPage, dropDown }) => {
      await setupSrmData(page, 40);

      await menuPage.goto();
      await menuPage.clickBeverages();
      await page.getByTestId('header-add-button').click();

      await expect(page.getByTestId('input-name')).toBeVisible();

      await page.getByTestId('input-name').fill(`New Beverage - ${label}`);
      await page.getByTestId('input-description').fill(`A new test beverage (${label})`);

      const beverageTypeDd = dropDown.create('picker-beverage-type');
      await beverageTypeDd.input.click();
      await beverageTypeDd.scrollToItemByIndex(optionIndex);
      await beverageTypeDd.select(optionIndex);

      const colorDd = dropDown.create('picker-color');
      await colorDd.input.click();
      await expect(colorDd.search).toBeVisible();
      await colorDd.select(0);

      // Beer-only fields (style, abv, og, ibu) are optional; we only assert Beverage Type selection here.

      const submitButton = page.getByTestId('submit-button-create-beverage');
      await expect(submitButton).toBeEnabled();
      await submitButton.click();

      await expect(page).toHaveURL(/.*beverages\/\d+/, { timeout: 10000 });
      await expect(page.getByTestId('snackbar-message')).toBeVisible({ timeout: 10000 });
      await expect(page.getByTestId('snackbar-message')).toHaveText('New beverage created.');
    });
  }
});
