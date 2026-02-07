# Project Constitution

This document serves as the foundational guide for all AI assistants and developers working on the Brewskey App v3 codebase. All prompts and code changes should adhere to these principles and best practices.

## Table of Contents

1. [Testing Best Practices](#testing-best-practices)
2. [Component Development](#component-development)
3. [Code Style & Architecture](#code-style--architecture)
4. [API & Data Management](#api--data-management)
5. [Loading and Error UI](#loading-and-error-ui)
6. [File Organization](#file-organization)
7. [Performance Guidelines](#performance-guidelines)
8. [Accessibility](#accessibility)
9. [Security](#security)

---

## Testing Best Practices

### TestID Requirements (MANDATORY)

**CRITICAL**: Always use `testID` props for components when creating locators in tests. Never use text-based locators (`has-text`, `text=`, etc.) or DOM-specific attributes unless absolutely necessary.

#### ✅ DO:

```typescript
// In component
<Button testID="submit-button" onPress={handleSubmit} title="Submit" />

// In test
await page.getByTestId('submit-button').click();
```

#### ❌ DON'T:

```typescript
// In test - AVOID text-based locators
await page.locator('button:has-text("Submit")').click();
await page.locator('text=Submit').click();
```

#### When Text-Based Locators Are Acceptable:

- **Only** for dynamic content that cannot be predicted (e.g., user-generated content, API responses)
- **Only** when no testID exists and cannot be added (legacy code)
- **Always** prefer adding a testID to the component first

#### TestID Naming Conventions:

- Use kebab-case: `submit-button`, `login-form`, `tap-details-header`
- Be descriptive: `submit-button-create-location` not just `submit-button`
- Include context: `input-name` not just `name`
- For lists: `locations-list`, `taps-list`
- For forms: `{action}-button-{entity}` (e.g., `submit-button-create-tap`)

### Test Structure

- Use the Page Object Model pattern (see `tests/fixtures/page-objects.ts`)
- Group related tests in describe blocks
- Use descriptive test names that explain what is being tested
- Mock API calls using the fixtures in `tests/fixtures/api-mocks.ts`
- Use `autoAuthenticate: true` when authentication is not the focus of the test
- **Do not set `timeout` in e2e tests** - use Playwright's default timeouts

### Waiting and Timeouts

**CRITICAL**: Rely on Playwright's built-in auto-waiting and timeouts. Do not add explicit waits for page loads or network idle.

#### ✅ DO:

```typescript
// Playwright automatically waits for elements to be actionable
await page.getByTestId('submit-button').click();
await expect(page.getByTestId('success-message')).toBeVisible();

// waitForResponse can be acceptable when you need to verify a specific API call completed
await page.getByTestId('submit-button').click();
await page.waitForResponse(/api\/taps\/\d+/); // Wait for specific API call if needed
```

#### ❌ DON'T:

```typescript
// AVOID explicit waits for page loads or network idle
await page.waitForLoadState('networkidle');
await page.waitForLoadState('load');
await page.waitForTimeout(1000);
```

#### Principles:

- **Trust Playwright's auto-waiting**: All actions (click, fill, etc.) automatically wait for elements to be ready
- **Use assertions**: `expect().toBeVisible()` automatically waits for the element
- **Rely on built-in timeouts**: Playwright's default timeouts handle most cases
- **Avoid page load waits**: Don't use `waitForLoadState('networkidle')` or `waitForLoadState('load')`
- **Avoid arbitrary timeouts**: Don't use `waitForTimeout()` - it's a code smell indicating flaky tests
- **waitForResponse is acceptable**: Can be used when you need to verify a specific API request completed, but prefer waiting for UI elements when possible

### Test Organization

- Place E2E tests in `tests/e2e/` organized by feature area
- Use descriptive file names: `tap-details.spec.ts`, `location-create.spec.ts`
- Keep tests focused on a single user flow or feature
- Use fixtures and helpers from `tests/fixtures/` to reduce duplication

### Test Data Setup (MANDATORY)

**CRITICAL**: All e2e tests must set up mocked data so they actually test functionality. Tests should not use conditional logic based on test data visibility.

#### ✅ DO:

```typescript
// Set up mocked data with specific permissions/state
const { tap } = await mockTapWithKeg(page, {
  permissions: ['EditTap'], // Explicitly set permissions
  hasFlowSensor: true, // Explicitly set state
});

await page.goto(`/tap/${tap.id}`);
await expect(page.getByTestId('button-edit-tap')).toBeVisible();
```

#### ❌ DON'T:

```typescript
// AVOID conditional logic based on test data
const editButton = page.getByTestId('button-edit-tap');
const isEditButtonVisible = await editButton
  .isVisible({ timeout: 2000 })
  .catch(() => false);
if (isEditButtonVisible) {
  // Test behavior...
}

// AVOID checking visibility with catch blocks
if (await statsTab.isVisible({ timeout: 2000 }).catch(() => false)) {
  await statsTab.click();
}
```

#### Principles:

- **Set up data explicitly**: Mock the exact state needed for the test (permissions, data presence, etc.)
- **Assert expected behavior**: Based on the mocked data, assert what should be true
- **No conditional logic**: Don't branch test logic based on what's visible - control visibility through mocked data
- **Predictable tests**: Each test should have a single, predictable outcome based on its setup

#### Example: Testing with and without permissions

```typescript
// Test WITH permissions - set up data to have permissions
test('should show edit button when user has permissions', async ({ page }) => {
  const { tap } = await mockTapWithKeg(page, {
    permissions: ['EditTap'],
  });

  await page.goto(`/tap/${tap.id}`);
  await expect(page.getByTestId('button-edit-tap')).toBeVisible();
});

// Test WITHOUT permissions - set up data to NOT have permissions
test('should hide edit button when user lacks permissions', async ({
  page,
}) => {
  const { tap } = await mockTapWithKeg(page, {
    permissions: [], // Explicitly no permissions
  });

  await page.goto(`/tap/${tap.id}`);
  await expect(page.getByTestId('button-edit-tap')).not.toBeVisible();
});
```

---

## Component Development

### Component Structure

- Use functional components with hooks
- Prefer TypeScript for type safety
- Export components from `index.ts` files when appropriate
- Keep components focused and single-purpose

### Props Interface

- Always define TypeScript interfaces for component props
- Include `testID?: string` in prop interfaces for interactive components
- Use descriptive prop names
- Document complex props with JSDoc comments

### Component Example:

```typescript
interface ButtonProps {
  title: string;
  onPress: () => void;
  testID?: string;
  type?: 'primary' | 'secondary' | 'clear';
}

export const Button: React.FC<ButtonProps> = ({ title, onPress, testID, type = 'primary' }) => {
  return (
    <TouchableOpacity onPress={onPress} testID={testID}>
      <Text>{title}</Text>
    </TouchableOpacity>
  );
};
```

### Common Components

- Use shared components from `src/common/` when possible
- Follow existing patterns for form inputs, buttons, lists
- Ensure all interactive elements have testID support

---

## Code Style & Architecture

### TypeScript

- Use strict TypeScript settings
- Avoid `any` types - use `unknown` or proper types instead
- Define interfaces for all data structures
- Use type inference where appropriate, but be explicit for public APIs

### React Patterns

- Use React Query (`@tanstack/react-query`) for data fetching
- Use React Hook Form for form management
- Prefer custom hooks for reusable logic
- Use Context API for global state (Auth, Settings, SnackBar)

### File Naming

- Use PascalCase for components: `TapDetailsScreen.tsx`
- Use camelCase for utilities and hooks: `useTapQueries.ts`
- Use kebab-case for test files: `TapDetailsScreen.spec.ts`

### Import Organization

- Group imports: external libraries, then internal modules
- Use absolute imports when configured
- Avoid circular dependencies

---

## API & Data Management

### API Client

- Use `@brewskey/js-api` package for API interactions
- All API calls should go through React Query hooks
- Create query hooks in `src/hooks/queries/`
- Use mutations for create/update/delete operations

### Data Fetching Pattern:

```typescript
// In hooks/queries/TapQueries.ts
export const useTap = (tapId: number) => {
  return useQuery({
    queryKey: ['tap', tapId],
    queryFn: () => TapDAO.getById(tapId),
  });
};
```

### Error Handling

- Handle errors at the query/mutation level
- Display user-friendly error messages via SnackBar context
- Log errors appropriately for debugging

---

## Loading and Error UI

### Error boundaries

- **Expo Router**: Layouts follow Expo best practices by exporting an `ErrorBoundary` component that receives `error` and `retry` from the router (see [Expo Router error handling](https://docs.expo.dev/router/error-handling/)). Export it from layout files (e.g. `(tabs)/(feed,stats,notifications,menu)/_layout.tsx` and `(tabs)/(nux)/_layout.tsx`). The fallback uses `RouteErrorFallback`, which shows `ErrorScreen`, a "Try again" button that calls both `retry()` and `useQueryErrorResetBoundary().reset()`, and in **development** displays the error message and stack so dev errors are visible.
- **QueryErrorResetBoundary**: Wraps the app at the root (`_layout.tsx`) so any route ErrorBoundary can call `reset()` for React Query errors.
- **Development**: Caught errors are logged with `console.error` in dev so they appear in LogBox; the fallback UI also shows error message and stack when `__DEV__` is true.
- **Scoped boundaries**: For smaller subtrees (e.g. `NotificationsList`), use the class `ErrorBoundary` from `common/ErrorBoundary` with a `fallbackComponent` so only that section shows the error UI.

### Loading UI

- **Full-page (Suspense)**: Use `ScreenFallback` from `common/ScreenFallback` as the single full-page loading fallback. It renders `Container` + optional `Header` + centered `LoadingIndicator`. Use it as `<Suspense fallback={<ScreenFallback shouldShowBackButton testID="..." />}>` around screen content that uses `useSuspenseQuery` or `useSuspenseInfiniteQuery`.
- **Inline / small**: Use `LoadingIndicator` from `common/LoadingIndicator` for spinners inside modals, forms, or tab content.
- **List load-more**: Use `LoadingListFooter` from `common/LoadingListFooter` as `ListFooterComponent` for infinite lists. It uses `LoadingIndicator` internally and accepts `isLoading`; give it testID `list-loading-footer` when needed for e2e.

### Data fetching and loading

- **Detail screens (single entity)**: Prefer `useSuspenseQuery` (e.g. `useSuspenseGetLocationById`, `useSuspenseGetDeviceById`, `useSuspenseGetTapById`, `useSuspenseGetBeverageById`). Wrap the screen (or the part that uses the hook) in `<Suspense fallback={<ScreenFallback ... />}>`. No manual `if (isLoading)` or `if (error)` branches; "not found" can remain as a conditional when the id is missing. Query errors are handled by the layout ErrorBoundary.
- **List screens**: Use `useInfiniteQuery` with `LoadingListFooter` for load-more. Where it fits, you can use `useSuspenseInfiniteQuery` and wrap with `<Suspense fallback={<ScreenFallback ... />}>` so the initial load shows the fallback; "load more" still uses `ListFooterComponent={<LoadingListFooter isLoading={...} />}`.
- **New screens**: Prefer `useSuspenseQuery` or `useSuspenseInfiniteQuery` so loading is handled by Suspense and the layout error boundary handles errors.

---

## File Organization

### Directory Structure

```
src/
  ├── common/          # Reusable UI components
  ├── components/      # Feature-specific components
  ├── screens/         # Screen components
  ├── hooks/           # Custom hooks
  │   ├── queries/     # React Query hooks
  │   └── context/     # Context providers
  ├── stores/          # State management (if needed)
  └── utils/           # Utility functions
```

### Component Location

- **Common components**: `src/common/` - reusable across features
- **Feature components**: `src/components/` - specific to features
- **Screens**: `src/screens/` - top-level route components

---

## Performance Guidelines

### React Performance

- Use `React.memo()` for expensive components that receive stable props
- Avoid unnecessary re-renders
- Use `useMemo()` and `useCallback()` judiciously (don't over-optimize)

### List Performance

- Use FlatList or SectionList for long lists
- Implement proper `keyExtractor` functions
- Use `getItemLayout` when item heights are known

### Image Optimization

- Use `expo-image` for optimized image loading
- Provide appropriate image sizes for different screen densities
- Lazy load images when possible

---

## Accessibility

### React Native Web

- Use semantic HTML elements when possible
- Provide proper ARIA labels for interactive elements
- Ensure keyboard navigation works correctly
- Test with screen readers

### Mobile

- Ensure touch targets are at least 44x44 points
- Provide proper accessibility labels
- Test with VoiceOver (iOS) and TalkBack (Android)

---

## Security

### Authentication

- Store tokens securely using `expo-secure-store`
- Never log sensitive information
- Validate user permissions before allowing actions

### API Security

- Always validate user permissions server-side
- Use HTTPS for all API calls
- Sanitize user inputs before sending to API

### Data Privacy

- Don't store sensitive data unnecessarily
- Clear sensitive data on logout
- Follow data retention policies

---

## Code Review Checklist

When reviewing or writing code, ensure:

- [ ] All interactive components have `testID` props
- [ ] Tests use `getByTestId()` instead of text-based locators
- [ ] E2E tests set up mocked data explicitly (no conditional logic based on visibility)
- [ ] Tests assert expected behavior based on mocked data setup
- [ ] E2E tests do not set `timeout` (use Playwright defaults)
- [ ] Tests rely on Playwright's built-in auto-waiting (no explicit `waitForLoadState` or `waitForTimeout`; `waitForResponse` is acceptable when needed)
- [ ] TypeScript types are properly defined
- [ ] Components follow the established patterns
- [ ] Error handling is implemented
- [ ] No console.log statements in production code
- [ ] Imports are organized correctly
- [ ] Code follows the project's formatting (Prettier)

---

## Migration & Legacy Code

### Handling Legacy Code

- When modifying legacy code, add testIDs if missing
- Update tests to use testIDs when touching legacy test files
- Document why text-based locators are used if they must remain

### Gradual Migration

- Prioritize adding testIDs to frequently tested components
- Update tests incrementally as components are modified
- Don't break existing functionality during migration

---

## Additional Resources

- React Native Documentation: https://reactnative.dev/
- Expo Documentation: https://docs.expo.dev/
- Playwright Documentation: https://playwright.dev/
- React Query Documentation: https://tanstack.com/query/latest

---

## Updates to This Document

This constitution should evolve with the project. When updating:

1. Document the reason for the change
2. Update relevant code examples
3. Notify the team of significant changes
4. Keep the document concise but comprehensive

---

**Last Updated**: 2024
**Version**: 1.0
