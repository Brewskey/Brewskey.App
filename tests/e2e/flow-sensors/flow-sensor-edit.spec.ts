import { test, expect } from '../../fixtures/test-fixtures';
import {
  seedTapWithCustomFlowSensor,
  seedTapWithStandardFlowSensor,
} from '../../fixtures/entity-fixtures';

test.use({ autoAuthenticate: true });

test('should navigate to edit flow sensor', async ({ page, seedApi}) => {
  // Set up explicit data: one tap with standard flow sensor
  const { tap } = await seedTapWithStandardFlowSensor(seedApi);

  await page.goto(`/flow-sensor/${tap.id}/edit`);

  await expect(page).toHaveURL(/.*flow.*sensor.*edit|edit.*flow.*sensor/i);
  await expect(page.getByTestId('flow-sensor-type-selector')).toBeVisible();
});

test('should pre-fill form with existing standard flow sensor data', async ({
  page, seedApi,}) => {
  // Set up explicit data: one tap with standard flow sensor
  const { tap } = await seedTapWithStandardFlowSensor(seedApi);

  await page.goto(`/flow-sensor/${tap.id}/edit`);

  // Flow sensor form should be visible - check for type selector
  await expect(page.getByTestId('flow-sensor-type-selector')).toBeVisible();

  // Standard flow sensor uses slider with testID pulses-per-gallon-slider
  await expect(page.getByTestId('pulses-per-gallon-slider')).toBeVisible();
});

test('should pre-fill form with existing custom flow sensor data', async ({
  page, seedApi,}) => {
  // Set up explicit data: one tap with custom flow sensor
  const { tap } = await seedTapWithCustomFlowSensor(seedApi);

  await page.goto(`/flow-sensor/${tap.id}/edit`);

  // Flow sensor form should be visible - check for type selector
  await expect(page.getByTestId('flow-sensor-type-selector')).toBeVisible();

  // Custom flow sensor uses text input with testID pulses-per-gallon-input
  await expect(page.getByTestId('pulses-per-gallon-input')).toBeVisible();
});

test('should successfully update standard flow sensor', async ({ page, seedApi}) => {
  // Set up explicit data: one tap with standard flow sensor
  const { tap } = await seedTapWithStandardFlowSensor(seedApi);

  await page.goto(`/flow-sensor/${tap.id}/edit`);

  // Mutate every form field: flowSensorType (swiper), pulsesPerGallon (slider for standard)
  await expect(page.getByTestId('flow-sensor-type-selector')).toBeVisible();

  // Mutate flowSensorType (click Next to change sensor type)
  const nextBtn = page.getByTestId('button-flow-sensor-next');
  if (await nextBtn.isEnabled()) {
    await nextBtn.click();
    await page.getByTestId('button-flow-sensor-previous').click();
  }

  const sliderContainer = page.getByTestId('pulses-per-gallon-slider');
  await expect(sliderContainer).toBeVisible();
  const sliderBounds = await sliderContainer.boundingBox();

  if (sliderBounds) {
    const startX = sliderBounds.x + sliderBounds.width * 0.5;
    const endX = sliderBounds.x + sliderBounds.width * 0.7;
    const y = sliderBounds.y + sliderBounds.height / 2;
    await page.mouse.move(startX, y);
    await page.mouse.down();
    await page.mouse.move(endX, y, { steps: 10 });
    await page.mouse.up();
  }

  // Verify form is ready to submit (form is now dirty)
  await expect(page.getByTestId('submit-button-save')).toBeVisible();
  await expect(page.getByTestId('submit-button-save')).toBeEnabled();

  await page.getByTestId('submit-button-save').click();

  // Edit form stays on same page after submission - verify success
  await expect(page).toHaveURL(/.*flow.*sensor.*edit|.*edit.*flow.*sensor/i);

  // Verify success notification appears
  await expect(page.getByTestId('snackbar-message')).toBeVisible();
});

test('should successfully update custom flow sensor', async ({ page, seedApi}) => {
  // Set up explicit data: one tap with custom flow sensor
  const { tap } = await seedTapWithCustomFlowSensor(seedApi);

  await page.goto(`/flow-sensor/${tap.id}/edit`);

  // Mutate every form field: flowSensorType (swiper), pulsesPerGallon (text for custom)
  await expect(page.getByTestId('flow-sensor-type-selector')).toBeVisible();

  // Mutate flowSensorType (click Next then Previous)
  const nextBtn = page.getByTestId('button-flow-sensor-next');
  if (await nextBtn.isEnabled()) {
    await nextBtn.click();
    await page.getByTestId('button-flow-sensor-previous').click();
  }

  const calibrationInput = page.getByTestId('pulses-per-gallon-input');
  await expect(calibrationInput).toBeVisible();
  await calibrationInput.clear();
  await calibrationInput.fill('2001');
  await calibrationInput.blur();

  // Verify form is ready to submit (form must be dirty; SubmitButton requires isDirty)
  await expect(page.getByTestId('submit-button-save')).toBeVisible();
  await expect(page.getByTestId('submit-button-save')).toBeEnabled({
    timeout: 8000,
  });

  await page.getByTestId('submit-button-save').click();

  // Edit form stays on same page after submission - verify success
  await expect(page).toHaveURL(/.*flow.*sensor.*edit|.*edit.*flow.*sensor/i);

  // Verify success notification appears
  await expect(page.getByTestId('snackbar-message')).toBeVisible();
});
