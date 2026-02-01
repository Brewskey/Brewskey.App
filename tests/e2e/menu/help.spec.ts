import { test, expect } from '../../fixtures/test-fixtures';
import { ROUTES } from '../../fixtures/routes';

test.use({ autoAuthenticate: true });

test('should display help screen', async ({ page }) => {
  // Set up explicit data: authenticated user (handled by autoAuthenticate)
  await page.goto(ROUTES.MENU_HELP);

  await expect(page).toHaveURL(/.*help/i);
  // Help content has testIDs - use those instead of text-based locators
  // Check for instruction text directly (more reliable than checking Section)
  await expect(page.getByTestId('help-instruction-text')).toBeVisible();
});

test('should show FAQ link', async ({ page }) => {
  // Set up explicit data: authenticated user (handled by autoAuthenticate)
  await page.goto(ROUTES.MENU_HELP);

  // FAQ link has testID - use that instead of text-based locator
  await expect(page.getByTestId('help-link-faq')).toBeVisible();
  await expect(page.getByTestId('help-link-faq-text')).toBeVisible();
});

test('should show Facebook Messenger link', async ({ page }) => {
  // Set up explicit data: authenticated user (handled by autoAuthenticate)
  await page.goto(ROUTES.MENU_HELP);

  // Messenger link has testID - use that instead of text-based locator
  await expect(page.getByTestId('help-link-messenger')).toBeVisible();
  await expect(page.getByTestId('help-link-messenger-text')).toBeVisible();
});

test('should show email link', async ({ page }) => {
  // Set up explicit data: authenticated user (handled by autoAuthenticate)
  await page.goto(ROUTES.MENU_HELP);

  // Email link has testID - use that instead of text-based locator
  await expect(page.getByTestId('help-link-email')).toBeVisible();
  await expect(page.getByTestId('help-link-email-text')).toBeVisible();
});
