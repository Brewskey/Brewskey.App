import { test, expect } from '../../fixtures/test-fixtures';

test.use({ autoAuthenticate: true });

test.describe('with a kegged beverage', () => {
  test.use({ seed: { taps: [{ keg: { srmId: 10 } }] } });

  test('should pre-fill form with existing data', async ({
    page,
    beverages,
  }) => {
    const [beverage] = beverages;

    await page.goto(`/beverages/${beverage.id}/edit`);
    await expect(page.getByTestId('input-name')).toBeVisible();

    await expect(page.getByTestId('input-name')).toHaveValue(beverage.name);
  });
});

const BEVERAGE_TYPES = [
  { label: 'Beer', optionIndex: 0 },
  { label: 'Cider', optionIndex: 1 },
  { label: 'Coffee', optionIndex: 2 },
  { label: 'Soda', optionIndex: 3 },
] as const;

test.describe('update to each Beverage Type', () => {
  for (const { label, optionIndex } of BEVERAGE_TYPES) {
    test.describe(() => {
      // For "edit to Beer": start with Cider so we can change to Beer and fill Beer-only fields.
      // For others: start with Beer (default).
      test.use({
        seed: {
          taps: [
            {
              keg:
                label === 'Beer'
                  ? { srmId: 10, beverageType: 'Cider' }
                  : { srmId: 10 },
            },
          ],
        },
      });

      test(`should successfully update beverage to type ${label}`, async ({
        page,
        dropDown,
        beverages,
      }) => {
        const [beverage] = beverages;

        await page.goto(`/beverages/${beverage.id}/edit`);
        await expect(page.getByTestId('input-name')).toBeVisible();

        await page
          .getByTestId('input-name')
          .fill(`Updated Beverage - ${label}`);
        await page
          .getByTestId('input-description')
          .fill(`Updated description (${label})`);

        // Change beverage type to target (required). SRM is pre-filled from the seed; name/description make form dirty.
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
    });
  }
});
