import { test, expect } from '../../fixtures/test-fixtures';

// One kegged tap; seeded taps default to hideLeaderboard = false so the
// leaderboard and its filters are visible.
test.use({ autoAuthenticate: true, seed: { taps: [{ keg: true }] } });

test('should allow filtering by duration', async ({ page, taps }) => {
  const [tap] = taps;

  await page.goto(`/taps/${tap.id}/leaderboard`);

  await expect(page.getByTestId('leaderboard-list')).toBeVisible();
  // LeaderboardDurationPicker has testID; verify filters are present
  await expect(page.getByTestId('leaderboard-duration-dropdown')).toBeVisible();
});
