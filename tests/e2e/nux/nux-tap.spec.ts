import { test, expect } from '../../fixtures/test-fixtures';
import { mockNewUserState } from '../../fixtures/entity-fixtures';

test('should display tap creation prompt', async ({ page, nuxPage }) => {
  // Set up explicit data: new user
  await mockNewUserState(page);
  await nuxPage.gotoTapStep();
  

  await expect(page).toHaveURL(/.*nux.*tap/i);
  // Tap text is dynamic content, so text-based locator is acceptable
  await expect(
    page.locator('text=/tap|setup|create/i'),
  ).toBeVisible();
});

test('should show tap setup instructions', async ({ page, nuxPage }) => {
  // Set up explicit data: new user
  await mockNewUserState(page);
  await nuxPage.gotoTapStep();
  

  // Instructions text is dynamic content, so text-based locator is acceptable
  await expect(
    page.locator('text=/set up|create|tap/i'),
  ).toBeVisible();
});

test('should navigate to tap creation', async ({ page, nuxPage }) => {
  // Set up explicit data: new user
  await mockNewUserState(page);
  await nuxPage.gotoTapStep();
  

  // Look for button to create tap - use role-based locator for standard button
  // Button should be visible for new users
  const createButton = page.getByRole('button', { name: /create|add/i });
  await expect(createButton).toBeVisible();
  await createButton.click();
  await expect(page).toHaveURL(/.*tap.*new|new.*tap/i);
});

test('should have continue button', async ({ page, nuxPage }) => {
  await mockNewUserState(page);
  await nuxPage.gotoTapStep();

  await expect(nuxPage.getContinueButton()).toBeVisible();
  await expect(nuxPage.getContinueButton()).toBeEnabled();
});
