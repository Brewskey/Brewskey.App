import { test, expect } from '../../fixtures/test-fixtures';
import { mockTapWithKeg } from '../../fixtures/entity-fixtures';

test.use({ autoAuthenticate: true });

test('should display keg information on tap', async ({ page }) => {
  // Set up explicit data: one tap with keg and beverage
  const { tap, keg, beverage } = await mockTapWithKeg(page);

  await page.goto(`/taps/${tap.id}`);
  await expect(page.getByTestId('header-tap-details')).toBeVisible();

  // Beverage name is dynamic content (user-generated), so text-based locator is acceptable
  await expect(page.locator(`text=${beverage.name}`)).toBeVisible();
});

test('should show keg level visualization', async ({ page }) => {
  // Set up explicit data: one tap with keg
  const { tap } = await mockTapWithKeg(page);

  await page.goto(`/taps/${tap.id}`);
  await expect(page.getByTestId('header-tap-details')).toBeVisible();

  // Keg level text is dynamic content, so text-based locator is acceptable
  await expect(
    page.locator('text=/level|remaining|ounces/i'),
  ).toBeVisible();
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
