import { test, expect } from '../../fixtures/test-fixtures';
import { seedTapWithKeg } from '../../fixtures/entity-fixtures';

test.use({ autoAuthenticate: true });

test('should display keg information on tap', async ({ page, seedApi}) => {
  // Set up explicit data: one tap with keg and beverage
  const { tap, keg, beverage } = await seedTapWithKeg(seedApi);

  await page.goto(`/taps/${tap.id}`);
  await expect(page.getByTestId('header-tap-details')).toBeVisible();

  // Beverage name is displayed in BeverageDetailsContent component - use testID
  await expect(page.getByTestId('beverage-name')).toBeVisible();
  await expect(page.getByTestId('beverage-name')).toHaveText(beverage.name);
});

test('should show keg level visualization', async ({ page, seedApi}) => {
  // Set up explicit data: one tap with keg
  const { tap } = await seedTapWithKeg(seedApi);

  await page.goto(`/taps/${tap.id}`);
  await expect(page.getByTestId('header-tap-details')).toBeVisible();

  // Keg level section has testID - use that instead of text-based locator
  await expect(page.getByTestId('section-header-keg-level')).toBeVisible();
  await expect(page.getByTestId('keg-level-text')).toBeVisible();
});

test('should navigate to create new keg', async ({
  page,
  authenticatedUser, seedApi,}) => {
  // Set up explicit data: one tap WITHOUT keg; Edit permission so create path is valid
  const { createMockTap } = await import('../../fixtures/test-data');
  const { seedDeviceWithTaps } = await import('../../fixtures/entity-fixtures');

  if (!authenticatedUser) throw new Error('authenticatedUser required');
  // A real tap with no keg (creator-grant covers edit permission)
  const { device, location } = await seedDeviceWithTaps(seedApi, 0);
  const tap = await seedApi.createTap(location, device, { description: '' });

  await page.goto(`/taps/${tap.id}/keg/new`);
  await expect(page.getByTestId('keg-form')).toBeVisible();
});
