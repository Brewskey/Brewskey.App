import { test, expect } from '../../fixtures/test-fixtures';
import { mockTapWithKeg } from '../../fixtures/entity-fixtures';
import { createMockBeverage } from '../../fixtures/test-data';
import { mockStore } from '../../fixtures/api-mocks';

test.use({ autoAuthenticate: true });

test('should successfully update keg', async ({ page }) => {
  // Set up: one tap with keg and a second beverage so we can mutate the beverage field
  const { tap } = await mockTapWithKeg(page);
  const otherBeverage = createMockBeverage({ name: 'Other Keg Beverage' });
  mockStore.setBeverage(otherBeverage);

  await page.goto(`/taps/${tap.id}/edit/feed`);
  await expect(page.getByTestId('header-edit-tap')).toBeVisible();
  await expect(page.getByTestId('keg-form')).toBeVisible({ timeout: 10000 });

  // Mutate every form field: beverage, kegType, startingPercentage

  // Beverage - select the other beverage
  const beveragePicker = page.getByTestId('beverage-picker-beverage');
  await beveragePicker.click();
  await expect(page.getByTestId(`beverage-picker-item-${otherBeverage.id}`)).toBeVisible({ timeout: 5000 });
  await page.getByTestId(`beverage-picker-item-${otherBeverage.id}`).click();

  // Keg type - select a different option (WebDropdown uses option-0, option-1, ...; scope to keg type modal)
  const kegTypeDropdown = page.getByTestId('dropdown-kegType');
  await kegTypeDropdown.click();
  await expect(page.getByTestId('dropdown-kegType-modal').getByTestId('option-1')).toBeVisible({ timeout: 5000 });
  await page.getByTestId('dropdown-kegType-modal').getByTestId('option-1').click();

  // startingPercentage (Keg Level slider) - use testID on the SliderInput container
  const sliderContainer = page.getByTestId('input-startingPercentage');
  await expect(sliderContainer).toBeVisible();
  const sliderBox = await sliderContainer.boundingBox();
  if (sliderBox) {
    await sliderContainer.click({ position: { x: sliderBox.width * 0.8, y: sliderBox.height / 2 } });
  }

  const submitButton = page.getByTestId('submit-button-update-current-keg');
  await expect(submitButton).toBeEnabled();
  await submitButton.click();

  await expect(page.getByTestId('snackbar-message')).toBeVisible();
  await expect(page.getByTestId('snackbar-message')).toHaveText('Current keg updated');
});
