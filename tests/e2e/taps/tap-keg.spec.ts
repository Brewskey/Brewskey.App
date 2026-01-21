import { test, expect } from '../../fixtures/test-fixtures';
import { mockTapWithKeg } from '../../fixtures/entity-fixtures';

test.use({ autoAuthenticate: true });

test('should display keg information on tap', async ({ page }) => {
  // Set up explicit data: one tap with keg and beverage
  const { tap, keg, beverage } = await mockTapWithKeg(page);

  await page.goto(`/taps/${tap.id}`);
  await expect(page.getByTestId('header-tap-details')).toBeVisible();

  // Beverage name is displayed in BeverageDetailsContent component - use testID
  await expect(page.getByTestId('beverage-name')).toBeVisible();
  await expect(page.getByTestId('beverage-name')).toHaveText(beverage.name);
});

test('should show keg level visualization', async ({ page }) => {
  // Set up explicit data: one tap with keg
  const { tap } = await mockTapWithKeg(page);

  await page.goto(`/taps/${tap.id}`);
  await expect(page.getByTestId('header-tap-details')).toBeVisible();

  // Keg level section has testID - use that instead of text-based locator
  await expect(page.getByTestId('section-header-keg-level')).toBeVisible();
  await expect(page.getByTestId('keg-level-text')).toBeVisible();
});

test('should navigate to create new keg', async ({ page }) => {
  // Set up explicit data: one tap with keg (create button should be visible)
  const { tap } = await mockTapWithKeg(page);

  await page.goto(`/taps/${tap.id}`);
  await expect(page.getByTestId('header-tap-details')).toBeVisible();

  // Use role-based locator for create button (standard UI element)
  // Button should be visible based on data setup - assert it exists
  const createButton = page.getByRole('button', { name: /new.*keg|create.*keg/i });
  await expect(createButton).toBeVisible();
  await createButton.click();
  await expect(page).toHaveURL(/.*keg.*new|new.*keg/i);
});
