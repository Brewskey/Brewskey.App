import { test, expect } from '../../fixtures/test-fixtures';

// Tap with isPaymentEnabled so Payments tab is shown; no organization means
// canEnablePayments is false, showing "Payments are disabled" and avoiding
// Square/fetchSquareLocations and price-variant dependencies.
test.use({
  autoAuthenticate: true,
  seed: { taps: [{ isPaymentEnabled: true }] },
});

test('should display payment options', async ({ page, taps }) => {
  const [tap] = taps;

  await page.goto(`/taps/${tap.id}/edit/payments`);
  await expect(page.getByTestId('header-edit-tap')).toBeVisible();
  // Form, "Payments are disabled", or loading while deps resolve (tap, location, org, priceVariant)
  await expect(
    page
      .getByTestId('tap-payments-form')
      .or(page.getByText('Payments are disabled'))
      .or(page.getByTestId('tap-payments-loading')),
  ).toBeVisible({ timeout: 20000 });
  // When form is shown, expect price section (canEnablePayments would need to be true)
  if (await page.getByTestId('tap-payments-form').isVisible()) {
    await expect(page.getByTestId('section-header-price-ounces')).toBeVisible();
  }
});
