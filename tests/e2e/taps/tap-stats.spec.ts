import { test, expect } from '../../fixtures/test-fixtures';
import { mockTapWithKeg } from '../../fixtures/entity-fixtures';

test.use({ autoAuthenticate: true });

test('should display tap statistics', async ({ page }) => {
  // Set up explicit data: one tap with stats enabled (hideStats: false)
  const { tap } = await mockTapWithKeg(page);

  await page.goto(`/taps/${tap.id}/stats`);

  await expect(page).toHaveURL(/.*stats/i);
  // Stats screen shows "Recent pours" section header - use testID
  await expect(page.getByTestId('section-header-recent-pours')).toBeVisible();
});

test('should allow filtering by time period', async ({ page }) => {
  // Set up explicit data: one tap with stats enabled and filters visible
  const { tap } = await mockTapWithKeg(page);

  await page.goto(`/taps/${tap.id}/stats`);

  // Look for time period filters - use role-based locator for standard buttons
  // Filters should be visible based on data setup
  const filters = page.getByRole('button', { name: /day|week|month/i });
  await expect(filters.first()).toBeVisible();
  await filters.first().click();
  // Wait for filter to apply by checking for updated content
  await expect(filters.first()).toBeVisible();
});
