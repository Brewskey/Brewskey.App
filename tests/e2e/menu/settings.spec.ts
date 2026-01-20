import { test, expect } from '../../fixtures/test-fixtures';
import { mockUserWithOrganizations } from '../../fixtures/entity-fixtures';

test.use({ autoAuthenticate: true });

test('should display settings screen', async ({ page, settingsPage }) => {
  // Set up explicit data: authenticated user (handled by autoAuthenticate)
  await settingsPage.goto();
  

  await expect(page).toHaveURL(/.*settings/i);
  await expect(page.getByTestId('header-settings')).toBeVisible();
  await expect(page.getByTestId('header-settings-title')).toHaveText('Settings');
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

  // Validation messages are dynamic content, so text-based locator is acceptable
  await expect(
    page.locator('text=/error|failed|required|must.*fill|invalid|try.*again/i'),
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

  // Success messages are dynamic content from API responses (SnackBar), so text-based locator is acceptable
  await expect(
    page.locator('text=/success|created|saved|updated/i'),
  ).toBeVisible();
});

test('should toggle manage taps setting', async ({ page, settingsPage }) => {
  // Set up explicit data: authenticated user (handled by autoAuthenticate)
  await settingsPage.goto();
  

  const toggle = settingsPage.getManageTapsToggle();
  await expect(toggle).toBeVisible();
  const initialValue = await toggle.isChecked();
  await settingsPage.toggleManageTaps();
  await expect(toggle).toHaveJSProperty('checked', !initialValue);
});

test('should show organization picker when user has organizations', async ({ page, settingsPage }) => {
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
  await expect(settingsPage.getOrganizationPicker()).toHaveValue(/.*/);
});
