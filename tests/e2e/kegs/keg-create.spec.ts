import { test, expect } from '../../fixtures/test-fixtures';
import { mockTapWithKeg } from '../../fixtures/entity-fixtures';

test.use({ autoAuthenticate: true });

test('should navigate to create keg form', async ({ page }) => {
  // Set up explicit data: one tap with keg
  const { tap } = await mockTapWithKeg(page);

  await page.goto(`/taps/${tap.id}/kegs/new`);

  await expect(page).toHaveURL(/.*keg.*new|new.*keg/i);
  // Wait for form to load - check for beverage dropdown or ounces input
  const beverageDropdown = page.getByTestId('dropdown-beverageId');
  const ouncesInput = page.getByTestId('input-ouncesTotal');
  await expect(beverageDropdown.or(ouncesInput)).toBeVisible();
});

test('should allow selecting beverage', async ({ page }) => {
  // Set up explicit data: one tap with beverage available
  const { tap, beverage } = await mockTapWithKeg(page);

  await page.goto(`/taps/${tap.id}/kegs/new`);
  

  // Beverage dropdown should be visible - assert it exists, then select
  const beverageSelect = page.getByTestId('dropdown-beverageId');
  await expect(beverageSelect).toBeVisible();
  await beverageSelect.selectOption(beverage.id.toString());
});

test('should successfully create keg', async ({ page }) => {
  // Set up explicit data: one tap with beverage available (beverage dropdown should be visible)
  const { tap, beverage } = await mockTapWithKeg(page);

  await page.goto(`/taps/${tap.id}/kegs/new`);
  

  // Beverage dropdown should be visible when beverages are available
  const beverageSelect = page.getByTestId('dropdown-beverageId');
  await expect(beverageSelect).toBeVisible();
  await beverageSelect.selectOption(beverage.id.toString());

  await page.getByTestId('input-ouncesTotal').fill('1984');
  await page.getByTestId('input-ouncesRemaining').fill('1984');
  await expect(page.getByTestId('submit-button-create-keg')).toBeVisible();
  await page.getByTestId('submit-button-create-keg').click();

  // Success messages are dynamic content from API responses (SnackBar), so text-based locator is acceptable
  await expect(
    page.locator('text=/success|created|saved|updated/i'),
  ).toBeVisible();
});
