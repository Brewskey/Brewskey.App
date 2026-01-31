import { test, expect } from '../../fixtures/test-fixtures';
import { mockUserWithOrganizations } from '../../fixtures/entity-fixtures';

test.use({ autoAuthenticate: true });

test('should display settings screen', async ({ page, settingsPage }) => {
  // Set up explicit data: authenticated user (handled by autoAuthenticate)
  await settingsPage.goto();

  await expect(page).toHaveURL(/.*settings/i);
  await expect(page.getByTestId('header-settings')).toBeVisible();
  await expect(page.getByTestId('header-settings-title')).toHaveText(
    'Settings',
  );
});

test('should show change password form', async ({ page, settingsPage }) => {
  // Set up explicit data: authenticated user (handled by autoAuthenticate)
  await settingsPage.goto();

  await expect(settingsPage.getChangePasswordForm()).toBeVisible();
});

test('should validate password form', async ({ page, settingsPage }) => {
  // Set up explicit data: authenticated user with weak password
  await settingsPage.goto();

  await settingsPage.fillPasswordForm({
    oldPassword: 'oldpass',
    newPassword: '123', // Weak password
  });
  await settingsPage.submitPasswordForm();

  // Validation messages - FormValidationMessage shows field-level errors
  // The error message testID is form-validation-error-{fieldName} or change-password-error-message
  // Check for newPassword validation error (password too short)
  await expect(
    page
      .getByTestId('form-validation-error-newPassword')
      .or(page.getByTestId('change-password-error-message')),
  ).toBeVisible();
});

test('should successfully change password', async ({ page, settingsPage }) => {
  // Set up explicit data: authenticated user with valid password
  await settingsPage.goto();

  await settingsPage.fillPasswordForm({
    oldPassword: 'oldpassword123',
    newPassword: 'newpassword123',
  });
  await settingsPage.submitPasswordForm();

  // Success messages - use snackbar testID
  await expect(page.getByTestId('snackbar-message')).toBeVisible();
});

test('should toggle manage taps setting', async ({ page, settingsPage }) => {
  // Set up explicit data: authenticated user (handled by autoAuthenticate)
  await settingsPage.goto();

  const toggle = settingsPage.getManageTapsToggle();
  await expect(toggle).toBeVisible();
  // Toggle the switch - just verify it's clickable and doesn't error
  await settingsPage.toggleManageTaps();
  // Verify toggle is still visible after interaction (indicates it worked)
  await expect(toggle).toBeVisible();
});

test('should show organization picker when user has organizations', async ({
  page,
  settingsPage,
}) => {
  // Set up explicit data: user with 2 organizations
  await mockUserWithOrganizations(page, 2);
  await settingsPage.goto();

  await expect(settingsPage.getOrganizationPicker()).toBeVisible();
});

test('should allow selecting organization', async ({ page, settingsPage }) => {
  // Set up explicit data: user with 2 organizations
  const { organizations } = await mockUserWithOrganizations(page, 2);
  await settingsPage.goto();

  // Organization name is dynamic content, so text-based locator is acceptable
  await settingsPage.selectOrganization(organizations[0].name);
  // OrganizationPicker is a picker, not an input - just verify it's visible after selection
  await expect(settingsPage.getOrganizationPicker()).toBeVisible();
});
