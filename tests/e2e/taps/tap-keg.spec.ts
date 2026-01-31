import { test, expect } from '../../fixtures/test-fixtures';
import { mockTapWithKeg } from '../../fixtures/entity-fixtures';

test.use({ autoAuthenticate: true });

test('should display keg information on tap', async ({ page }) => {
  // Set up explicit data: one tap with keg and beverage
  const { tap, keg, beverage } = await mockTapWithKeg(page);

  await page.goto(`/taps/${tap.id}`);
  await expect(page.getByTestId('header-tap-details')).toBeVisible();

  // Beverage name is displayed in BeverageDetailsContent component - use testID
  await expect(page.getByTestId('beverage-name')).toBeVisible();
  await expect(page.getByTestId('beverage-name')).toHaveText(beverage.name);
});

test('should show keg level visualization', async ({ page }) => {
  // Set up explicit data: one tap with keg
  const { tap } = await mockTapWithKeg(page);

  await page.goto(`/taps/${tap.id}`);
  await expect(page.getByTestId('header-tap-details')).toBeVisible();

  // Keg level section has testID - use that instead of text-based locator
  await expect(page.getByTestId('section-header-keg-level')).toBeVisible();
  await expect(page.getByTestId('keg-level-text')).toBeVisible();
});

test('should navigate to create new keg', async ({
  page,
  authenticatedUser,
}) => {
  // Set up explicit data: one tap WITHOUT keg; Edit permission so create path is valid
  const { createMockTap } = await import('../../fixtures/test-data');
  const { mockStore } = await import('../../fixtures/api-mocks');
  const { mockDeviceWithTaps } = await import('../../fixtures/entity-fixtures');
  const { setupTapPermissions } = await import('../../fixtures/test-helpers');

  if (!authenticatedUser) throw new Error('authenticatedUser required');
  const { device, location, organization } = await mockDeviceWithTaps(page, 0);

  const tap = createMockTap({
    locationId: location.id,
    deviceId: device.id,
    description: '',
    currentKeg: null as any,
  });
  mockStore.setTap(tap);
  await setupTapPermissions(authenticatedUser.user, tap, organization, [
    'Edit',
  ]);

  await page.goto(`/taps/${tap.id}/keg/new`);
  await expect(page.getByTestId('keg-form')).toBeVisible();
});
