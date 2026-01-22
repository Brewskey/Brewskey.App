---
name: Playwright Test Fixing
overview: Run all Playwright tests using the Playwright UI test runner, collect failures, create a todo list, and systematically fix each failing test while ensuring testID compliance.
todos:
  - id: setup-servers
    content: Start Expo web server and Playwright UI test runner
    status: completed
  - id: navigate-ui
    content: Navigate to Playwright UI using browser MCP and take initial snapshot
    status: completed
  - id: run-all-tests
    content: Execute all tests via Playwright UI and monitor progress
    status: completed
  - id: collect-errors
    content: Systematically collect all test failures with error details
    status: completed
  - id: create-todo-list
    content: Generate prioritized todo list of tests to fix
    status: completed
  - id: fix-critical-failures
    content: Fix tests that completely fail to run
    status: completed
  - id: fix-testid-compliance
    content: Fix tests using text-based locators, convert to testID
    status: completed
  - id: add-missing-testids
    content: Add testID props to components that are missing them
    status: completed
  - id: fix-assertions
    content: Fix assertion failures and timing issues
    status: completed
  - id: fix-submitbutton-form-context
    content: Fix SubmitButton form context null error in TapForm and KegForm
    status: completed
  - id: fix-loading-patterns
    content: Apply LoadingIndicator pattern to prevent null return issues
    status: completed
  - id: fix-nux-tests
    content: Fix NUX partial completion tests by creating mockLocationOnly helper
    status: completed
  - id: verify-all-pass
    content: Run complete test suite and verify all tests pass
    status: pending
---

# Playwright Test Execution and Fixing Plan

## Phase 1: Test Execution Setup

### Start Development Server and Playwright UI

1. **Start the Expo web server** (required for tests to run)

- Run `npm run web` in background terminal
- Wait for server to be ready at `http://localhost:8081`

2. **Launch Playwright UI Test Runner**

- Run `npm run test:e2e:ui` which executes `playwright test --ui`
- This opens a browser-based UI at a local port (typically http://localhost:9323)

3. **Navigate to Playwright UI using browser MCP tools**

- Use `user-playwright-browser_navigate` to open the Playwright UI
- Take snapshot to see the test tree structure

## Phase 2: Test Execution and Error Collection

### Run All Tests and Collect Failures

1. **Use browser MCP to interact with Playwright UI**

- Click "Run all" button to execute all 50 test files
- Wait for test execution to complete (may take several minutes)
- Take snapshots throughout execution to monitor progress

2. **Identify failing tests**

- Use browser MCP to click on failed tests (shown in red)
- Capture error messages, stack traces, and failure reasons
- Document the following for each failure:
- Test file path and test name
- Error type (timeout, assertion failure, element not found, etc.)
- Specific error message
- Whether it's a testID compliance issue or actual functionality issue

3. **Generate comprehensive error report**

- Compile all failures into structured data
- Categorize by error type:
- TestID locator issues (text-based locators used)
- Element not found (missing testID props)
- Assertion failures
- Timeout issues
- Navigation issues
- Mock data issues

## Phase 3: Todo List Creation

### Create Prioritized Todo List

Based on collected errors, create todos organized by:

1. **Critical failures** (tests that completely fail to run)
2. **TestID compliance issues** (using text-based locators)
3. **Missing testID props** (components need testID support)
4. **Assertion failures** (expected vs actual mismatches)
5. **Timing/timeout issues**

Each todo item will include:

- Test file path
- Test name
- Error description
- Root cause analysis
- Proposed fix approach

## Phase 4: Systematic Test Fixing

### Fix Tests Iteratively

For each failing test, follow this process:

1. **Read the failing test file**

- Understand test intent and structure
- Identify the specific assertion or locator causing failure

2. **Identify root cause**

- Is it a missing testID prop in component?
- Is it using text-based locator instead of testID?
- Is it an incorrect assertion?
- Is it a mock data setup issue?

3. **Apply appropriate fix**

**For TestID compliance issues:**

- Replace `page.locator('text=...')` with `page.getByTestId('...')`
- Replace `page.locator('button:has-text(...)')` with `page.getByTestId('...')`
- If component doesn't have testID, add it to the component file

**For missing testID props:**

- Read the component file (e.g., [`src/common/Container.tsx`](src/common/Container.tsx))
- Add testID prop to component interface
- Pass testID to underlying element
- Update test to use the new testID

**For assertion failures:**

- Verify expected behavior is correct
- Update assertion to match actual behavior
- Or fix component if behavior is wrong

**For timing issues:**

- Add appropriate waits using `await expect().toBeVisible()`
- Increase timeout if necessary
- Ensure mock data is set up before navigation

4. **Re-run specific test**

- Use Playwright UI to run only the fixed test
- Verify it passes
- Check for any new issues introduced

5. **Update todo list**

- Mark test as completed
- Document any additional issues discovered
- Move to next test

## Key Files and Patterns

### Test Infrastructure

- [`tests/fixtures/test-fixtures.ts`](tests/fixtures/test-fixtures.ts) - Custom fixtures with auto-authentication
- [`tests/fixtures/page-objects.ts`](tests/fixtures/page-objects.ts) - Page Object Model classes
- [`tests/fixtures/api-mocks.ts`](tests/fixtures/api-mocks.ts) - Mock API data store
- [`tests/fixtures/test-data.ts`](tests/fixtures/test-data.ts) - Mock data factories
- [`playwright.config.ts`](playwright.config.ts) - Playwright configuration

### Common Components (likely to need testID props)

- [`src/common/Container.tsx`](src/common/Container.tsx)
- [`src/common/List.tsx`](src/common/List.tsx)
- [`src/common/ListItem.tsx`](src/common/ListItem.tsx)
- [`src/common/Header/HeaderNavigationButton.tsx`](src/common/Header/HeaderNavigationButton.tsx)
- [`src/common/form/DropdownInput.tsx`](src/common/form/DropdownInput.tsx)

### TestID Naming Convention (from .cursorrules)

- Use kebab-case: `submit-button`, `login-form`
- Be descriptive: `submit-button-create-location` not `submit-button`
- Include context: `input-name` not `name`

## Success Criteria

1. All 50 test files pass successfully
2. All tests use testID-based locators (no text-based locators)
3. All critical components have testID props
4. Test execution is stable (no flaky tests)
5. All tests follow patterns from [`tests/fixtures/test-fixtures.ts`](tests/fixtures/test-fixtures.ts)

## Monitoring Progress

Throughout execution:

- Keep track of fixed vs remaining tests
- Document common patterns of failures
- Update todos as new issues are discovered
- Re-run full suite periodically to catch regressions