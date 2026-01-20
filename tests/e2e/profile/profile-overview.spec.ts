import { test, expect } from '../../fixtures/test-fixtures';

test.use({ autoAuthenticate: true });

test('should display user profile overview', async ({ page }) => {
  // Set up explicit data: authenticated user (handled by autoAuthenticate)
  await page.goto('/profile/overview');
  

  // Profile overview text is dynamic content, so text-based locator is acceptable
  await expect(
    page.locator('text=/profile|overview|stats/i'),
  ).toBeVisible();
});

test('should show stats and achievements', async ({ page }) => {
  // Set up explicit data: authenticated user (handled by autoAuthenticate)
  await page.goto('/profile/overview');
  

  // Stats and achievements text is dynamic content, so text-based locator is acceptable
  await expect(
    page.locator('text=/stats|achievements|badges/i'),
  ).toBeVisible();
});
