// Buffer polyfill is now loaded in index.js entry point
// This file contains other polyfills and mocks

// Mock expo-location for Playwright tests
// The actual mocking is done via addInitScript in test fixtures
// This file just sets up a flag for test environment detection
if (typeof window !== 'undefined') {
  // Set up a flag to indicate we're in a test environment
  (window as any).__PLAYWRIGHT_TEST__ = true;
}
