import { test, expect } from '../../fixtures/test-fixtures';
import { seedTapWithKeg } from '../../fixtures/entity-fixtures';

test.use({ autoAuthenticate: true });

test('should navigate to custom flow sensor creation', async ({ page, seedApi}) => {
  // Set up explicit data: one tap
  const { tap } = await seedTapWithKeg(seedApi);

  await page.goto(`/flow-sensor/custom?tapId=${tap.id}`);

  await expect(page).toHaveURL(/.*custom/i);
  await expect(page.getByTestId('flow-sensor-type-selector')).toBeVisible();
});

test('should allow custom calibration input', async ({ page, seedApi}) => {
  // Set up explicit data: one tap
  const { tap } = await seedTapWithKeg(seedApi);

  await page.goto(`/flow-sensor/custom?tapId=${tap.id}`);

  // Navigate to Custom sensor type (last item in swiper)
  // On web, use Previous/Next buttons to navigate to Custom
  const nextButton = page.getByTestId('button-flow-sensor-next');
  // Click Next multiple times to get to Custom (last item, index 4)
  for (let i = 0; i < 4; i++) {
    await nextButton.click();
  }

  // Verify Custom sensor is selected
  await expect(page.getByTestId('flow-sensor-item-custom')).toBeVisible();

  // Custom sensor uses text input with testID pulses-per-gallon-input
  const calibrationInput = page.getByTestId('pulses-per-gallon-input');
  await expect(calibrationInput).toBeVisible();
  await calibrationInput.fill('1.5');
});

test('should successfully create custom flow sensor', async ({ page, seedApi}) => {
  // Set up explicit data: one tap
  const { tap } = await seedTapWithKeg(seedApi);

  await page.goto(`/flow-sensor/custom?tapId=${tap.id}`);

  // Navigate to Custom sensor type (last item in swiper)
  const nextButton = page.getByTestId('button-flow-sensor-next');
  // Click Next multiple times to get to Custom (last item, index 4)
  for (let i = 0; i < 4; i++) {
    await nextButton.click();
  }

  // Verify Custom sensor is selected
  await expect(page.getByTestId('flow-sensor-item-custom')).toBeVisible();

  // Custom sensor uses text input with testID pulses-per-gallon-input
  const calibrationInput = page.getByTestId('pulses-per-gallon-input');
  await expect(calibrationInput).toBeVisible();
  await calibrationInput.fill('1500');

  // Verify form is ready to submit
  await expect(page.getByTestId('submit-button-save')).toBeVisible();
  await expect(page.getByTestId('submit-button-save')).toBeEnabled();

  await page.getByTestId('submit-button-save').click();

  // Form submission navigates to keg/new - verify navigation completed
  await expect(page).toHaveURL(/\/keg\/new/i, { timeout: 10000 });
});
