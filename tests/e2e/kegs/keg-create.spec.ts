import { test, expect } from '../../fixtures/test-fixtures';

test.use({ autoAuthenticate: true, seed: { taps: [{ keg: true }] } });

test('should allow selecting beverage', async ({ page, dropDown, taps }) => {
  const [tap] = taps;

  // Route is /taps/{tapId}/keg/new (singular "keg", not "kegs")
  await page.goto(`/(tabs)/taps/${tap.id}/keg/new`);

  // KegForm uses BeveragePicker2 with name="beverage"
  // Beverage dropdown: testID convention beverage-dropdown
  const beveragePicker = dropDown.create('beverage-dropdown');
  await expect(beveragePicker.input).toBeVisible();
  await beveragePicker.select(0);
  await expect(beveragePicker.modal).toBeHidden();
});

test('should render beverage picker with images', async ({
  page,
  dropDown,
  taps,
  beverages,
}) => {
  const [tap] = taps;
  const [beverage] = beverages;

  // Navigate to keg creation form
  await page.goto(`/(tabs)/taps/${tap.id}/keg/new`);

  // Wait for form to load
  await expect(page.getByTestId('keg-form')).toBeVisible();

  // Open beverage picker
  const beveragePicker = dropDown.create('beverage-dropdown');
  await expect(beveragePicker.input).toBeVisible();
  await beveragePicker.input.click();
  const beverageRow = beveragePicker.getItemByIndex(0);
  await expect(beverageRow).toBeVisible();

  // Verify the beverage name is displayed
  await expect(beverageRow.getByText(beverage.name)).toBeVisible();

  // Verify an image element is present in the beverage row
  // BeverageAvatar renders an Image component (expo-image) which becomes an <img> tag on web
  // Check for image element within the beverage row
  const beverageImage = beverageRow.getByTestId('beverage-avatar');
  await expect(beverageImage.first()).toBeVisible();

  // Select the beverage
  await beverageRow.click();
  // Selection is confirmed immediately (no confirmation button needed)

  // Verify the selection was successful - the picker should show the selected beverage
  await expect(page.getByTestId('keg-form')).toBeVisible();

  await expect(beveragePicker.modal).toBeHidden();
});

test('should successfully create keg', async ({ page, dropDown, taps }) => {
  const [tap] = taps;

  // Route is /taps/{tapId}/keg/new (singular "keg", not "kegs")
  // NewKegScreen expects tapId as a query parameter
  await page.goto(`/(tabs)/taps/${tap.id}/keg/new?tapId=${tap.id}`);

  // Wait for form to load
  await expect(page.getByTestId('keg-form')).toBeVisible();
  // KegForm uses BeveragePicker2 with name="beverage"
  const beveragePicker = dropDown.create('beverage-dropdown');
  await expect(beveragePicker.input).toBeVisible();
  await beveragePicker.select(0);
  await expect(page.getByTestId('keg-form')).toBeVisible();

  const kegTypeDd = dropDown.create('keg-type-dropdown');
  await kegTypeDd.select(0);

  // Mutate startingPercentage (Keg Level slider)
  const startingSlider = page.locator('[role="slider"]').first();
  await expect(startingSlider).toBeVisible();
  const sliderBox = await startingSlider.boundingBox();
  if (sliderBox) {
    await startingSlider.click({
      position: { x: sliderBox.width * 0.8, y: sliderBox.height / 2 },
    });
  }

  const submitButton = page.getByTestId('submit-button-create-keg');
  await expect(submitButton).toBeEnabled();
  await submitButton.click();

  // Success messages use SnackBar component with testID
  // Verify exact success message text
  await expect(page.getByTestId('snackbar-message')).toBeVisible();
  await expect(page.getByTestId('snackbar-message')).toHaveText(
    'New keg added',
  );
});

test('should redirect to nux/finish when returnTo=nux-finish after create', async ({
  page,
  dropDown,
  taps,
}) => {
  const [tap] = taps;

  await page.goto(
    `/(tabs)/taps/${tap.id}/keg/new?tapId=${tap.id}&returnTo=nux-finish`,
  );
  await expect(page.getByTestId('keg-form')).toBeVisible();

  const beveragePicker = dropDown.create('beverage-dropdown');
  await beveragePicker.select(0);
  const kegTypeDd = dropDown.create('keg-type-dropdown');
  await kegTypeDd.select(0);
  await page.getByTestId('submit-button-create-keg').click();

  // Should redirect to nux/finish with tapId (returnTo=nux-finish)
  await expect(page).toHaveURL(/\/finish/i);
  await expect(page.getByTestId('button-finish')).toBeVisible();
});
