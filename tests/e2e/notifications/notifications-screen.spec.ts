import { test, expect } from '../../fixtures/test-fixtures';

test.use({ autoAuthenticate: true });

test('should display notifications screen', async ({ page }) => {
  // Set up explicit data: authenticated user (handled by autoAuthenticate)
  await page.goto('/notifications');

  await expect(page).toHaveURL(/.*notifications/i);
  
  
  // Notifications text is dynamic content, so text-based locator is acceptable
  await expect(
    page.locator('text=/notifications/i'),
  ).toBeVisible();
});

test('should show delete all button', async ({ page }) => {
  // Set up explicit data: authenticated user (handled by autoAuthenticate)
  await page.goto('/notifications');
  

  // Use role-based locator for delete button (standard UI element)
  const deleteButton = page.getByRole('button', { name: /delete/i }).or(
    page.locator('button[aria-label*="delete" i]')
  );
  await expect(deleteButton.first()).toBeVisible();
});

test('should show delete all modal', async ({ page }) => {
  // Set up explicit data: authenticated user (handled by autoAuthenticate)
  await page.goto('/notifications');
  

  // Delete button should be visible
  const deleteButton = page.getByRole('button', { name: /delete/i }).or(
    page.locator('button[aria-label*="delete" i]')
  );
  await expect(deleteButton.first()).toBeVisible();
  await deleteButton.first().click();
  
  // Modal confirmation text is dynamic content, so text-based locator is acceptable
  await expect(
    page.locator('text=/clear.*all|delete.*all|confirm/i'),
  ).toBeVisible();
});

test('should allow canceling delete', async ({ page }) => {
  // Set up explicit data: authenticated user (handled by autoAuthenticate)
  await page.goto('/notifications');
  

  // Delete button should be visible
  const deleteButton = page.getByRole('button', { name: /delete/i }).or(
    page.locator('button[aria-label*="delete" i]')
  );
  await expect(deleteButton.first()).toBeVisible();
  await deleteButton.first().click();
  
  // Cancel button should be visible in modal
  const cancelButton = page.getByRole('button', { name: /cancel/i });
  await expect(cancelButton).toBeVisible();
  await cancelButton.click();
  
  // Modal should be dismissed
  await expect(
    page.locator('text=/clear.*all|delete.*all/i'),
  ).not.toBeVisible();
});

test('should allow confirming delete all', async ({ page }) => {
  // Set up explicit data: authenticated user (handled by autoAuthenticate)
  await page.goto('/notifications');
  

  // Delete button should be visible
  const deleteButton = page.getByRole('button', { name: /delete/i }).or(
    page.locator('button[aria-label*="delete" i]')
  );
  await expect(deleteButton.first()).toBeVisible();
  await deleteButton.first().click();
  
  // Confirm button should be visible in modal
  const confirmButton = page.getByRole('button', { name: /clear|delete/i });
  await expect(confirmButton).toBeVisible();
  await confirmButton.click();
  
  // Success message is dynamic content, so text-based locator is acceptable
  await expect(
    page.locator('text=/cleared|deleted|success/i'),
  ).toBeVisible();
});
