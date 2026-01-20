import { test, expect } from '../../fixtures/test-fixtures';
import { mockTapWithKeg } from '../../fixtures/entity-fixtures';

test.use({ autoAuthenticate: true });

test('should display keg information', async ({ page }) => {
  // Set up explicit data: one keg with beverage
  const { keg, beverage } = await mockTapWithKeg(page);

  await page.goto(`/kegs/${keg.id}`);
  

  // Beverage name is dynamic content (user-generated), so text-based locator is acceptable
  await expect(page.locator(`text=${beverage.name}`)).toBeVisible();
});

test('should show pour history', async ({ page }) => {
  // Set up explicit data: one keg (pour history may be empty or populated)
  const { keg } = await mockTapWithKeg(page);

  await page.goto(`/kegs/${keg.id}`);
  

  // Pour history text is dynamic content, so text-based locator is acceptable
  await expect(
    page.locator('text=/pour.*history|recent.*pours/i'),
  ).toBeVisible();
});

test('should show keg level visualization', async ({ page }) => {
  // Set up explicit data: one keg with ounces remaining
  const { keg } = await mockTapWithKeg(page);

  await page.goto(`/kegs/${keg.id}`);
  

  // Keg level text is dynamic content, so text-based locator is acceptable
  await expect(
    page.locator('text=/level|remaining|ounces/i'),
  ).toBeVisible();
});
