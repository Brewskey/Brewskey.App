import * as Application from 'expo-application';
import Constants from 'expo-constants';
import * as Updates from 'expo-updates';
import { Platform } from 'react-native';

/**
 * User-facing app version from native metadata (store build).
 * Prefers `expo-application` values; falls back to `expo-constants` (e.g. web).
 */
export function getNativeAppVersionLabel(): string {
  const version =
    Application.nativeApplicationVersion ??
    Constants.expoConfig?.version ??
    Constants.nativeApplicationVersion ??
    '';
  const build =
    Application.nativeBuildVersion ?? Constants.nativeBuildVersion ?? '';
  if (version && build) {
    return `${version} (${build})`;
  }
  if (version) {
    return version;
  }
  if (build) {
    return build;
  }
  return 'Unknown';
}

/**
 * EAS Update details when `expo-updates` is enabled (release / preview builds).
 * Null in development, Expo Go, or on web.
 */
export function getOtaDetailsLabel(): string | null {
  if (Platform.OS === 'web') {
    return null;
  }
  if (!Updates.isEnabled) {
    return null;
  }

  const parts: string[] = ['OTA'];

  if (Updates.runtimeVersion) {
    parts.push(`runtime ${Updates.runtimeVersion}`);
  }
  if (Updates.channel) {
    parts.push(`channel ${Updates.channel}`);
  }
  if (Updates.updateId) {
    const shortId = Updates.updateId.slice(0, 8);
    parts.push(`update ${shortId}`);
  }
  parts.push(
    Updates.isEmbeddedLaunch ? 'embedded bundle' : 'downloaded bundle',
  );

  return parts.join(' · ');
}
