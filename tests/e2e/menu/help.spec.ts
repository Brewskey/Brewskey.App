import { test, expect } from '../../fixtures/test-fixtures';

test.use({ autoAuthenticate: true });

test('should display help screen', async ({ page }) => {
  // Set up explicit data: authenticated user (handled by autoAuthenticate)
  await page.goto('/help');
  

  await expect(page).toHaveURL(/.*help/i);
  // Help text is dynamic content, so text-based locator is acceptable
  await expect(
    page.locator('text=/help|faq|support/i'),
  ).toBeVisible();
});

test('should show FAQ link', async ({ page }) => {
  // Set up explicit data: authenticated user (handled by autoAuthenticate)
  await page.goto('/help');
  

  // FAQ link text is dynamic content, so text-based locator is acceptable
  const faqLink = page.getByRole('link', { name: /faq/i }).or(page.locator('text=/faq/i'));
  await expect(faqLink.first()).toBeVisible();
});

test('should show Facebook Messenger link', async ({ page }) => {
  // Set up explicit data: authenticated user (handled by autoAuthenticate)
  await page.goto('/help');
  

  // Messenger link text is dynamic content, so text-based locator is acceptable
  const messengerLink = page.getByRole('link', { name: /messenger/i }).or(page.locator('text=/messenger/i'));
  await expect(messengerLink.first()).toBeVisible();
});

test('should show email link', async ({ page }) => {
  // Set up explicit data: authenticated user (handled by autoAuthenticate)
  await page.goto('/help');
  

  // Email link text is dynamic content, so text-based locator is acceptable
  const emailLink = page.getByRole('link', { name: /email/i }).or(page.locator('text=/email/i'));
  await expect(emailLink.first()).toBeVisible();
});
