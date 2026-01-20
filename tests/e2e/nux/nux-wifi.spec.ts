import { test, expect } from '../../fixtures/test-fixtures';
import { mockNewUserState } from '../../fixtures/entity-fixtures';

test('should display WiFi setup instructions', async ({ page, nuxPage }) => {
  // Set up explicit data: new user
  await mockNewUserState(page);
  await nuxPage.gotoWifiStep();
  

  await expect(page).toHaveURL(/.*nux.*wifi/i);
  // WiFi text is dynamic content, so text-based locator is acceptable
  await expect(
    page.locator('text=/wifi|wi-fi|wireless/i'),
  ).toBeVisible();
});

test('should navigate to WiFi setup screen', async ({ page, nuxPage }) => {
  // Set up explicit data: new user
  await mockNewUserState(page);
  await nuxPage.gotoWifiStep();
  

  // Look for button to start WiFi setup - use role-based locator for standard button
  // Button should be visible for new users
  const setupButton = page.getByRole('button', { name: /setup|configure/i });
  await expect(setupButton).toBeVisible();
  await setupButton.click();
  await expect(page).toHaveURL(/.*wifi.*setup/i);
});

test('should have continue button', async ({ page, nuxPage }) => {
  // Set up explicit data: new user
  await mockNewUserState(page);
  await nuxPage.gotoWifiStep();
  

  await expect(nuxPage.getContinueButton()).toBeVisible();
  await expect(nuxPage.getContinueButton()).toBeEnabled();
});
