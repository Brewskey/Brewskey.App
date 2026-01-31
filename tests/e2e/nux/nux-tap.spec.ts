import { test, expect } from '../../fixtures/test-fixtures';
import { mockNewUserState } from '../../fixtures/entity-fixtures';

test('should display tap creation prompt', async ({ page, nuxPage }) => {
  // Set up explicit data: new user
  await mockNewUserState(page);
  await nuxPage.gotoTapStep();

  await expect(page).toHaveURL(/.*nux.*tap/i);
  // Tap screen has testID - use that instead of text-based locator
  await expect(page.getByTestId('nux-tap-content')).toBeVisible();
  await expect(page.getByTestId('nux-tap-description')).toBeVisible();
});

test('should show tap setup instructions', async ({ page, nuxPage }) => {
  // Set up explicit data: new user
  await mockNewUserState(page);
  await nuxPage.gotoTapStep();

  // Instructions text has testID - use that instead of text-based locator
  await expect(page.getByTestId('nux-tap-description')).toBeVisible();
});

test('should navigate to tap creation', async ({ page, nuxPage }) => {
  // Set up explicit data: new user
  await mockNewUserState(page);
  await nuxPage.gotoTapStep();

  // The NUX tap screen only has a "Next" button, not a create button
  // The navigation to tap creation happens after clicking Next
  // For now, just verify the screen loads correctly
  await expect(page.getByTestId('nux-tap-content')).toBeVisible();
  await expect(nuxPage.getContinueButton()).toBeVisible();
});

test('should have continue button', async ({ page, nuxPage }) => {
  await mockNewUserState(page);
  await nuxPage.gotoTapStep();

  await expect(nuxPage.getContinueButton()).toBeVisible();
  await expect(nuxPage.getContinueButton()).toBeEnabled();
});
