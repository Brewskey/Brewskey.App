import { test, expect } from '../../fixtures/test-fixtures';

test.use({ autoAuthenticate: true });

test('should display NFC setup screen', async ({ page }) => {
  // Set up explicit data: authenticated user (handled by autoAuthenticate)
  await page.goto('/write-nfc');
  

  await expect(page).toHaveURL(/.*nfc/i);
  // NFC text is dynamic content, so text-based locator is acceptable
  await expect(
    page.locator('text=/nfc|card|setup/i'),
  ).toBeVisible();
});

test('should show NFC setup instructions', async ({ page }) => {
  // Set up explicit data: authenticated user (handled by autoAuthenticate)
  await page.goto('/write-nfc');
  

  // Instructions text is dynamic content, so text-based locator is acceptable
  await expect(
    page.locator('text=/instructions|setup|tap/i'),
  ).toBeVisible();
});

test('should show supported cards link', async ({ page }) => {
  // Set up explicit data: authenticated user (handled by autoAuthenticate)
  await page.goto('/write-nfc');
  

  // Supported cards link text is dynamic content, so text-based locator is acceptable
  const supportedLink = page.getByRole('link', { name: /supported/i }).or(
    page.locator('text=/supported.*cards/i')
  );
  await expect(supportedLink.first()).toBeVisible();
});
