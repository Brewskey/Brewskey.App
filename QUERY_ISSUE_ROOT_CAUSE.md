# Root Cause: Entity Query Failures

## Discovery

I've identified the exact difference between working and failing tests:

### Working Tests (e.g., beverage-create, tap-details, keg-details)
- **Don't query by ID during initial render** OR
- **Navigate to existing entities** that were set up by `mockTapWithKeg(page)`

Examples:
- `beverage-create`: BeverageForm doesn't query anything - renders immediately
- `tap-details`: Navigates to `/taps/${tap.id}` for an EXISTING tap created by `mockTapWithKeg`
- `keg-details`: Same pattern - views existing entity

### Failing Tests (e.g., tap-create, location-details)
- **Query for entities by ID during initial render**
- **Query happens BEFORE form/content can render**

Examples:
- `tap-create`: TapForm requires `organizationId` prop, then:
  ```typescript
  const { data: organization } = useGetOrganizationById(organizationId);
  if (!organization) {
    return null; // ❌ Form never renders
  }
  ```
- `location-details`: LocationDetailsScreen queries:
  ```typescript
  const { data: location } = useGetLocationById(locationId);
  if (!location) {
    return <NotFoundScreen />; // ❌ Never shows content
  }
  ```

## The Core Issue

The mock API interceptor (`page.route()`) **IS** correctly set up and **SHOULD** return entities from `mockStore`. However, React Query hooks are returning null/undefined even though:

1. ✅ Entity was added to mockStore before navigation
2. ✅ Route handler exists for the entity type
3. ✅ `setupAPIMocks` is called in test fixtures

## Hypothesis

Possible issues:
1. **Timing**: React Query might cache "not found" before route interceptor is fully ready
2. **URL Format**: OData query format might not match what `parseODataQuery` expects
3. **ID Type**: ID conversion between number/string might fail
4. **Query Keys**: React Query cache keys might not align with mock responses

## Immediate Workaround

For now, I'll focus on:
1. Tests that don't require entity queries (form validation, navigation)
2. Tests that use existing entities created by helper functions
3. Simpler failures (NUX query params, form state issues)

## Next Investigation Steps

1. Add console.log to `setupAPIMocks` route handlers to see actual requests
2. Check if requests are even reaching the route handlers
3. Compare network logs between working and failing scenarios
4. Test if a simple setTimeout before navigation helps (timing issue)
