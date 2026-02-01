import { test, expect } from '../../fixtures/test-fixtures';
import { ROUTES } from '../../fixtures/routes';

test.use({ autoAuthenticate: true });

test('should show delete all button', async ({ page }) => {
  // Set up explicit data: authenticated user (handled by autoAuthenticate)
  await page.goto(ROUTES.NOTIFICATIONS);

  // Delete button has testID - use that instead of role-based locator
  await expect(
    page.getByTestId('button-delete-all-notifications'),
  ).toBeVisible();
});

test('should show delete all modal', async ({ page }) => {
  // Set up explicit data: authenticated user (handled by autoAuthenticate)
  await page.goto(ROUTES.NOTIFICATIONS);

  // Delete button has testID - use that instead of role-based locator
  const deleteButton = page.getByTestId('button-delete-all-notifications');
  await expect(deleteButton).toBeVisible();
  await deleteButton.click();

  // Modal should be visible - use testID
  await expect(
    page.getByTestId('modal-delete-all-notifications'),
  ).toBeVisible();
  await expect(
    page.getByTestId('modal-delete-all-notifications-title'),
  ).toBeVisible();
});

test('should allow canceling delete', async ({ page }) => {
  // Set up explicit data: authenticated user (handled by autoAuthenticate)
  await page.goto(ROUTES.NOTIFICATIONS);

  // Delete button has testID - use that instead of role-based locator
  const deleteButton = page.getByTestId('button-delete-all-notifications');
  await expect(deleteButton).toBeVisible();
  await deleteButton.click();

  // Cancel button should be visible in modal - use testID with modal prefix
  await expect(
    page.getByTestId('modal-delete-all-notifications-button-cancel'),
  ).toBeVisible();
  await page
    .getByTestId('modal-delete-all-notifications-button-cancel')
    .click();

  // Modal should be dismissed
  await expect(
    page.getByTestId('modal-delete-all-notifications'),
  ).not.toBeVisible();
});

test('should allow confirming delete all', async ({ page }) => {
  // Set up explicit data: authenticated user (handled by autoAuthenticate)
  await page.goto(ROUTES.NOTIFICATIONS);

  // Delete button has testID - use that instead of role-based locator
  const deleteButton = page.getByTestId('button-delete-all-notifications');
  await expect(deleteButton).toBeVisible();
  await deleteButton.click();

  // Confirm button should be visible in modal - use testID with modal prefix
  await expect(
    page.getByTestId('modal-delete-all-notifications-button-delete'),
  ).toBeVisible();
  await page
    .getByTestId('modal-delete-all-notifications-button-delete')
    .click();

  // Modal should be dismissed after confirmation
  // Note: NotificationsStore.deleteAllNotifications() is commented out, so no snackbar appears
  await expect(
    page.getByTestId('modal-delete-all-notifications'),
  ).not.toBeVisible();
});
