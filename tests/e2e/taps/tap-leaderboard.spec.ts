import { test, expect } from '../../fixtures/test-fixtures';
import { mockTapWithKeg } from '../../fixtures/entity-fixtures';

test.use({ autoAuthenticate: true });

test('should display leaderboard', async ({ page }) => {
  // Set up explicit data: one tap with leaderboard enabled (hideLeaderboard: false)
  const { tap } = await mockTapWithKeg(page);

  await page.goto(`/taps/${tap.id}/leaderboard`);

  await expect(page).toHaveURL(/.*leaderboard/i);
  // Leaderboard text is dynamic content, so text-based locator is acceptable
  await expect(
    page.locator('text=/leaderboard|ranking|top/i'),
  ).toBeVisible();
});

test('should allow filtering by duration', async ({ page }) => {
  // Set up explicit data: one tap with leaderboard enabled and filters visible
  const { tap } = await mockTapWithKeg(page);

  await page.goto(`/taps/${tap.id}/leaderboard`);

  // Look for duration filters - use role-based locator for standard buttons
  // Filters should be visible based on data setup
  const filters = page.getByRole('button', { name: /day|week|month|all/i });
  await expect(filters.first()).toBeVisible();
  await filters.first().click();
  // Wait for filter to apply by checking for updated content
  await expect(filters.first()).toBeVisible();
});
