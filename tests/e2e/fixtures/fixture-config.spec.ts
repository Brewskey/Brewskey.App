import { test, expect } from '../../fixtures/test-fixtures';

/**
 * Test to validate that fixture configuration options work correctly
 */
test.use({
  autoAuthenticate: true,
  locationCount: 2,
  tapCount: 3,
  deviceCount: 1,
  beverageCount: 2,
  organizationCount: 1,
});

test('should populate stores based on configuration', async ({
  page,
  mockStore,
}) => {
  // Verify locations were created
  const locations = mockStore.getLocations();
  expect(locations.length).toBe(2);
  expect(locations[0].name).toBe('Location 1');
  expect(locations[1].name).toBe('Location 2');

  // Verify taps were created (3 per location = 6 total)
  const taps = mockStore.getTaps();
  expect(taps.length).toBe(6);

  // Verify all taps belong to the created locations
  const locationIds = locations.map((l) => l.id);
  taps.forEach((tap) => {
    expect(tap.location).toBeTruthy();
    if (tap.location) {
      expect(locationIds).toContain(tap.location.id);
    }
  });

  // Verify devices were created
  // Note: devices are created per location (required for taps)
  // So with locationCount: 2, we get 2 devices (one per location)
  const devices = mockStore.getDevices();
  expect(devices.length).toBe(2); // 2 locations = 2 devices
  expect(devices[0].name).toBe('Device 1');
  expect(devices[1].name).toBe('Device 2');

  // Verify beverages were created
  const beverages = mockStore.getBeverages();
  expect(beverages.length).toBe(2);
  expect(beverages[0].name).toBe('Beverage 1');
  expect(beverages[1].name).toBe('Beverage 2');

  // Verify organizations were created
  const organizations = mockStore.getOrganizations();
  expect(organizations.length).toBe(1);
  expect(organizations[0].name).toBe('Organization 1');
});

test.describe('with zero counts', () => {
  test.use({
    autoAuthenticate: true,
    locationCount: 0,
    tapCount: 0,
    deviceCount: 0,
    beverageCount: 0,
    organizationCount: 0,
  });

  test('should work with zero counts', async ({ page, mockStore }) => {
    const locations = mockStore.getLocations();
    const taps = mockStore.getTaps();
    const devices = mockStore.getDevices();
    const beverages = mockStore.getBeverages();
    const organizations = mockStore.getOrganizations();

    expect(locations.length).toBe(0);
    expect(taps.length).toBe(0);
    expect(devices.length).toBe(0);
    expect(beverages.length).toBe(0);
    expect(organizations.length).toBe(0);
  });
});
