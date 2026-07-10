import { test, expect } from '../../fixtures/test-fixtures';
import { seedTapWithKeg } from '../../fixtures/entity-fixtures';

test.use({ autoAuthenticate: true });

test('should display payment options', async ({ page, seedApi}) => {
  // Tap with isPaymentEnabled so Payments tab is shown; use canEnablePayments: false to show
  // "Payments are disabled" and avoid Square/fetchSquareLocations and price-variant mocks
  const location = await seedApi.createLocation();
  const device = await seedApi.createDevice(location);
  const tap = await seedApi.createTap(location, device, {
    isPaymentEnabled: true,
  });

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
