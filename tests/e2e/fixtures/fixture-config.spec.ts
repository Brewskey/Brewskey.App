import { test, expect } from '../../fixtures/test-fixtures';

/**
 * Validates the declarative `seed` fixture option: entities are created
 * through the REAL API (owned by the authenticated user), each entity accepts
 * a count or per-item configs, the parent hierarchy auto-fills, and a selected
 * organization scopes everything.
 */
test.describe('counts + per-item config', () => {
  test.use({
    autoAuthenticate: true,
    seed: {
      locations: [{ name: 'Location 1' }, { name: 'Location 2' }],
      devices: [{ name: 'Device 1' }, { name: 'Device 2' }],
      // 6 taps spread across the 2 devices (3 each).
      taps: 6,
      beverages: [{ name: 'Beverage 1' }, { name: 'Beverage 2' }],
    },
  });

  test('creates the configured entities', async ({
    locations,
    devices,
    taps,
    beverages,
    seedApi,
  }) => {
    expect(locations).toHaveLength(2);
    expect(locations.map((l) => l.name)).toEqual(['Location 1', 'Location 2']);

    expect(devices).toHaveLength(2);
    expect(devices.map((d) => d.name)).toEqual(['Device 1', 'Device 2']);

    // Each tap lands on a real device (spread round-robin across the two).
    expect(taps).toHaveLength(6);
    const deviceIds = devices.map((d) => d.id);
    for (const tap of taps) {
      const fetched = await seedApi.fetchTap(tap.id);
      expect(fetched.device).toBeTruthy();
      if (fetched.device) {
        expect(deviceIds).toContain(fetched.device.id);
      }
    }

    expect(beverages.map((b) => b.name)).toEqual(['Beverage 1', 'Beverage 2']);
  });
});

test.describe('hierarchy auto-fill', () => {
  // Ask only for taps — the device and location are created automatically.
  test.use({ autoAuthenticate: true, seed: { taps: 2 } });

  test('creates parent device + location for taps', async ({
    taps,
    devices,
    locations,
  }) => {
    expect(taps).toHaveLength(2);
    expect(devices).toHaveLength(1);
    expect(locations).toHaveLength(1);
  });
});

test.describe('organization selection', () => {
  test.use({ autoAuthenticate: true, seed: { organization: true, devices: 1 } });

  test('selects the org and scopes the device to it', async ({
    organization,
    organizations,
    devices,
    seedApi,
  }) => {
    expect(organization).toBeTruthy();
    expect(organizations).toHaveLength(1);
    // The device was created under the selected org.
    const fetched = await seedApi.fetchDevice(devices[0].id);
    expect(fetched.organization?.id).toBe(organization!.id);
  });
});

test.describe('no seed option', () => {
  test.use({ autoAuthenticate: true });

  test('seeds nothing', async ({
    locations,
    taps,
    devices,
    beverages,
    organizations,
    organization,
  }) => {
    expect(locations).toHaveLength(0);
    expect(taps).toHaveLength(0);
    expect(devices).toHaveLength(0);
    expect(beverages).toHaveLength(0);
    expect(organizations).toHaveLength(0);
    expect(organization).toBeNull();
  });
});
