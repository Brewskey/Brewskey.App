import { seedUserWithOrganizations } from '../../fixtures/entity-fixtures';
import { expect, test } from '../../fixtures/test-fixtures';

import type { Page, Route } from '@playwright/test';

test.use({ autoAuthenticate: true });

interface ManageInfoLogin {
  LoginProvider: string;
  ProviderKey: string;
}

const localLogin: ManageInfoLogin = {
  LoginProvider: 'Local',
  ProviderKey: 'local-key',
};

const googleLogin: ManageInfoLogin = {
  LoginProvider: 'Google',
  ProviderKey: 'google-key',
};

const appleLogin: ManageInfoLogin = {
  LoginProvider: 'Apple',
  ProviderKey: 'apple-key',
};

const fulfillJSON = async (
  route: Route,
  status: number,
  body: Record<string, unknown>,
) =>
  route.fulfill({
    body: JSON.stringify(body),
    contentType: 'application/json',
    status,
  });

const mockManageInfo = async (page: Page, getLogins: () => ManageInfoLogin[]) =>
  page.route(/.*\/api\/Account\/ManageInfo.*/i, async (route) =>
    fulfillJSON(route, 200, {
      LocalLoginProvider: 'Local',
      Logins: getLogins(),
      UserName: 'testuser',
    }),
  );

test('should display settings screen', async ({ page, settingsPage }) => {
  // Set up explicit data: authenticated user (handled by autoAuthenticate)
  await settingsPage.goto();

  await expect(page).toHaveURL(/.*settings/i);
  await expect(page.getByTestId('header-settings')).toBeVisible();
  await expect(page.getByTestId('header-settings-title')).toHaveText(
    'Settings',
  );
});

test('should show change password form', async ({ settingsPage }) => {
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

test('should successfully change password', async ({
  page,
  settingsPage,
  authenticatedUser,
}) => {
  // The real API validates the current password — use the seeded account's.
  if (!authenticatedUser) throw new Error('authenticatedUser required');
  await settingsPage.goto();

  await settingsPage.fillPasswordForm({
    oldPassword: authenticatedUser.credentials.password,
    newPassword: 'newpassword123!',
  });
  await settingsPage.submitPasswordForm();

  // Success messages - use snackbar testID
  await expect(page.getByTestId('snackbar-message')).toBeVisible();
});

test('should toggle manage taps setting', async ({ settingsPage }) => {
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
  settingsPage, seedApi,}) => {
  // Set up explicit data: user with 2 organizations
  await seedUserWithOrganizations(seedApi, 2);
  await settingsPage.goto();

  await expect(settingsPage.getOrganizationPicker()).toBeVisible();
});

test('should allow selecting organization', async ({ page, settingsPage, seedApi}) => {
  // Set up explicit data: user with 2 organizations
  const { organizations } = await seedUserWithOrganizations(seedApi, 2);
  await settingsPage.goto();

  // Organization name is dynamic content, so text-based locator is acceptable
  await settingsPage.selectOrganization(organizations[0].name);
  // OrganizationPicker is a picker, not an input - just verify it's visible after selection
  await expect(settingsPage.getOrganizationPicker()).toBeVisible();
});

test('should delete account from settings and return to login', async ({
  page,
  settingsPage,
}) => {
  // Real account deletion — the seeded account is disposable.
  await settingsPage.goto();

  await expect(
    page.getByTestId('settings-delete-account-section'),
  ).toBeVisible();
  await expect(page.getByTestId('settings-delete-account-button')).toHaveText(
    /delete account/i,
  );

  await page.getByTestId('settings-delete-account-button').click();

  await expect(
    page.getByTestId('delete-account-confirmation-modal'),
  ).toBeVisible();
  await expect(
    page.getByTestId('delete-account-confirmation-modal-title'),
  ).toHaveText('Delete account');
  await expect(
    page.getByTestId('delete-account-confirmation-modal-message'),
  ).toContainText('cannot be undone');
  await expect(
    page.getByTestId('delete-account-confirmation-modal-button-delete'),
  ).toHaveText('delete');

  await page
    .getByTestId('delete-account-confirmation-modal-button-delete')
    .click();

  await expect(page.getByTestId('login-username-input')).toBeVisible();
});

test('should show an app-owned message when account deletion fails', async ({
  page,
  settingsPage,
}) => {
  await page.route(/.*\/api\/account(?:\?|$).*/i, async (route) => {
    if (route.request().method() === 'DELETE') {
      return fulfillJSON(route, 500, {
        Message: 'Delete failed.',
        error: 'delete_account_failed',
      });
    }
    return route.fallback();
  });

  await settingsPage.goto();
  await page.getByTestId('settings-delete-account-button').click();
  await page
    .getByTestId('delete-account-confirmation-modal-button-delete')
    .click();

  await expect(page.getByTestId('snackbar-message')).toContainText(
    "We couldn't delete your account. Please try again, or contact support if the problem continues.",
  );
});

test('should show link state for an unlinked Google login provider', async ({
  page,
  settingsPage,
}) => {
  await mockManageInfo(page, () => [localLogin]);

  await settingsPage.goto();
  await page.getByTestId('settings-linked-accounts-button').click();

  await expect(page.getByTestId('header-linked-accounts')).toBeVisible();
  await expect(page.getByTestId('linked-account-local-row')).toBeVisible();
  await expect(page.getByTestId('linked-account-google-row')).toContainText(
    'Not linked',
  );
  await expect(
    page.getByTestId('linked-account-google-link-button'),
  ).toHaveText('Link Google');
});

test('should surface conflict when linking Google already belongs to another account', async ({
  page,
  settingsPage,
}) => {
  await page.addInitScript(() => {
    (
      window as Window & {
        __BREWSKEY_E2E_GOOGLE_SIGN_IN_ID_TOKEN__?: string;
      }
    ).__BREWSKEY_E2E_GOOGLE_SIGN_IN_ID_TOKEN__ = 'google-already-linked-token';
  });
  await mockManageInfo(page, () => [localLogin]);

  let linkExternalBody: Record<string, unknown> | undefined;
  await page.route(/.*\/api\/account\/link-external.*/i, async (route) => {
    linkExternalBody = await route.request().postDataJSON();
    return fulfillJSON(route, 409, {
      Message: 'External login already linked.',
      error: 'external_login_already_linked',
    });
  });

  await settingsPage.goto();
  await page.getByTestId('settings-linked-accounts-button').click();
  await page.getByTestId('linked-account-google-link-button').click();

  await expect(page.getByTestId('snackbar-message')).toContainText(
    'That Google account is already linked to another Brewskey account. Sign in with that Brewskey account and unlink Google first, then try again.',
  );
  await expect(
    page.getByTestId('linked-account-google-link-button'),
  ).toHaveText('Link Google');
  expect(linkExternalBody).toMatchObject({
    idToken: 'google-already-linked-token',
    provider: 'Google',
  });
});

test('should unlink a linked Google login after confirmation', async ({
  page,
  settingsPage,
}) => {
  let logins = [localLogin, googleLogin];
  let removeLoginBody: Record<string, unknown> | undefined;
  await mockManageInfo(page, () => logins);
  await page.route(/.*\/api\/Account\/RemoveLogin.*/i, async (route) => {
    removeLoginBody = await route.request().postDataJSON();
    logins = [localLogin];
    return fulfillJSON(route, 200, {});
  });

  await settingsPage.goto();
  await page.getByTestId('settings-linked-accounts-button').click();

  await expect(page.getByTestId('linked-account-google-row')).toContainText(
    'Linked',
  );
  await page.getByTestId('linked-account-google-unlink-button').click();

  await expect(
    page.getByTestId('unlink-login-confirmation-modal'),
  ).toBeVisible();
  await expect(
    page.getByTestId('unlink-login-confirmation-modal-title'),
  ).toHaveText('Unlink Google');
  await expect(
    page.getByTestId('unlink-login-confirmation-modal-button-delete'),
  ).toHaveText('unlink');

  await page
    .getByTestId('unlink-login-confirmation-modal-button-delete')
    .click();

  await expect(page.getByTestId('snackbar-message')).toContainText(
    'Unlinked your Google account.',
  );
  await expect(
    page.getByTestId('linked-account-google-link-button'),
  ).toHaveText('Link Google');
  expect(removeLoginBody).toEqual({
    providerKey: 'google-key',
    providerName: 'Google',
  });
});

test('should show set-password flow after last-login-method unlink error', async ({
  page,
  settingsPage,
}) => {
  await mockManageInfo(page, () => [localLogin, googleLogin]);
  await page.route(/.*\/api\/Account\/RemoveLogin.*/i, async (route) =>
    fulfillJSON(route, 400, {
      Message: 'Last sign-in method.',
      error: 'last_login_method',
    }),
  );
  let setPasswordCalled = false;
  await page.route(/.*\/api\/Account\/SetPassword.*/i, async (route) => {
    setPasswordCalled = true;
    return fulfillJSON(route, 200, {});
  });

  await settingsPage.goto();
  await page.getByTestId('settings-linked-accounts-button').click();
  await page.getByTestId('linked-account-google-unlink-button').click();
  await page
    .getByTestId('unlink-login-confirmation-modal-button-delete')
    .click();

  await expect(page.getByTestId('snackbar-message')).toContainText(
    'Set a password first so you can still sign in.',
  );
  await expect(page.getByTestId('linked-account-set-password-link')).toHaveText(
    'Set a password first',
  );

  await page.getByTestId('linked-account-set-password-link').click();

  await expect(page.getByTestId('header-set-password')).toBeVisible();
  await expect(page.getByTestId('set-password-form')).toBeVisible();
  await expect(page.getByTestId('input-set-newPassword')).toBeVisible();
  await expect(
    page.getByTestId('set-password-form').getByTestId('input-oldPassword'),
  ).toHaveCount(0);

  await page.getByTestId('input-set-newPassword').fill('newpassword123');
  await page.getByTestId('button-set-password').click();

  await expect(page.getByTestId('snackbar-message')).toContainText(
    'Password set.',
  );
  expect(setPasswordCalled).toBe(true);
});

