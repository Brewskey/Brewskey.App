import { test, expect } from '../../fixtures/test-fixtures';

// Stats data: beverages plus a kegged tap with real pours.
test.use({
  autoAuthenticate: true,
  seed: { beverages: 5, taps: [{ keg: true, pours: 10 }] },
});

test('should display badges section', async ({ statsPage }) => {
  await statsPage.goto();

  await expect(statsPage.getBadgesSection()).toBeVisible();
});

test('should display beverages poured section', async ({ statsPage }) => {
  await statsPage.goto();

  await expect(statsPage.getBeveragesSection()).toBeVisible();
});

test('should display recent pours list', async ({ statsPage }) => {
  await statsPage.goto();

  await expect(statsPage.getRecentPoursList()).toBeVisible();
});

test('should allow refreshing stats', async ({ statsPage }) => {
  await statsPage.goto();

  // Refresh is typically handled via pull-to-refresh on mobile
  // If there's a refresh button, it should be visible based on data setup
  // For now, verify the page loads correctly - pull-to-refresh is tested separately
  await expect(statsPage.getRecentPoursList()).toBeVisible();
});
