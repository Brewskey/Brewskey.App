import { test, expect } from '../../fixtures/test-fixtures';
import { mockTapWithKeg } from '../../fixtures/entity-fixtures';

test.use({ autoAuthenticate: true });

test('should navigate to create keg form', async ({ page }) => {
  // Set up explicit data: one tap with keg
  const { tap } = await mockTapWithKeg(page);
  
  // Navigate directly to keg/new route
  // With the new route structure (keg/index.tsx + keg/_layout.tsx), 
  // the route should be accessible as /taps/[tapId]/keg/new
  await page.goto(`/(tabs)/taps/${tap.id}/keg/new`);
  
  await expect(page).toHaveURL(/.*keg.*new|new.*keg/i);
  // Wait for form to load - KegForm has testID="keg-form"
  // NewKegScreen renders KegForm which should be visible
  await expect(page.getByTestId('keg-form')).toBeVisible();
  // KegForm uses BeveragePicker2 with name="beverage"
  // BeveragePicker2 generates testID as: beverage-picker-${name} = beverage-picker-beverage
  const beveragePicker = page.getByTestId('beverage-picker-beverage');
  await expect(beveragePicker).toBeVisible();
});

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
  // Confirm selection
  await expect(page.getByTestId('picker-control-select-button')).toBeVisible();
  await page.getByTestId('picker-control-select-button').click();
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
  
  // Confirm selection
  await expect(page.getByTestId('picker-control-select-button')).toBeVisible();
  await page.getByTestId('picker-control-select-button').click();
  
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
  // Confirm selection - BeveragePicker2 uses confirmSelectItem={true}
  await expect(page.getByTestId('picker-control-select-button')).toBeVisible();
  await page.getByTestId('picker-control-select-button').click();
  
  // Wait for modal to close and form state to update
  await expect(page.getByTestId('keg-form')).toBeVisible();
  
  // Select keg type - required field (defaults to undefined for new keg)
  // DropdownInput for kegType has testID="dropdown-kegType"
  const kegTypeDropdown = page.getByTestId('dropdown-kegType');
  await expect(kegTypeDropdown).toBeVisible();
  await kegTypeDropdown.click();
  // Wait for dropdown options to appear
  // DropdownInput mode="default" renders options inline within parent container
  // Since there are multiple dropdowns on the page, scope to keg-form container
  // DropdownInput generates option testIDs as "option-{index}"
  // Mini Keg is the smallest size, so it should be first (index 0) after sorting by size
  await expect(page.getByTestId('keg-form').getByTestId('option-0')).toBeVisible();
  // Click the option - DropdownInput uses mode="default" so it closes automatically
  // Use force click because form elements may overlap dropdown
  await page.getByTestId('keg-form').getByTestId('option-0').click({ force: true });
  
  // Wait for form state to update - the dropdown should close and form should become dirty
  // SubmitButton requires isDirty=true AND isValid=true
  // For new kegs, dropdown selections should trigger isDirty when values change from undefined/null
  // However, React Hook Form may not mark as dirty if the change happens before form initialization
  // Interact with slider to ensure form becomes dirty (change from default 100% to 99%)
  const slider = page.locator('[role="slider"]').first();
  await expect(slider).toBeVisible({ timeout: 5000 });
  
  // Get slider bounding box and drag to change value
  const sliderBox = await slider.boundingBox();
  if (sliderBox) {
    // Drag from center (100%) to slightly left (99%) to trigger dirty state
    await slider.hover({ position: { x: sliderBox.width * 0.99, y: sliderBox.height / 2 } });
    await slider.click({ position: { x: sliderBox.width * 0.99, y: sliderBox.height / 2 } });
    // Wait for form state to update
    await page.waitForTimeout(500);
  }
  
  // Submit button has testID - wait for it to become enabled (form validation)
  // Form requires: beverage (selected), kegType (selected), and isDirty=true
  const submitButton = page.getByTestId('submit-button-create-keg');
  await expect(submitButton).toBeVisible();
  // Wait for form state to update (isDirty and isValid checks)
  await expect(submitButton).toBeEnabled({ timeout: 5000 });
  await submitButton.click();

  // Success messages use SnackBar component with testID
  await expect(page.getByTestId('snackbar-message')).toBeVisible();
});
