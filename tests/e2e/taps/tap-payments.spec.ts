import { test, expect } from '../../fixtures/test-fixtures';
import { mockTapWithKeg } from '../../fixtures/entity-fixtures';

test.use({ autoAuthenticate: true });

test('should navigate to tap payments screen', async ({ page }) => {
  // Set up explicit data: one tap with payments enabled
  const { tap } = await mockTapWithKeg(page);

  await page.goto(`/taps/${tap.id}/payments`);

  await expect(page).toHaveURL(/.*payments/i);
});

test('should display payment options', async ({ page }) => {
  // Set up explicit data: one tap with payments enabled
  const { tap } = await mockTapWithKeg(page);

  await page.goto(`/taps/${tap.id}/payments`);

  // Payment text is dynamic content, so text-based locator is acceptable
  await expect(
    page.locator('text=/payment|pay|card/i'),
  ).toBeVisible();
});
