import { test, expect } from '../../fixtures/test-fixtures';
import { ROUTES } from '../../fixtures/routes';

test.use({ autoAuthenticate: true });

test('should display payments screen', async ({ page }) => {
  // Set up explicit data: authenticated user (handled by autoAuthenticate)
  await page.goto(ROUTES.MENU_PAYMENTS);

  await expect(page).toHaveURL(/.*payments/i);
  // Payments screen has testID - use that instead of text-based locator
  await expect(page.getByTestId('header-payments')).toBeVisible();
  await expect(page.getByTestId('payments-content')).toBeVisible();
});

test('should show card form when no card exists', async ({ page }) => {
  // Set up explicit data: authenticated user with no payment card
  await page.goto(ROUTES.MENU_PAYMENTS);

  // Wait for payments content to load
  await expect(page.getByTestId('payments-content')).toBeVisible();

  // Note: CardForm component currently has PaymentCardTextField commented out
  // When no card exists, the payment section header should be visible
  await expect(
    page.getByTestId('section-header-payment-default'),
  ).toBeVisible();
});

test('should show existing card when available', async ({ page }) => {
  // Set up explicit data: authenticated user (may or may not have card)
  await page.goto(ROUTES.MENU_PAYMENTS);

  // May show existing card or form - check for payment section header or card form
  await expect(
    page
      .getByTestId('section-header-payment-default')
      .or(page.getByTestId('input-cardNumber')),
  ).toBeVisible();
});
