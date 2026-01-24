import { test, expect } from '../../fixtures/test-fixtures';
import { mockTapWithKeg } from '../../fixtures/entity-fixtures';

test.use({ autoAuthenticate: true });

test('should allow filtering by duration', async ({ page }) => {
  // Set up explicit data: one tap with leaderboard enabled and filters visible
  const { tap } = await mockTapWithKeg(page);

  await page.goto(`/taps/${tap.id}/leaderboard`);

  await expect(page.getByTestId('leaderboard-list')).toBeVisible();
  // LeaderboardDurationPicker has testID; verify filters are present
  await expect(page.getByTestId('leaderboard-duration-picker')).toBeVisible();
});
