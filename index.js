// Custom entry point - Load polyfills BEFORE expo-router
// This ensures Buffer and other globals are available before any code runs

// Initialize Buffer polyfill FIRST - before any other imports
import { Buffer } from 'buffer';

import 'setimmediate';

// Set Buffer on global for React Native/Node environments
if (typeof global !== 'undefined' && typeof global.Buffer === 'undefined') {
  global.Buffer = Buffer;
}

// Also set it on window for web environments
if (typeof window !== 'undefined' && typeof window.Buffer === 'undefined') {
  window.Buffer = Buffer;
}

// Import other polyfills (expo-location mocks, etc.)
import './src/polyfills';

// Import expo-router entry - MUST be last
import 'expo-router/entry';
