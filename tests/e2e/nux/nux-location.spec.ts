import { test, expect } from '../../fixtures/test-fixtures';
import {
  mockNewUserState,
  mockLocationWithTaps,
} from '../../fixtures/entity-fixtures';

test('should display location setup screen for new user', async ({ page, nuxPage }) => {
  // Set up explicit data: new user with no locations
  await mockNewUserState(page);
  await nuxPage.gotoLocationStep();
  

  await expect(page).toHaveURL(/.*nux.*location/i);
  // Setup text is dynamic content, so text-based locator is acceptable
  await expect(
    page.locator('text=/setup.*location|location.*setup/i'),
  ).toBeVisible();
});

test('should handle no locations scenario', async ({ page, nuxPage }) => {
  // Set up explicit data: new user with no locations
  await mockNewUserState(page);
  await nuxPage.gotoLocationStep();
  

  // Should show message about needing to create location - dynamic content
  await expect(
    page.locator('text=/set up.*location|create.*location/i'),
  ).toBeVisible();
});

test('should handle single location scenario', async ({ page, nuxPage }) => {
  // Set up explicit data: new user with one location
  await mockNewUserState(page);
  const { location } = await mockLocationWithTaps(page, 0);
  await nuxPage.gotoLocationStep();
  

  // Should show message about existing location - location name is dynamic content
  await expect(
    page.locator(`text=${location.name}`),
  ).toBeVisible();
});

test('should handle multiple locations scenario', async ({ page, nuxPage }) => {
  // Set up explicit data: new user with 2 locations
  await mockNewUserState(page);
  await mockLocationWithTaps(page, 0);
  await mockLocationWithTaps(page, 0);
  await nuxPage.gotoLocationStep();
  

  // Should show location picker
  await expect(nuxPage.getLocationPicker()).toBeVisible();
  // Continue button should be disabled until location is selected
  await expect(nuxPage.getContinueButton()).toBeDisabled();
});

test('should enable continue button when location selected', async ({ page, nuxPage }) => {
  // Set up explicit data: new user with 2 locations
  await mockNewUserState(page);
  const { location } = await mockLocationWithTaps(page, 0);
  await mockLocationWithTaps(page, 0);
  await nuxPage.gotoLocationStep();
  

  // Location picker should be visible with multiple locations
  await expect(nuxPage.getLocationPicker()).toBeVisible();
  
  // Select location - location name is dynamic content, so text-based locator is acceptable
  await nuxPage.selectLocation(location.name);
  await expect(nuxPage.getContinueButton()).toBeEnabled();
});

test('should navigate to location creation if needed', async ({ page, nuxPage }) => {
  // Set up explicit data: new user with no locations
  await mockNewUserState(page);
  await nuxPage.gotoLocationStep();
  

  // Look for button/link to create location - use role-based locator for standard button
  // Button should be visible when no locations exist
  const createButton = page.getByRole('button', { name: /create|add/i });
  await expect(createButton).toBeVisible();
  await createButton.click();
  await expect(page).toHaveURL(/.*location.*new|new.*location/i);
});
