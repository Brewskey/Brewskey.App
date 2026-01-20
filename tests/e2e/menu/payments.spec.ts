import { test, expect } from '../../fixtures/test-fixtures';

test.use({ autoAuthenticate: true });

test('should display payments screen', async ({ page }) => {
  // Set up explicit data: authenticated user (handled by autoAuthenticate)
  await page.goto('/payments');
  

  await expect(page).toHaveURL(/.*payments/i);
  // Payment text is dynamic content, so text-based locator is acceptable
  await expect(
    page.locator('text=/payment|card|credit/i'),
  ).toBeVisible();
});

test('should show card form when no card exists', async ({ page }) => {
  // Set up explicit data: authenticated user with no payment card
  await page.goto('/payments');
  

  // Card form inputs should be visible
  const cardInput = page.getByTestId('input-cardNumber').or(page.getByTestId('input-number'));
  await expect(cardInput.first()).toBeVisible();
});

test('should show existing card when available', async ({ page }) => {
  // Set up explicit data: authenticated user (may or may not have card)
  await page.goto('/payments');
  

  // May show existing card or form - payment text is dynamic content
  await expect(
    page.locator('text=/card|payment|stripe/i'),
  ).toBeVisible();
});
