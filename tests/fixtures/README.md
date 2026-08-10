# Test Fixtures — real-API e2e

Playwright fixtures with dependency injection for the Brewskey app e2e suite.
Every test runs against the actual Brewskey.Web Docker stack
(`tests/e2e-stack/docker-compose.yml`) — **there are no API mocks**. All data
setup flows through the declarative fixture system in `test-fixtures.ts`,
following the canonical patterns from
<https://playwright.dev/docs/test-fixtures>: option fixtures configured via
`test.use()`, auto fixtures for per-test setup, and derived fixtures for
ergonomic access.

```
npm run e2e-stack:up   # API + SQL Server + ES + smtp4dev + Azurite + device cloud (+ mongo)
npx playwright test
npm run e2e-stack:down # discard all state
```

The Particle proxy (`/api/v2/cloud-devices/*`) talks to a real
`brewskey.devicecloud` container; seeded devices are registered there
automatically (they report offline — the true state of hardware that never
connects), so device-status reads are real too.

## Options (configure via `test.use()`)

| Option | Type | What it does |
|---|---|---|
| `autoAuthenticate` | `boolean` | Registers + logs in a fresh REAL account; the app boots authenticated. |
| `user` | `Partial<Account>` | Overrides for the registered account. |
| `seed` | `SeedSpec` | Declarative REAL-API entity seeding owned by the authenticated user (below). |
| `softAp` | `SoftApMockOptions \| boolean` | Installs the device SoftAP shim (the Brewskey box's WiFi-setup HTTP server at 192.168.0.1 — physical hardware that cannot exist in e2e). |
| `notifications` | `{ list: Notification[] }` | Pre-loads the app's client-side notification store (push data; no API surface on web). Wrapped in an object because a bare array in `test.use()` is parsed as a `[value, options]` fixture tuple. |
| `geolocation` | Playwright built-in | Browser coordinates. `nearby: true` seeded locations are placed AT this point, so app and data always agree on where "here" is. Use `uniqueGeolocation()` from `seed-api.ts` for geolocation-sensitive suites. |

## Seeding (`seed` option)

Entities are created through the app's own `@brewskey/js-api` client against
the live API — identical wire shapes, real permissions. Each entity accepts a
count or per-item configs (`Partial<XMutator>`, strongly typed); the parent
hierarchy auto-fills.

```typescript
test.use({
  autoAuthenticate: true,
  seed: {
    organization: true,            // created AND selected (scopes app + seeds)
    organizations: 2,              // extra orgs, not selected
    locations: [{ nearby: true }], // placed at the context's geolocation
    devices: 1,
    taps: [{ keg: { srmId: 10 }, pours: 5, flowSensor: 'Custom' }],
    beverages: [{ name: 'Test IPA' }],
  },
});

test('...', async ({ organization, locations, devices, taps, beverages, pours }) => {
  const [tap] = taps; // fully fetched: tapNumber + currentKeg populated
});
```

Tap extras: `flowSensor: 'Titan' (default) | 'Custom' | false`,
`keg: true | Partial<BeverageMutator>`, `pours: N` (real pours through the
actual pipeline via the stack's bootstrap admin; auto-attaches a keg),
`deviceIndex`. Device extras: `locationIndex`.

## Fixtures

- `authenticatedUser` — `{ user, authResponse, credentials } | null`.
- `organization` / `organizations` / `locations` / `devices` / `taps` /
  `beverages` / `pours` — entities created by `seed`.
- `seedApi` — the authenticated js-api client, for MID-TEST dynamic actions
  only (create during a flow, `fetchDevice`/`fetchTap` persistence re-checks,
  `registerOtherUser`). Initial state belongs in `seed`.
- `seedUser` — registers a real account WITHOUT logging the app in (for
  login-flow specs); returns credentials to type into the form.
- Page objects: `loginPage`, `homePage`, `locationPage`, `tapPage`,
  `devicePage`, `settingsPage`, `nuxPage`, `wifiPage`, `menuPage`,
  `notificationsPage`, `statsPage`, `dropDown`.
- Auto: `apiMonitoring` (writes `tests/API_FAILURES.md` when API requests
  fail during a test), `softApShim`, `notificationsStore`.

## Per-group seeds

`test.use()` works at file or describe level — wrap tests that need different
seeds in `test.describe` blocks:

```typescript
test.use({ autoAuthenticate: true });

test('empty state', async ({ page }) => { /* fresh account owns nothing */ });

test.describe('with a kegged tap', () => {
  test.use({ seed: { taps: [{ keg: true }] } });
  test('details', async ({ taps }) => { const [tap] = taps; /* ... */ });
});
```

## Routes

Use Expo Router deep link paths from `routes.ts` so tests match the app
routing: tab screens `/(menu)`, `/(feed)`, `/(stats)`, `/(notifications)`;
menu sub-routes `/(menu)/settings` etc.; shared routes `/locations`, `/taps`,
`/devices`, `/beverages`; NUX `/(nux)/location`, `/(nux)/wifi`, …

## What is still injected (and why)

- **SoftAP** (`soft-ap-mocks.ts`) — the device's local WiFi-setup HTTP server
  is physical hardware.
- **Notifications** (`notification-fixtures.ts` data + `notifications`
  option) — native push has no web API surface.
- **Injected API error contracts** (`menu/settings.spec.ts` only) — a 500 on
  account delete and Google link/unlink flows require Google's identity
  service; the server side of those paths is covered by Brewskey.Web's
  integration suite.

Everything else is real. If you find yourself reaching for `page.route` on an
API endpoint, seed real data instead.
