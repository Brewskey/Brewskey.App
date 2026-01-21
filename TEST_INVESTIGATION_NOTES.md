# Test Investigation Notes

## Current Status
- **156 passing / 39 failing** (80% pass rate)
- Fixed 11 tests from initial 50 failures
- Main categories of remaining failures identified

## Deep Dive: Tap & Location Query Failures

### Problem Description
Multiple tests are failing because screens that query for entities by ID are not finding those entities, even though they were added to `mockStore` before navigation:

1. **Tap Create Tests** (4 tests) - TapForm not rendering because `useGetOrganizationById` returns null
2. **Tap Edit Tests** (4 tests) - Similar issue with tap/org queries  
3. **Location Details Tests** (3 tests) - `useGetLocationById` returns null even though location was added to mockStore
4. **Keg Edit Tests** (4 tests) - Similar query issue

### Investigation Findings

#### Mock Infrastructure is Correct
- ✅ `mockStore` has proper getter/setter methods for all entity types
- ✅ `setupAPIMocks` intercepts OData requests via `page.route()`
- ✅ Route handlers check mockStore for requested entities
- ✅ `case 'organizations': return mockStore.getOrganization(id);` exists
- ✅ `case 'locations': return mockStore.getLocation(id);` exists

#### Test Setup Pattern is Correct
```typescript
// This pattern is used correctly:
const organization = createMockOrganization();
mockStore.setOrganization(organization);
await page.goto(`/taps/new?organizationId=${organization.id}`);
```

#### But Queries Still Fail
The screens load but the React Query hooks return null:
- `useGetOrganizationById(orgId)` returns `{ data: undefined }`
- `useGetLocationById(locId)` returns `{ data: undefined }`

### Possible Root Causes

1. **Query Key Mismatch**
   - React Query uses query keys to cache data
   - Maybe the query keys don't match what the route interceptor expects

2. **OData Query String Parsing**
   - The mock routes parse OData URLs
   - Maybe the actual queries use different URL formats than expected

3. **Timing Issue**
   - Maybe React Query caches "not found" before mockStore is populated
   - Or queries run before route interceptors are fully set up

4. **Entity ID Type Mismatch**
   - IDs might be numbers in mockStore but strings in queries (or vice versa)
   - The parseODataQuery function might not handle ID conversions correctly

5. **Related Entity Resolution**
   - Some entities have nested objects (e.g., `tap.organization.id`)
   - Maybe the mock responses don't include all required nested data

### Next Steps to Debug

1. **Add Logging to Route Handlers**
   - Log every intercepted request to see what's actually being queried
   - Log mockStore contents to verify entities are present

2. **Check Actual HTTP Requests**
   - Use Playwright's network capture to see exact query URLs
   - Compare to what parseODataQuery expects

3. **Test Simple Query First**
   - Create a minimal test that just queries one entity
   - Verify basic mock->query flow works

4. **Check Working Tests**
   - Find tests that DO successfully query entities
   - Compare their setup to failing tests

5. **Verify ID Consistency**
   - Ensure IDs are consistently typed (number vs string)
   - Check if ID conversion is handled in all code paths

## Alternative Approach

Since these query-dependent tests are blocked, we could:
1. Focus on tests that don't require entity queries (form validation, navigation, etc.)
2. Create simpler fixture helpers that guarantee query success
3. Consider if the mock infrastructure needs refactoring

## Working Test Categories

These tests ARE passing and can serve as examples:
- ✅ Authentication tests (login, register, password reset)
- ✅ Beverage create/edit tests (use pickers successfully)
- ✅ Device tests (partially working)
- ✅ Home screen tests
- ✅ Many NUX tests (after routing fixes)

The key difference: These tests either don't query by ID, or they use `mockTapWithKeg` / `mockLocationWithTaps` helpers that set up data differently.

## Recommendation

Before continuing to fix individual tests, we should:
1. Understand why location-details tests fail (they worked before?)
2. Check git history to see if mock infrastructure changed recently
3. Consider if we need to refactor how entity queries are mocked
4. Document the correct pattern for tests that need entity queries
