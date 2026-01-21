import { test, expect } from '../../fixtures/test-fixtures';
import { mockTapWithKeg } from '../../fixtures/entity-fixtures';

test.use({ autoAuthenticate: true });

test('should navigate to tap payments screen', async ({ page }) => {
  // Set up explicit data: one tap with payments enabled
  const { tap } = await mockTapWithKeg(page);

  // Payments screen is under edit route
  await page.goto(`/taps/${tap.id}/edit/payments`);

  await expect(page).toHaveURL(/.*payments/i);
});

test('should display payment options', async ({ page }) => {
  // Set up explicit data: one tap with payments enabled
  const { tap } = await mockTapWithKeg(page);

  // Payments screen is under edit route
  await page.goto(`/taps/${tap.id}/edit/payments`);

  // Payment form should be visible - use testID
  await expect(page.getByTestId('tap-payments-form')).toBeVisible();
  // Check for price/ounces section header
  await expect(page.getByTestId('section-header-price-ounces')).toBeVisible();
});
