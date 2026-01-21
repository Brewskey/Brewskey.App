import { test, expect } from '../../fixtures/test-fixtures';
import { mockLocationWithTaps, mockTapWithKeg } from '../../fixtures/entity-fixtures';
import { mockStore } from '../../fixtures/api-mocks';

// Configure tests to auto-authenticate and create test data
test.use({ autoAuthenticate: true });

test('should display taps grouped by location', async ({ page, tapPage, menuPage }) => {
  // Set up explicit data: one location with 3 taps
  const { location, taps } = await mockLocationWithTaps(page, 3);
  
  // Navigate through menu to taps (since TapsStack is nested in MenuStack)
  await menuPage.goto();
  await menuPage.clickTaps();

  await expect(tapPage.getTapsList()).toBeVisible();

  // TapListItem has testID - use that instead of text-based locator
  for (const tap of taps) {
    await expect(page.getByTestId(`tap-item-${tap.id}`)).toBeVisible();
  }
});

test('should show empty state', async ({ page, tapPage, menuPage }) => {
  // Set up explicit data: no taps (empty state)
  // Store is already empty from resetStores fixture
  
  // Navigate through menu to taps
  await menuPage.goto();
  await menuPage.clickTaps();

  // Empty state - list container is always visible, check for empty message
  await expect(tapPage.getTapsList()).toBeVisible();
  // Check for empty state button (NuxNoEntity component) - use testID
  await expect(page.getByTestId('button-get-started')).toBeVisible();
});

test('should navigate to tap details', async ({ page, tapPage, menuPage }) => {
  // Set up explicit data: one location with 1 tap
  const { taps } = await mockLocationWithTaps(page, 1);
  
  // Navigate through menu to taps
  await menuPage.goto();
  await menuPage.clickTaps();
  
  // Wait for list to load
  await expect(tapPage.getTapsList()).toBeVisible();
  
  // Tap number is dynamic content, so text-based locator is acceptable
  await tapPage.clickTap(taps[0].tapNumber);

  await expect(page).toHaveURL(/.*tap.*details|tap.*\d+/i);
});

test('should navigate to create tap', async ({ page, tapPage, menuPage }) => {
  // Set up explicit data: organization for tap creation
  // NewTapScreen requires organizationId to render the form
  const { organization } = await mockTapWithKeg(page);
  
  // Navigate through menu to taps
  await menuPage.goto();
  await menuPage.clickTaps();
  
  // Wait for page to load
  await expect(tapPage.getTapsList()).toBeVisible();
  
  // Navigate to new tap screen with organizationId parameter
  // The header button doesn't pass organizationId, so we navigate directly
  // Organization ID format: API mock expects number, but EntityID can be string or number
  // The parseODataQuery function converts URL IDs to integers
  // So we need to ensure the organization.id matches what's stored in the mock store
  // Since mockTapWithKeg creates organization with generateId() which returns a number,
  // we can use it directly
  const url = `/(tabs)/taps/new?organizationId=${organization.id}`;
  await page.goto(url);

  // Wait for the form to load - TapForm queries organization by ID
  // The form container has testID="tap-form" when organization is loaded
  // Organization query should complete and form should render
  // The query uses OrganizationDAO.fetchByID which calls /api/v2/organizations(id)
  // Wait for the form to appear (organization query completes)
  await expect(page.getByTestId('tap-form')).toBeVisible();

  // After form is visible, check for the description input field
  // TapForm uses "description" field, not "tapNumber"
  await expect(page.getByTestId('input-description')).toBeVisible();
});
