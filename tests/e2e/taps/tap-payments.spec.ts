import { test, expect } from '../../fixtures/test-fixtures';
import { mockTapWithKeg } from '../../fixtures/entity-fixtures';

test.use({ autoAuthenticate: true });

test('should display payment options', async ({ page }) => {
  // Set up explicit data: tap with payments enabled; org.canEnablePayments; Payments tab visible
  const { tap, organization } = await mockTapWithKeg(page);
  const { mockStore } = await import('../../fixtures/api-mocks');
  mockStore.setOrganization({ ...organization, canEnablePayments: true });
  mockStore.setTap({ ...tap, isPaymentEnabled: true });

  await page.goto(`/taps/${tap.id}/edit/payments`);
  await expect(page.getByTestId('header-edit-tap')).toBeVisible();
  await expect(page.getByTestId('tap-payments-form')).toBeVisible();
  await expect(page.getByTestId('section-header-price-ounces')).toBeVisible();
});
