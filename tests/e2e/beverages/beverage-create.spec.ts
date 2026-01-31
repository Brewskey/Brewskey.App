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

  // Verify required fields are present (name, beverage type, color/SRM)
  await expect(page.getByTestId('input-name')).toBeVisible();
  await expect(page.getByTestId('beverage-type-dropdown')).toBeVisible();
  await expect(page.getByTestId('color-dropdown')).toBeVisible();

  // Submit with empty required fields: custom validate() should set errors and prevent navigation
  const submitButton = page.getByTestId('submit-button-create-beverage');
  await expect(submitButton).toBeVisible();
  await submitButton.click();

  // Should still be on create screen (form visible; no navigation to detail)
  await expect(page.getByTestId('input-name')).toBeVisible();
  await expect(page.getByTestId('submit-button-create-beverage')).toBeVisible();
});

const BEVERAGE_TYPES = [
  { label: 'Beer', optionIndex: 0 },
  { label: 'Cider', optionIndex: 1 },
  { label: 'Coffee', optionIndex: 2 },
  { label: 'Soda', optionIndex: 3 },
] as const;

test.describe('create with each Beverage Type', () => {
  for (const { label, optionIndex } of BEVERAGE_TYPES) {
    test(`should successfully create beverage with type ${label}`, async ({
      page,
      menuPage,
      dropDown,
    }) => {
      await setupSrmData(page, 40);

      await menuPage.goto();
      await menuPage.clickBeverages();
      await page.getByTestId('header-add-button').click();

      await expect(page.getByTestId('input-name')).toBeVisible();

      await page.getByTestId('input-name').fill(`New Beverage - ${label}`);
      await page
        .getByTestId('input-description')
        .fill(`A new test beverage (${label})`);

      const beverageTypeDd = dropDown.create('beverage-type-dropdown');
      await beverageTypeDd.input.click();
      await beverageTypeDd.scrollToItemByIndex(optionIndex);
      await beverageTypeDd.select(optionIndex);

      const colorDd = dropDown.create('color-dropdown');
      await colorDd.input.click();
      await expect(colorDd.search).toBeVisible();
      await colorDd.select(0);

      // Beer-only fields (style, abv, og, ibu) are optional; we only assert Beverage Type selection here.

      const submitButton = page.getByTestId('submit-button-create-beverage');
      await expect(submitButton).toBeEnabled();
      await submitButton.click();

      await expect(page).toHaveURL(/.*beverages\/\d+/, { timeout: 10000 });
      await expect(page.getByTestId('snackbar-message')).toBeVisible({
        timeout: 10000,
      });
      await expect(page.getByTestId('snackbar-message')).toHaveText(
        'New beverage created.',
      );
    });
  }
});
