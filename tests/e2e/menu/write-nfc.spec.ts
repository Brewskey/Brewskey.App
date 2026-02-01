import { test, expect } from '../../fixtures/test-fixtures';
import { ROUTES } from '../../fixtures/routes';

test.use({ autoAuthenticate: true });

test('should display NFC setup screen', async ({ page }) => {
  // Set up explicit data: authenticated user (handled by autoAuthenticate)
  await page.goto(ROUTES.MENU_WRITE_NFC);

  await expect(page).toHaveURL(/.*nfc/i);
  // NFC screen has testID - use that instead of text-based locator
  await expect(page.getByTestId('header-write-nfc')).toBeVisible();
  await expect(page.getByTestId('write-nfc-content')).toBeVisible();
});

test('should show NFC setup instructions', async ({ page }) => {
  // Set up explicit data: authenticated user (handled by autoAuthenticate)
  await page.goto(ROUTES.MENU_WRITE_NFC);

  // Instructions text has testID - use that instead of text-based locator
  await expect(page.getByTestId('nfc-instructions-section')).toBeVisible();
  await expect(page.getByTestId('nfc-instructions-text')).toBeVisible();
});

test('should show supported cards link', async ({ page }) => {
  // Set up explicit data: authenticated user (handled by autoAuthenticate)
  await page.goto(ROUTES.MENU_WRITE_NFC);

  // Supported cards link has testID - use that instead of text-based locator
  await expect(page.getByTestId('nfc-supported-cards-link')).toBeVisible();
  await expect(page.getByTestId('nfc-supported-cards-link-text')).toBeVisible();
});
