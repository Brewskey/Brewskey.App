import { test, expect } from '../../fixtures/test-fixtures';
import {
  mockBeverageWithPours,
  setupSrmData,
} from '../../fixtures/entity-fixtures';

test.use({ autoAuthenticate: true });

test('should pre-fill form with existing data', async ({ page }) => {
  // Set up explicit data: one beverage
  const { beverage } = await mockBeverageWithPours(page, 0);

  await page.goto(`/beverages/${beverage.id}/edit`);
  await expect(page.getByTestId('input-name')).toBeVisible();

  await expect(page.getByTestId('input-name')).toHaveValue(beverage.name);
});

const BEVERAGE_TYPES = [
  { label: 'Beer', optionIndex: 0 },
  { label: 'Cider', optionIndex: 1 },
  { label: 'Coffee', optionIndex: 2 },
  { label: 'Soda', optionIndex: 3 },
] as const;

test.describe('update to each Beverage Type', () => {
  for (const { label, optionIndex } of BEVERAGE_TYPES) {
    test(`should successfully update beverage to type ${label}`, async ({
      page,
      dropDown,
    }) => {
      // For "edit to Beer": start with Cider so we can change to Beer and fill Beer-only fields.
      // For others: start with Beer (default).
      const initialType =
        label === 'Beer' ? { beverageType: 'Cider' as const } : undefined;
      const { beverage } = await mockBeverageWithPours(
        page,
        0,
        undefined,
        undefined,
        initialType,
      );
      await setupSrmData(page, 40);

      await page.goto(`/beverages/${beverage.id}/edit`);
      await expect(page.getByTestId('input-name')).toBeVisible();

      await page.getByTestId('input-name').fill(`Updated Beverage - ${label}`);
      await page
        .getByTestId('input-description')
        .fill(`Updated description (${label})`);

      // Change beverage type to target (required). SRM is pre-filled from mock; name/description make form dirty.
      const beverageTypeDd = dropDown.create('beverage-type-dropdown');
      await beverageTypeDd.input.click();
      await beverageTypeDd.scrollToItemByIndex(optionIndex);
      await beverageTypeDd.select(optionIndex);

      // Beer-only fields (style, abv, og, ibu) are optional; we only assert Beverage Type selection here.

      const submitButton = page.getByTestId('submit-button-edit-beverage');
      await expect(submitButton).toBeEnabled();
      await submitButton.click();

      await expect(page.getByTestId('snackbar-message')).toBeVisible();
      await expect(page.getByTestId('snackbar-message')).toHaveText(
        'The beverage edited.',
      );
      await expect(page).toHaveURL(
        new RegExp(`/beverages/${beverage.id}(?:/edit)?$`),
        { timeout: 10000 },
      );
    });
  }
});
