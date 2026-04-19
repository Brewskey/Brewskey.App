import { ExpoEventSource } from '@falcondev-oss/expo-event-source-polyfill';
// @ts-expect-error RN internal API — recommended in expo-event-source-polyfill README
import { polyfillGlobal } from 'react-native/Libraries/Utilities/PolyfillFunctions';

/**
 * Side-effect import from index.js must run before `expo-router/entry` so globals exist when the bundle loads.
 * Same pattern as https://github.com/falcondev-oss/expo-event-source-polyfill#usage (polyfillGlobal).
 * Web already provides EventSource; keep native browser implementation.
 */
if (
  typeof (globalThis as unknown as { EventSource?: unknown }).EventSource ===
  'undefined'
) {
  polyfillGlobal('EventSource', () => ExpoEventSource);
}
