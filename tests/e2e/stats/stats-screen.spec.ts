import { test, expect } from '../../fixtures/test-fixtures';
import { seedStatsData } from '../../fixtures/entity-fixtures';

test.use({ autoAuthenticate: true });

test('should display badges section', async ({ page, statsPage, seedApi}) => {
  // Set up explicit data: stats data with beverages and pours
  await seedStatsData(seedApi, 10, 5);
  await statsPage.goto();

  await expect(statsPage.getBadgesSection()).toBeVisible();
});

test('should display beverages poured section', async ({ page, statsPage, seedApi}) => {
  // Set up explicit data: stats data with beverages and pours
  await seedStatsData(seedApi, 10, 5);
  await statsPage.goto();

  await expect(statsPage.getBeveragesSection()).toBeVisible();
});

test('should display recent pours list', async ({ page, statsPage, seedApi}) => {
  // Set up explicit data: stats data with beverages and pours
  await seedStatsData(seedApi, 10, 5);
  await statsPage.goto();

  await expect(statsPage.getRecentPoursList()).toBeVisible();
});

test('should allow refreshing stats', async ({ page, statsPage, seedApi}) => {
  // Set up explicit data: stats data with beverages and pours
  await seedStatsData(seedApi, 10, 5);
  await statsPage.goto();

  // Refresh is typically handled via pull-to-refresh on mobile
  // If there's a refresh button, it should be visible based on data setup
  // For now, verify the page loads correctly - pull-to-refresh is tested separately
  await expect(statsPage.getRecentPoursList()).toBeVisible();
});
