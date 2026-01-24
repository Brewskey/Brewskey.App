import { test, expect } from '../../fixtures/test-fixtures';
import { mockTapWithKeg } from '../../fixtures/entity-fixtures';

test.use({ autoAuthenticate: true });

test('should successfully update keg', async ({ page }) => {
  // Set up explicit data: one tap with keg
  const { tap } = await mockTapWithKeg(page);

  // Keg editing is done through tap feed edit route: /taps/{tapId}/edit/feed
  // Use route path without (tabs) prefix - Expo Router handles routing
  await page.goto(`/taps/${tap.id}/edit/feed`);
  
  // Wait for edit layout to load first
  await expect(page.getByTestId('header-edit-tap')).toBeVisible();
  // EditTapFeedRoute shows loading indicator while fetching keg
  // Wait for form to appear after loading completes
  await expect(page.getByTestId('keg-form')).toBeVisible({ timeout: 10000 });
  
  // KegForm uses KegLevelSliderField for adjusting keg level
  // The slider adjusts the startingPercentage which affects ounces
  // For this test, we'll verify the form is interactive and can be submitted
  // The form should be valid (pre-filled with existing keg data)
  
  // Submit the form - button should be enabled if form is dirty
  // For edit forms, the button requires isDirty=true AND isValid=true
  // Since the form is pre-filled, we need to make it dirty by interacting with a field
  // KegForm always has KegLevelSliderField when editing a keg - interact with slider to make form dirty
  const slider = page.locator('[role="slider"]').first();
  await expect(slider).toBeVisible();
  
  // Get slider bounding box and click to change value (makes form dirty)
  const sliderBox = await slider.boundingBox();
  if (sliderBox) {
    // Click near the end to change the value and make form dirty
    await slider.click({ position: { x: sliderBox.width * 0.95, y: sliderBox.height / 2 } });
  } else {
    // If bounding box is null, click the slider directly
    await slider.click();
  }
  
  const submitButton = page.getByTestId('submit-button-update-current-keg');
  await expect(submitButton).toBeEnabled();
  await submitButton.click();

  // Success messages use SnackBar component with testID
  await expect(page.getByTestId('snackbar-message')).toBeVisible();
  await expect(page.getByTestId('snackbar-message')).toHaveText('Current keg updated');
});
