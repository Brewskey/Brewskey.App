import { test, expect } from '../../fixtures/test-fixtures';
import { seedTapWithKeg } from '../../fixtures/entity-fixtures';

test.use({ autoAuthenticate: true });

test('should display keg information', async ({ page, seedApi}) => {
  // Set up explicit data: one tap with keg - keg details are shown in a modal
  const { tap, keg, beverage } = await seedTapWithKeg(seedApi);

  // Navigate to tap details page which shows kegs list
  // Route format: /taps/[tapId] redirects to /taps/[tapId]/on_tap
  await page.goto(`/taps/${tap.id}`);

  // Wait for tap details page to load - check for header or "On Tap" tab
  const header = page.getByTestId('header-tap-details');
  const onTapTab = page.getByRole('tab', { name: /on tap/i });
  await expect(header.or(onTapTab).first()).toBeVisible();

  // Click on the keg in the list to open the modal
  await page.getByTestId(`keg-item-${keg.id}`).click();

  // Wait for keg modal to open
  await expect(page.getByTestId('keg-modal')).toBeVisible();

  // Beverage name is displayed in BeverageDetailsContent component - use testID
  // Scope to modal content to avoid strict mode violation (beverage name appears in both tap details and modal)
  const modalContent = page.getByTestId('keg-modal-content');
  await expect(modalContent.getByTestId('beverage-name')).toBeVisible();
  await expect(modalContent.getByTestId('beverage-name')).toHaveText(
    beverage.name,
  );
});

test('should show pour history', async ({ page, seedApi}) => {
  // Set up explicit data: one tap with keg - keg details are shown in a modal
  const { tap, keg } = await seedTapWithKeg(seedApi);

  // Navigate to tap details page which shows kegs list
  // Route format: /taps/[tapId] redirects to /taps/[tapId]/on_tap
  await page.goto(`/taps/${tap.id}`);

  // Wait for tap details page to load - check for header or "On Tap" tab
  const header = page.getByTestId('header-tap-details');
  const onTapTab = page.getByRole('tab', { name: /on tap/i });
  await expect(header.or(onTapTab).first()).toBeVisible();

  // Click on the keg in the list to open the modal
  await page.getByTestId(`keg-item-${keg.id}`).click();

  // Wait for keg modal to open
  await expect(page.getByTestId('keg-modal')).toBeVisible();

  // Pour history tab should be visible - KegDetailsContent has "Pours" tab
  // Use testID for the tab button
  await expect(page.getByTestId('keg-details-tab-pours')).toBeVisible();
});

test('should show keg level visualization', async ({ page, seedApi}) => {
  // Set up explicit data: one tap with keg - keg details are shown in a modal
  const { tap, keg } = await seedTapWithKeg(seedApi);

  // Navigate to tap details page which shows kegs list
  // Route format: /taps/[tapId] redirects to /taps/[tapId]/on_tap
  await page.goto(`/taps/${tap.id}`);

  // Wait for tap details page to load - check for header or "On Tap" tab
  const header = page.getByTestId('header-tap-details');
  const onTapTab = page.getByRole('tab', { name: /on tap/i });
  await expect(header.or(onTapTab).first()).toBeVisible();

  // Click on the keg in the list to open the modal
  await page.getByTestId(`keg-item-${keg.id}`).click();

  // Wait for keg modal to open
  await expect(page.getByTestId('keg-modal')).toBeVisible();

  // Keg level is displayed in OverviewItem with title "Keg Level" - use testID
  // OverviewItem displays keg level as a percentage
  const kegLevelItem = page.getByTestId('overview-item-keg-level');
  await expect(kegLevelItem).toBeVisible();
});
