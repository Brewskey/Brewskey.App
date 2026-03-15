import { isWeb } from './isWeb';

type NfcManagerModule = typeof import('react-native-nfc-manager');

let cached: NfcManagerModule | null | undefined = undefined;

/**
 * Returns react-native-nfc-manager when not on web; otherwise null.
 * Use for writing to physical NFC cards only. Do not load on web to avoid crashes.
 */
export function getNfcManager(): NfcManagerModule | null {
  if (isWeb()) {
    return null;
  }
  if (cached !== undefined) {
    return cached ?? null;
  }
  try {
    const mod = require('react-native-nfc-manager') as NfcManagerModule | undefined;
    cached = mod != null ? mod : null;
    return cached;
  } catch {
    cached = null;
    return null;
  }
}
