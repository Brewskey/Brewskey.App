import { test, expect } from '../../fixtures/test-fixtures';

test.use({ autoAuthenticate: true });

test.describe('with a kegged tap', () => {
  test.use({ seed: { taps: [{ keg: true }] } });

  test('should display keg information on tap', async ({
    page,
    taps,
    beverages,
  }) => {
    const [tap] = taps;
    const [beverage] = beverages;

    await page.goto(`/taps/${tap.id}`);
    await expect(page.getByTestId('header-tap-details')).toBeVisible();

    // Beverage name is displayed in BeverageDetailsContent component - use testID
    await expect(page.getByTestId('beverage-name')).toBeVisible();
    await expect(page.getByTestId('beverage-name')).toHaveText(beverage.name);
  });

  test('should show keg level visualization', async ({ page, taps }) => {
    const [tap] = taps;

    await page.goto(`/taps/${tap.id}`);
    await expect(page.getByTestId('header-tap-details')).toBeVisible();

    // Keg level section has testID - use that instead of text-based locator
    await expect(page.getByTestId('section-header-keg-level')).toBeVisible();
    await expect(page.getByTestId('keg-level-text')).toBeVisible();
  });
});

test.describe('with a kegless tap', () => {
  // A real tap with no keg; the creator-grant covers edit permission so the
  // create-keg path is valid.
  test.use({ seed: { taps: [{ description: '' }] } });

  test('should navigate to create new keg', async ({ page, taps }) => {
    const [tap] = taps;

    await page.goto(`/taps/${tap.id}/keg/new`);
    await expect(page.getByTestId('keg-form')).toBeVisible();
  });
});
