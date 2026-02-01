# Test Fixtures

This directory contains Playwright test fixtures with dependency injection for the Brewskey app tests.

## Routes

Use Expo Router deep link paths from `routes.ts` so tests match the app routing:

- **Tab screens**: `/(menu)`, `/(feed)`, `/(stats)`, `/(notifications)` – use group names in parentheses
- **Menu sub-routes**: `/(menu)/settings`, `/(menu)/my-friends`, `/(menu)/help`, etc.
- **Shared routes**: `/locations`, `/taps`, `/devices`, `/beverages` – same path from any tab
- **Nux**: `/(nux)/location`, `/(nux)/wifi`, etc.

```typescript
import { ROUTES } from '../fixtures/routes';

test('menu screen', async ({ page }) => {
  await page.goto(ROUTES.MENU);
});
```

## Overview

The test fixtures automatically handle:

- **Mock data store reset** - Automatically resets before each test
- **API monitoring** - Tracks failed API requests during tests
- **API mocking** - Sets up route handlers for all API endpoints
- **Authentication** - Optional automatic user authentication

## Usage

### Basic Setup

Import the custom test fixtures instead of the default Playwright test:

```typescript
import { test, expect } from '../fixtures/test-fixtures';
```

### Auto-Authentication

Enable automatic authentication for all tests in a file:

```typescript
import { test, expect } from '../fixtures/test-fixtures';

test.use({ autoAuthenticate: true });

test('my test', async ({ page, authenticatedUser }) => {
  // authenticatedUser is automatically available
  // { user: Account, authResponse: AuthResponse }
  await page.goto('/home');
});
```

### Custom User Configuration

Configure user properties via `test.use()`:

```typescript
test.use({
  autoAuthenticate: true,
  user: { userName: 'customuser', email: 'custom@example.com' },
});

test('my test', async ({ authenticatedUser }) => {
  expect(authenticatedUser?.user.userName).toBe('customuser');
});
```

### Per-Test Configuration

Override configuration for specific tests:

```typescript
test('specific test', async ({ page, mockStore }) => {
  // Use mockStore to manually add data
  const customLocation = createMockLocation({ name: 'Custom Location' });
  mockStore.setLocation(customLocation);

  await page.goto('/locations');
});
```

### Using Helper Functions

For complex data setups, use helper functions from `entity-fixtures.ts`:

```typescript
import { mockLocationWithTaps } from '../../fixtures/entity-fixtures';

test('my test', async ({ page }) => {
  const { location, taps } = await mockLocationWithTaps(page, 3);
  // 1 location with 3 taps is now available

  await page.goto('/taps');
});
```

## Available Fixtures

### `authenticatedUser`

Optional fixture that provides authenticated user session.

- **Type**: `{ user: Account; authResponse: AuthResponse } | null`
- **Auto-setup**: Only when `autoAuthenticate: true` is set
- **Usage**: Access user data and auth tokens

### `mockStore`

Provides direct access to the mock data store.

- **Type**: `MockDataStore`
- **Usage**: Manually add/remove mock data
- **Methods**: `setUser()`, `setLocation()`, `setTap()`, `getUsers()`, etc.

### `page`

Standard Playwright page fixture (overridden to ensure API mocks are set up).

- **Type**: `Page`
- **Usage**: Standard Playwright page interactions

### `resetStores` (Auto Fixture)

Automatically resets stores and sets up monitoring before each test.

- **Auto**: Yes (runs automatically)
- **What it does**:
  - Resets mock data store
  - Resets ID counter
  - Clears failed requests
  - Sets up API monitoring
  - Sets up API mocks
  - Writes failure report after test if needed

## Configuration Options

Configure via `test.use()`:

```typescript
test.use({
  // User configuration
  user: { userName: 'testuser' }, // Partial<Account>
  autoAuthenticate: true, // boolean, default: false

  // Data counts (automatically populates stores)
  locationCount: 2, // number - creates 2 locations
  tapCount: 3, // number - creates 3 taps per location
  deviceCount: 1, // number - creates 1 device
  beverageCount: 5, // number - creates 5 beverages
  organizationCount: 2, // number - creates 2 organizations
});
```

## Migration from test.beforeEach

**Before:**

```typescript
import { test, expect } from '@playwright/test';
import {
  setupAPIMonitoring,
  clearFailedRequests,
} from '../../fixtures/api-monitoring';
import {
  mockAuthenticatedUser,
  resetMockStore,
} from '../../fixtures/entity-fixtures';

test.beforeEach(async ({ page }) => {
  setupAPIMonitoring(page, test.info().file, test.info().title);
  resetMockStore();
  clearFailedRequests();
  await mockAuthenticatedUser(page);
});
```

**After:**

```typescript
import { test, expect } from '../../fixtures/test-fixtures';

test.use({ autoAuthenticate: true });

// No beforeEach needed! Everything is handled automatically.
```

## Helper Functions

For complex scenarios, use helper functions from `entity-fixtures.ts`:

- `mockAuthenticatedUser(page, overrides?)` - Set up authenticated user
- `mockLocationWithTaps(page, tapCount)` - Create location with taps
- `mockTapWithKeg(page)` - Create tap with active keg
- `mockDeviceWithTaps(page, tapCount)` - Create device with taps
- `mockBeverageWithPours(page, pourCount)` - Create beverage with pour history
- `mockUserWithOrganizations(page, orgCount)` - Create user with organizations
- `mockEmptyState(page)` - Set up empty state
- `mockNewUserState(page, user?)` - Set up new user state for NUX flow

## Examples

### Example 1: Simple authenticated test

```typescript
import { test, expect } from '../fixtures/test-fixtures';

test.use({ autoAuthenticate: true });

test('should display user dashboard', async ({ page }) => {
  await page.goto('/dashboard');
  await expect(page.getByText('Welcome')).toBeVisible();
});
```

### Example 2: Test with custom data

```typescript
import { test, expect } from '../fixtures/test-fixtures';
import { mockLocationWithTaps } from '../fixtures/entity-fixtures';

test.use({ autoAuthenticate: true });

test('should display taps', async ({ page }) => {
  const { location, taps } = await mockLocationWithTaps(page, 3);

  await page.goto('/taps');
  await expect(page.getByText(location.name)).toBeVisible();
  for (const tap of taps) {
    await expect(page.getByText(tap.name)).toBeVisible();
  }
});
```

### Example 3: Manual data setup

```typescript
import { test, expect } from '../fixtures/test-fixtures';
import { createMockLocation } from '../fixtures/test-data';

test.use({ autoAuthenticate: true });

test('should handle custom location', async ({ page, mockStore }) => {
  const customLocation = createMockLocation({ name: 'My Custom Location' });
  mockStore.setLocation(customLocation);

  await page.goto('/locations');
  await expect(page.getByText('My Custom Location')).toBeVisible();
});
```

## Benefits

1. **No repetition** - No need for `test.beforeEach` in every file
2. **Automatic cleanup** - Stores are reset automatically
3. **Type-safe** - Full TypeScript support
4. **Flexible** - Use `test.use()` to configure per file or per test
5. **Composable** - Fixtures can depend on each other
6. **On-demand** - Only fixtures you use are set up
