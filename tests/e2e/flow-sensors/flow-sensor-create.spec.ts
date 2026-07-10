/* eslint-disable no-await-in-loop */
import { seedBareTap } from '../../fixtures/entity-fixtures';
import { expect, test } from '../../fixtures/test-fixtures';

test.use({ autoAuthenticate: true });

test('should navigate to create flow sensor', async ({ page, seedApi}) => {
  // Set up explicit data: one tap
  const { tap } = await seedBareTap(seedApi);

  await page.goto(`/flow-sensor/new?tapId=${tap.id}`);

  await expect(page).toHaveURL(/.*flow.*sensor.*new|new.*flow.*sensor/i);
  // Wait for buttons to load
  await expect(
    page.getByTestId('button-i-got-my-sensor-from-brewskey'),
  ).toBeVisible();
});

test('should allow selecting sensor type', async ({ page, seedApi}) => {
  // Set up explicit data: one tap
  const { tap } = await seedBareTap(seedApi);

  await page.goto(`/flow-sensor/custom?tapId=${tap.id}`);

  // FlowSensorSwiperField has testID for type selector
  await expect(page.getByTestId('flow-sensor-type-selector')).toBeVisible();
});

test('should allow setting gallon calibration', async ({ page, seedApi}) => {
  // Set up explicit data: one tap
  const { tap } = await seedBareTap(seedApi);

  await page.goto(`/flow-sensor/custom?tapId=${tap.id}`);

  // Standard sensor (Titan) uses slider with testID pulses-per-gallon-slider
  const gallonsSlider = page.getByTestId('pulses-per-gallon-slider');
  await expect(gallonsSlider).toBeVisible();
});

test('should successfully create flow sensor with default sensor type', async ({
  page,
  dropDown, seedApi,}) => {
  // Set up explicit data: one tap
  const { tap } = await seedBareTap(seedApi);

  await page.goto(`/flow-sensor/custom?tapId=${tap.id}`);

  // Mutate every form field: flowSensorType (swiper), pulsesPerGallon (slider for default Titan)
  // Change flowSensorType to next sensor (e.g. FT330) by clicking Next
  const nextButton = page.getByTestId('button-flow-sensor-next');
  if (await nextButton.isEnabled()) {
    await nextButton.click();
  }

  const sliderContainer = page.getByTestId('pulses-per-gallon-slider');
  await expect(sliderContainer).toBeVisible();
  await expect(page.getByTestId('submit-button-save')).toBeVisible();

  const sliderBounds = await sliderContainer.boundingBox();

  if (sliderBounds) {
    // Drag the slider thumb to change the value
    // Start from center (current position) and drag to 70% to change the value
    const startX = sliderBounds.x + sliderBounds.width * 0.5;
    const endX = sliderBounds.x + sliderBounds.width * 0.7;
    const y = sliderBounds.y + sliderBounds.height / 2;

    // Drag from center to 70% to change the slider value
    await page.mouse.move(startX, y);
    await page.mouse.down();
    await page.mouse.move(endX, y, { steps: 10 });
    await page.mouse.up();
  }

  // Verify form is ready to submit (Playwright auto-waits for enabled) (form should be dirty after slider interaction)
  await expect(page.getByTestId('submit-button-save')).toBeEnabled();

  await page.getByTestId('submit-button-save').click();

  // Flow sensor creation navigates to keg/new - fill and submit create keg form
  await expect(page).toHaveURL(/\/keg\/new/i);
  await expect(page.getByTestId('keg-form')).toBeVisible();
  const beveragePicker = dropDown.create('beverage-dropdown');
  await beveragePicker.select(0);
  const kegTypeDd = dropDown.create('keg-type-dropdown');
  await kegTypeDd.select(0);
  await page.getByTestId('submit-button-create-keg').click();

  // Keg creation completes - verify we navigated away from keg form
  await expect(page.getByTestId('keg-form')).not.toBeVisible({
    timeout: 10000,
  });
});

test('should successfully create flow sensor with custom sensor', async ({
  page,
  dropDown, seedApi,}) => {
  // Set up explicit data: one tap
  const { tap } = await seedBareTap(seedApi);

  await page.goto(`/flow-sensor/custom?tapId=${tap.id}`);

  // Navigate to Custom sensor type (last item in the list)
  // Click Next multiple times to reach Custom sensor
  const nextButton = page.getByTestId('button-flow-sensor-next');
  // There are 5 sensor types (Titan, FT330, SwissFlowSF800, Sea, Custom)
  // Start at Titan (index 0), need to click Next 4 times to reach Custom (index 4)
  for (let i = 0; i < 4; i++) {
    if (await nextButton.isEnabled()) {
      await nextButton.click();
    }
  }

  // Custom sensor uses text input with testID pulses-per-gallon-input
  const calibrationInput = page.getByTestId('pulses-per-gallon-input');
  await expect(calibrationInput).toBeVisible();

  await calibrationInput.clear();
  await calibrationInput.fill('5000');

  // Verify form is ready to submit (form is dirty because pulsesPerGallon changed)
  await expect(page.getByTestId('submit-button-save')).toBeEnabled();

  await page.getByTestId('submit-button-save').click();

  // Flow sensor creation navigates to keg/new - fill and submit create keg form
  await expect(page).toHaveURL(/\/keg\/new/i);
  await expect(page.getByTestId('keg-form')).toBeVisible();
  const beveragePicker = dropDown.create('beverage-dropdown');
  await beveragePicker.select(0);
  const kegTypeDd = dropDown.create('keg-type-dropdown');
  await kegTypeDd.select(0);
  await page.getByTestId('submit-button-create-keg').click();

  // Keg creation completes - verify we navigated away from keg form
  await expect(page.getByTestId('keg-form')).not.toBeVisible({
    timeout: 10000,
  });
});
