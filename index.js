/* eslint-disable import-x/order */
/* eslint-disable import-x/first */
/* eslint-disable import/first */
// Custom entry point - Load polyfills BEFORE expo-router
// This ensures Buffer and other globals are available before any code runs

// SSE: Hermes/iOS/Android have no EventSource — install before expo-router evaluates.
import './src/eventSourcePolyfill';

// Initialize Buffer polyfill FIRST - before any other imports
import { Buffer } from 'buffer';
import * as Crypto from 'expo-crypto';

// Set Buffer on global for React Native/Node environments
if (typeof global !== 'undefined' && typeof global.Buffer === 'undefined') {
  global.Buffer = Buffer;
}

// Also set it on window for web environments
if (typeof window !== 'undefined' && typeof window.Buffer === 'undefined') {
  window.Buffer = Buffer;
}

if (typeof global !== 'undefined' && typeof global.crypto === 'undefined') {
  global.crypto = Crypto;
}
if (typeof window !== 'undefined' && typeof window.crypto === 'undefined') {
  window.crypto = Crypto;
}

// Import other polyfills (expo-location mocks, etc.)
import './src/polyfills';

import 'react-native-gesture-handler';

// Import expo-router entry - MUST be last
import 'expo-router/entry';
