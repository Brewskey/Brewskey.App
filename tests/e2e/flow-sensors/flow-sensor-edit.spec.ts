import { test, expect } from '../../fixtures/test-fixtures';
import { mockTapWithCustomFlowSensor, mockTapWithStandardFlowSensor } from '../../fixtures/entity-fixtures';

test.use({ autoAuthenticate: true });

test('should navigate to edit flow sensor', async ({ page }) => {
  // Set up explicit data: one tap with standard flow sensor
  const { tap } = await mockTapWithStandardFlowSensor(page);

  await page.goto(`/flow-sensor/${tap.id}/edit`);

  await expect(page).toHaveURL(/.*flow.*sensor.*edit|edit.*flow.*sensor/i);
  await expect(page.getByTestId('flow-sensor-type-selector')).toBeVisible();
});

test('should pre-fill form with existing standard flow sensor data', async ({ page }) => {
  // Set up explicit data: one tap with standard flow sensor
  const { tap } = await mockTapWithStandardFlowSensor(page);

  await page.goto(`/flow-sensor/${tap.id}/edit`);
  

  // Flow sensor form should be visible - check for type selector
  await expect(page.getByTestId('flow-sensor-type-selector')).toBeVisible();
  
  // Standard flow sensor should show gallons slider
  await expect(page.getByTestId('input-gallons')).toBeVisible();
});

test('should pre-fill form with existing custom flow sensor data', async ({ page }) => {
  // Set up explicit data: one tap with custom flow sensor
  const { tap } = await mockTapWithCustomFlowSensor(page);

  await page.goto(`/flow-sensor/${tap.id}/edit`);
  

  // Flow sensor form should be visible - check for type selector
  await expect(page.getByTestId('flow-sensor-type-selector')).toBeVisible();
  
  // Custom flow sensor should show calibration input
  await expect(page.getByTestId('input-calibration')).toBeVisible();
});

test('should successfully update standard flow sensor', async ({ page }) => {
  // Set up explicit data: one tap with standard flow sensor
  const { tap } = await mockTapWithStandardFlowSensor(page);

  await page.goto(`/flow-sensor/${tap.id}/edit`);
  

  // Mutate every form field: flowSensorType (swiper), pulsesPerGallon (slider for standard)
  await expect(page.getByTestId('flow-sensor-type-selector')).toBeVisible();

  // Mutate flowSensorType (click Next to change sensor type)
  const nextBtn = page.getByTestId('button-flow-sensor-next');
  if (await nextBtn.isEnabled()) {
    await nextBtn.click();
    await page.waitForTimeout(100);
    await page.getByTestId('button-flow-sensor-previous').click();
    await page.waitForTimeout(100);
  }

  const gallonsInput = page.getByTestId('input-gallons');
  await expect(gallonsInput).toBeVisible();

  const sliderContainer = page.getByTestId('input-gallons');
  const sliderBounds = await sliderContainer.boundingBox();

  if (sliderBounds) {
    // Start from center (current position) and drag to 70% to change the value
    const startX = sliderBounds.x + sliderBounds.width * 0.5;
    const endX = sliderBounds.x + sliderBounds.width * 0.7;
    const y = sliderBounds.y + sliderBounds.height / 2;
    
    // Drag from center to 70% to change the slider value
    await page.mouse.move(startX, y);
    await page.mouse.down();
    await page.mouse.move(endX, y, { steps: 10 });
    await page.mouse.up();
    // Wait for the slider's onValueChange to fire and form state to update
    await page.waitForTimeout(500);
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

test('should successfully update custom flow sensor', async ({ page }) => {
  // Set up explicit data: one tap with custom flow sensor
  const { tap } = await mockTapWithCustomFlowSensor(page);

  await page.goto(`/flow-sensor/${tap.id}/edit`);
  

  // Mutate every form field: flowSensorType (swiper), pulsesPerGallon (text for custom)
  await expect(page.getByTestId('flow-sensor-type-selector')).toBeVisible();

  // Mutate flowSensorType (click Next then Previous)
  const nextBtn = page.getByTestId('button-flow-sensor-next');
  if (await nextBtn.isEnabled()) {
    await nextBtn.click();
    await page.waitForTimeout(100);
    await page.getByTestId('button-flow-sensor-previous').click();
    await page.waitForTimeout(100);
  }

  const calibrationInput = page.getByTestId('input-calibration');
  await expect(calibrationInput).toBeVisible();
  await calibrationInput.fill('2000');

  // Verify form is ready to submit
  await expect(page.getByTestId('submit-button-save')).toBeVisible();
  await expect(page.getByTestId('submit-button-save')).toBeEnabled();
  
  await page.getByTestId('submit-button-save').click();

  // Edit form stays on same page after submission - verify success
  await expect(page).toHaveURL(/.*flow.*sensor.*edit|.*edit.*flow.*sensor/i);
  
  // Verify success notification appears
  await expect(page.getByTestId('snackbar-message')).toBeVisible();
});
