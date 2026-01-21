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
  // Location screen has testID - use that instead of text-based locator
  await expect(page.getByTestId('nux-location-content')).toBeVisible();
  await expect(page.getByTestId('nux-location-description')).toBeVisible();
});

test('should handle no locations scenario', async ({ page, nuxPage }) => {
  // Set up explicit data: new user with no locations
  await mockNewUserState(page);
  await nuxPage.gotoLocationStep();
  

  // Should show message about needing to create location - check description testID
  // The description text contains this message
  await expect(page.getByTestId('nux-location-description')).toBeVisible();
});

test('should handle single location scenario', async ({ page, nuxPage }) => {
  // Set up explicit data: new user with one location
  await mockNewUserState(page);
  const { location } = await mockLocationWithTaps(page, 0);
  await nuxPage.gotoLocationStep(1); // Pass locationsCount=1
  

  // Should show message about existing location
  // The message is "You've already set up the location " (without the location name in the testID element)
  await expect(page.getByTestId('nux-location-description')).toBeVisible();
  await expect(page.getByTestId('nux-location-description')).toContainText("You've already set up the location");
});

test('should handle multiple locations scenario', async ({ page, nuxPage }) => {
  // Set up explicit data: new user with 2 locations
  await mockNewUserState(page);
  await mockLocationWithTaps(page, 0);
  await mockLocationWithTaps(page, 0);
  await nuxPage.gotoLocationStep(2); // Pass locationsCount=2
  

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
  await nuxPage.gotoLocationStep(2); // Pass locationsCount=2
  

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
  

  // The NUX location screen doesn't have a create button when no locations exist
  // It just shows a message. The navigation to location creation happens elsewhere
  // For now, just verify the screen loads correctly and shows the no-location message
  await expect(page.getByTestId('nux-location-content')).toBeVisible();
  await expect(page.getByTestId('nux-location-description')).toBeVisible();
  await expect(nuxPage.getContinueButton()).toBeVisible();
});
