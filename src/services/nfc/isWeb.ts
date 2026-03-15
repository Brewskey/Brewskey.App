import { Platform } from 'react-native';

/**
 * True when running on web. Use to avoid loading native NFC/HCE modules
 * (they are not available on web and would crash).
 */
export function isWeb(): boolean {
  return Platform.OS === 'web';
}
