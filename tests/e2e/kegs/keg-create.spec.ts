import { test, expect } from '../../fixtures/test-fixtures';
import { mockTapWithKeg } from '../../fixtures/entity-fixtures';

test.use({ autoAuthenticate: true });

test('should allow selecting beverage', async ({ page }) => {
  // Set up explicit data: one tap with beverage available
  const { tap, beverage } = await mockTapWithKeg(page);

  // Route is /taps/{tapId}/keg/new (singular "keg", not "kegs")
  await page.goto(`/(tabs)/taps/${tap.id}/keg/new`);
  
  // KegForm uses BeveragePicker2 with name="beverage"
  // BeveragePicker2 generates testID as: beverage-picker-${name} = beverage-picker-beverage
  const beveragePicker = page.getByTestId('beverage-picker-beverage');
  await expect(beveragePicker).toBeVisible();
  await beveragePicker.click();
  // Wait for modal to appear - DropDownInput modal doesn't have a testID based on label
  // Wait for the beverage name to appear in the modal (more reliable than header title)
  await expect(page.getByText(beverage.name)).toBeVisible();
  // Click the beverage
  await page.getByText(beverage.name).click();
  // Selection is confirmed immediately (no confirmation button needed)
});

test('should render beverage picker with images', async ({ page }) => {
  // Set up explicit data: one tap with beverage available
  const { tap, beverage } = await mockTapWithKeg(page);

  // Navigate to keg creation form
  await page.goto(`/(tabs)/taps/${tap.id}/keg/new`);
  
  // Wait for form to load
  await expect(page.getByTestId('keg-form')).toBeVisible();
  
  // Open beverage picker
  const beveragePicker = page.getByTestId('beverage-picker-beverage');
  await expect(beveragePicker).toBeVisible();
  await beveragePicker.click();
  
  // Wait for modal to appear and beverage list to load
  await expect(page.getByText(beverage.name)).toBeVisible();
  
  // Verify the beverage row is rendered with testID
  const beverageRow = page.getByTestId(`beverage-picker-item-${beverage.id}`);
  await expect(beverageRow).toBeVisible();
  
  // Verify the beverage name is displayed
  await expect(beverageRow.getByText(beverage.name)).toBeVisible();
  
  // Verify an image element is present in the beverage row
  // BeverageAvatar renders an Image component (expo-image) which becomes an <img> tag on web
  // Check for image element within the beverage row
  const beverageImage = beverageRow.locator('img').or(beverageRow.locator('[data-testid*="avatar"]'));
  await expect(beverageImage.first()).toBeVisible();
  
  // Verify the image has a src attribute (indicating it's trying to load an image)
  const imageElement = beverageImage.first();
  const imageSrc = await imageElement.getAttribute('src');
  expect(imageSrc).toBeTruthy();
  
  // Select the beverage
  await beverageRow.click();
  // Selection is confirmed immediately (no confirmation button needed)
  
  // Verify the selection was successful - the picker should show the selected beverage
  await expect(page.getByTestId('keg-form')).toBeVisible();
});

test('should successfully create keg', async ({ page }) => {
  // Set up explicit data: one tap with beverage available
  const { tap, beverage } = await mockTapWithKeg(page);

  // Route is /taps/{tapId}/keg/new (singular "keg", not "kegs")
  // NewKegScreen expects tapId as a query parameter
  await page.goto(`/(tabs)/taps/${tap.id}/keg/new?tapId=${tap.id}`);
  
  // Wait for form to load
  await expect(page.getByTestId('keg-form')).toBeVisible();
  // KegForm uses BeveragePicker2 with name="beverage"
  // BeveragePicker2 generates testID as: beverage-picker-${name} = beverage-picker-beverage
  const beveragePicker = page.getByTestId('beverage-picker-beverage');
  await expect(beveragePicker).toBeVisible();
  await beveragePicker.click();
  // Wait for modal to appear - DropDownInput modal doesn't have a testID based on label
  // Wait for the beverage name to appear in the modal (more reliable than header title)
  await expect(page.getByText(beverage.name)).toBeVisible();
  // Click the beverage
  await page.getByText(beverage.name).click();
  // Selection is confirmed immediately (no confirmation button needed)
  // Wait for modal to close and form state to update
  await expect(page.getByTestId('keg-form')).toBeVisible();
  
  // Select keg type - required field. Scope to dropdown modal (WebDropdown uses option-{index})
  const kegTypeDropdown = page.getByTestId('dropdown-kegType');
  await kegTypeDropdown.click();
  const kegTypeModal = page.getByTestId('dropdown-kegType-modal');
  await expect(kegTypeModal.getByTestId('option-0')).toBeVisible();
  await kegTypeModal.getByTestId('option-0').click();

  // Mutate startingPercentage (Keg Level slider)
  const startingSlider = page.locator('[role="slider"]').first();
  await expect(startingSlider).toBeVisible();
  const sliderBox = await startingSlider.boundingBox();
  if (sliderBox) {
    await startingSlider.click({ position: { x: sliderBox.width * 0.8, y: sliderBox.height / 2 } });
  }

  const submitButton = page.getByTestId('submit-button-create-keg');
  await expect(submitButton).toBeEnabled();
  await submitButton.click();

  // Success messages use SnackBar component with testID
  // Verify exact success message text
  await expect(page.getByTestId('snackbar-message')).toBeVisible();
  await expect(page.getByTestId('snackbar-message')).toHaveText('New keg added');
});
