import { test, expect } from '../../fixtures/test-fixtures';

/**
 * Validates the fixture configuration options: entities are created through
 * the REAL API (owned by the authenticated user) per the test.use() counts.
 */
test.use({
  autoAuthenticate: true,
  locationCount: 2,
  tapCount: 3,
  deviceCount: 1,
  beverageCount: 2,
  organizationCount: 1,
});

test('should seed entities based on configuration', async ({
  seededEntities,
  seedApi,
}) => {
  // Locations were created
  expect(seededEntities.locations.length).toBe(2);
  expect(seededEntities.locations[0].name).toBe('Location 1');
  expect(seededEntities.locations[1].name).toBe('Location 2');
  seededEntities.locations.forEach((location) => {
    expect(location.id).toBeTruthy();
  });

  // Taps were created (3 per location = 6 total), each on a real location.
  // The create response doesn't expand navs — verify through the read path.
  expect(seededEntities.taps.length).toBe(6);
  const locationIds = seededEntities.locations.map((l) => l.id);
  for (const tap of seededEntities.taps) {
    const fetched = await seedApi.fetchTap(tap.id);
    expect(fetched.location).toBeTruthy();
    if (fetched.location) {
      expect(locationIds).toContain(fetched.location.id);
    }
  }

  // Devices are created per location (required for taps), so with
  // locationCount: 2 we get 2 devices (deviceCount: 1 is already covered)
  expect(seededEntities.devices.length).toBe(2);
  expect(seededEntities.devices[0].name).toBe('Device 1');
  expect(seededEntities.devices[1].name).toBe('Device 2');

  // Beverages were created
  expect(seededEntities.beverages.length).toBe(2);
  expect(seededEntities.beverages[0].name).toBe('Beverage 1');
  expect(seededEntities.beverages[1].name).toBe('Beverage 2');

  // Organizations were created
  expect(seededEntities.organizations.length).toBe(1);
  expect(seededEntities.organizations[0].name).toBe('Organization 1');
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

  test('should work with zero counts', async ({ seededEntities }) => {
    expect(seededEntities.locations.length).toBe(0);
    expect(seededEntities.taps.length).toBe(0);
    expect(seededEntities.devices.length).toBe(0);
    expect(seededEntities.beverages.length).toBe(0);
    expect(seededEntities.organizations.length).toBe(0);
  });
});
