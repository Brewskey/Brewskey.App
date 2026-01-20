import { Buffer } from 'buffer';
global.Buffer = Buffer;

// Mock expo-location for Playwright tests
if (typeof window !== 'undefined' && (window as any).__PLAYWRIGHT_TEST__) {
  const mockLocation = (window as any).__EXPO_LOCATION_MOCK__;
  if (mockLocation) {
    // Try to intercept expo-location module if it's available
    // Note: This may not work if expo-location uses native modules
    // The API endpoint mock should handle the actual data fetching
  }
}
