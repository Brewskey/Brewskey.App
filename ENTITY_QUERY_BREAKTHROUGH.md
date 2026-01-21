# Entity Query Breakthrough - Debugging Notes

## Key Discovery

The API mocks ARE working! Added debug logging and confirmed:
- `[MOCK] GET organizations(2) -> FOUND | Available: [2]`
- Mock returns 200 response with organization data
- React Query receives the data successfully

## The Real Problem

TapForm doesn't render even though the organization query succeeds because:

1. **Initial Render**: organization is undefined (query loading)
2. **TapForm returns null** (line 56: `if (!organization) return null;`)
3. **Query Completes**: organization data arrives
4. **Re-render Should Happen**: But TapForm still shows nothing

## Working vs Failing Pattern

### Beverage Edit (WORKS ✅)
```typescript
const { data: beverage, isLoading } = useGetBeverageById(beverageId);

if (isLoading || !beverage) {
  return <Container><LoadingIndicator /></Container>; // ✅ Returns UI, stays mounted
}

return <Container><BeverageForm beverage={beverage} /></Container>;
```

### TapForm (FAILS ❌)
```typescript
const { data: organization } = useGetOrganizationById(organizationId);

if (!organization) {
  return null; // ❌ Returns null, but should still re-render when query completes
}

return <Form><TapForm /></Form>;
```

## Possible Issues

1. **ErrorBoundary Interference**: If TapForm throws during initial render, ErrorBoundary might prevent re-renders
2. **Form Context Timing**: SubmitButton tries to use form context before Form provider is ready
3. **React Suspense/Concurrent Mode**: Maybe async rendering is affecting component lifecycle
4. **Parent Component Blocking**: NewTapScreen might not be triggering child re-renders

## Next Steps

1. Try adding LoadingIndicator to TapForm instead of returning null
2. Check if ErrorBoundary is catching errors during initial render
3. Add isLoading check to TapForm
4. Compare component trees between working and failing screens
