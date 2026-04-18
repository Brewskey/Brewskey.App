import { isWeb } from './isWeb';

// HCE module type: default export from the package (TurboModule with isPlatformSupported, beginSession, startHCE, onEvent, respondAPDU, etc.)
// eslint-disable-next-line @typescript-eslint/no-explicit-any
type HCEModule = any;

let cached: HCEModule | null | undefined;

/**
 * Returns the HCE native module from @icedevml/react-native-host-card-emulation when not on web; otherwise null.
 * Use for pour flow (phone as card). Do not load on web to avoid crashes.
 */
export function getHCEModule(): HCEModule | null {
  if (isWeb()) {
    return null;
  }
  if (cached !== undefined) {
    return cached;
  }
  try {
    // Sync lazy load of optional native module (must not import at module scope)
    // eslint-disable-next-line @typescript-eslint/no-require-imports -- conditional native require
    const pkg = require('@icedevml/react-native-host-card-emulation');
    cached = pkg?.default ?? pkg ?? null;
    return cached;
  } catch {
    cached = null;
    return null;
  }
}
