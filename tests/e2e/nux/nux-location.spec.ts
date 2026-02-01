import {
  mockLocationWithTaps,
  mockNewUserState,
} from '../../fixtures/entity-fixtures';
import { expect, test } from '../../fixtures/test-fixtures';
test('should display location setup screen for new user', async ({
  page,
  nuxPage,
}) => {
  await mockNewUserState(page);
  await nuxPage.gotoLocationStep();
  await expect(page.getByTestId('nux-location-description')).toBeVisible({
    timeout: 15000,
  });
});

test('should handle no locations scenario', async ({ page, nuxPage }) => {
  await mockNewUserState(page);
  await nuxPage.gotoLocationStep();
  await expect(page.getByTestId('nux-location-description')).toBeVisible({
    timeout: 15000,
  });
});

test('should handle single location scenario', async ({ page, nuxPage }) => {
  await mockNewUserState(page);
  await mockLocationWithTaps(page, 0);
  await nuxPage.gotoLocationStep(1);
  await expect(page.getByTestId('nux-location-description')).toBeVisible({
    timeout: 15000,
  });
  await expect(page.getByTestId('nux-location-description')).toContainText(
    "You've already set up the location",
  );
});

test('should handle multiple locations scenario', async ({ page, nuxPage }) => {
  await mockNewUserState(page);
  await mockLocationWithTaps(page, 0);
  await mockLocationWithTaps(page, 0);
  await nuxPage.gotoLocationStep(2);
  await expect(nuxPage.getLocationPicker()).toBeVisible({ timeout: 15000 });
  await expect(nuxPage.getContinueButton()).toBeDisabled();
});

test('should enable continue button when location selected', async ({
  page,
  nuxPage,
}) => {
  await mockNewUserState(page);
  const { location } = await mockLocationWithTaps(page, 0);
  await mockLocationWithTaps(page, 0);
  await nuxPage.gotoLocationStep(2);
  await expect(nuxPage.getLocationPicker()).toBeVisible({ timeout: 15000 });
  await nuxPage.selectLocation(location.name);
  await expect(nuxPage.getContinueButton()).toBeEnabled();
});

test('should navigate to locations/new when Next is clicked with no locations', async ({
  page,
  nuxPage,
}) => {
  await mockNewUserState(page);
  await nuxPage.gotoLocationStep();
  await expect(page.getByTestId('nux-location-content')).toBeVisible({
    timeout: 15000,
  });
  // Next is enabled when hasNoLocation (allowSubmitWhenValid) or when location selected
  await expect(nuxPage.getContinueButton()).toBeEnabled({ timeout: 15000 });
  await nuxPage.getContinueButton().click();

  // With no locations, Next navigates to locations/new with returnTo=nux-wifi
  await expect(page).toHaveURL(/\/locations\/new/i);
});

test('should navigate to nux/wifi when Next is clicked with location selected', async ({
  page,
  nuxPage,
}) => {
  await mockNewUserState(page);
  const { location } = await mockLocationWithTaps(page, 0);
  await mockLocationWithTaps(page, 0);
  await nuxPage.gotoLocationStep(2);
  await expect(nuxPage.getLocationPicker()).toBeVisible({ timeout: 15000 });
  await nuxPage.selectLocation(location.name);

  await nuxPage.getContinueButton().click();

  await expect(page).toHaveURL(/\/wifi/i);
  await expect(page.getByTestId('nux-wifi-content')).toBeVisible();
});
