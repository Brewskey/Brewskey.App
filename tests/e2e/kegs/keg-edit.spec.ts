import { test, expect } from '../../fixtures/test-fixtures';
import { mockTapWithKeg } from '../../fixtures/entity-fixtures';
import { createMockBeverage } from '../../fixtures/test-data';
import { mockStore } from '../../fixtures/api-mocks';

test.use({ autoAuthenticate: true });

test('should successfully update keg', async ({ page, dropDown }) => {
  // Set up: one tap with keg and a second beverage so we can mutate the beverage field
  const { tap } = await mockTapWithKeg(page);
  const otherBeverage = createMockBeverage({ name: 'Other Keg Beverage' });
  mockStore.setBeverage(otherBeverage);

  // Edit tap layout uses tab name "keg" for the feed/on-tap screen
  await page.goto(`/taps/${tap.id}/edit/keg`);
  await expect(page.getByTestId('header-edit-tap')).toBeVisible();
  await expect(page.getByTestId('keg-form')).toBeVisible({ timeout: 10000 });

  // Mutate every form field: beverage, kegType, startingPercentage

  // Beverage - select the other beverage (newest by id desc, so index 0)
  const beveragePicker = dropDown.create('beverage-dropdown');
  await beveragePicker.select(0);

  // Keg type - select a different option (WebDropdown uses option-{index})
  const kegTypeDd = dropDown.create('keg-type-dropdown');
  await kegTypeDd.input.click();
  await kegTypeDd.scrollToItemByIndex(1);
  await kegTypeDd.select(1);

  // startingPercentage (Keg Level slider) - use testID on the SliderInput container
  const sliderContainer = page.getByTestId('input-startingPercentage');
  await expect(sliderContainer).toBeVisible();
  const sliderBox = await sliderContainer.boundingBox();
  if (sliderBox) {
    await sliderContainer.click({
      position: { x: sliderBox.width * 0.8, y: sliderBox.height / 2 },
    });
  }

  const submitButton = page.getByTestId('submit-button-update-current-keg');
  await expect(submitButton).toBeEnabled();
  await submitButton.click();

  await expect(page.getByTestId('snackbar-message')).toBeVisible();
  await expect(page.getByTestId('snackbar-message')).toHaveText(
    'Current keg updated',
  );
});
