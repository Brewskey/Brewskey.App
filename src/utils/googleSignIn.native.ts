import {
  GoogleSignin,
  isErrorWithCode,
  isSuccessResponse,
  statusCodes,
} from '@react-native-google-signin/google-signin';

import { GOOGLE_IOS_CLIENT_ID, GOOGLE_WEB_CLIENT_ID } from './googleSignInConfig';

export const isGoogleSignInAvailable = true;

export type GoogleSignInResult =
  | { type: 'success'; idToken: string }
  | { type: 'cancelled' };

let isConfigured = false;

/**
 * Configures the native Google Sign-In SDK. Safe to call multiple times — it
 * only forwards to the native module once. The web client id is what matters
 * for backend validation: ID tokens issued on iOS and Android both have it as
 * their `aud` claim.
 */
const configureGoogleSignIn = (): void => {
  if (isConfigured) {
    return;
  }
  GoogleSignin.configure({
    webClientId: GOOGLE_WEB_CLIENT_ID,
    iosClientId: GOOGLE_IOS_CLIENT_ID,
    scopes: ['email', 'profile'],
  });
  isConfigured = true;
};

/**
 * Maps a thrown error from `@react-native-google-signin/google-signin` into a
 * human-readable message. The library throws errors with a `code` property
 * (string on iOS, sometimes numeric on Android) but its `message` is often
 * just the raw code (e.g. `"DEVELOPER_ERROR"`), which is useless on its own
 * when bubbled up to a snackbar. We translate the common ones here so the UI
 * error tells you what to actually fix instead of just `"DEVELOPER_ERROR"`.
 */
const describeGoogleSignInError = (error: unknown): string => {
  if (!isErrorWithCode(error)) {
    return error instanceof Error ? error.message : 'Google sign-in failed.';
  }

  const code = String(error.code);
  // Android: code 10 / "DEVELOPER_ERROR" is *always* a config mismatch
  // between the installed APK and the OAuth client in Google Cloud Console
  // (wrong package name, missing/extra SHA-1, or no Android OAuth client at
  // all for this project). The fix lives outside the app — see
  // `googleSignInConfig.ts` for the list of SHA-1 fingerprints that need to
  // be registered on the Android OAuth client.
  if (code === '10' || code === 'DEVELOPER_ERROR') {
    return 'Google sign-in failed: DEVELOPER_ERROR (10). The signing certificate (SHA-1) of this build is not registered on the Android OAuth client in Google Cloud Console for package com.brewskey.app. Run `cd android && ./gradlew signingReport` to print the SHA-1 of the keystore this APK was signed with, then add it to the Android OAuth client.';
  }
  if (code === statusCodes.PLAY_SERVICES_NOT_AVAILABLE) {
    return 'Google sign-in failed: Google Play Services is not available or out of date on this device.';
  }
  if (code === statusCodes.IN_PROGRESS) {
    return 'Google sign-in is already in progress.';
  }
  const baseMessage = error.message || 'Google sign-in failed.';
  return `${baseMessage} (code ${code})`;
};

/**
 * Triggers the native sign-in UI and returns the resulting Google ID token.
 * Cancellation (user dismissed the sheet) is reported as a `cancelled` result
 * rather than an error, so the calling mutation can no-op silently. The
 * library's own `signIn()` already maps the native cancellation code to a
 * `{ type: 'cancelled' }` response, so we only need to check the result type
 * here. Any other failure (no Play Services, network error, missing ID token)
 * is rethrown — with a translated message via `describeGoogleSignInError` —
 * so the React Query mutation surfaces something useful to the snackbar
 * instead of a bare error code like `"DEVELOPER_ERROR"`.
 */
const signInWithGoogle = async (): Promise<GoogleSignInResult> => {
  configureGoogleSignIn();

  try {
    await GoogleSignin.hasPlayServices({ showPlayServicesUpdateDialog: true });

    const response = await GoogleSignin.signIn();

    if (!isSuccessResponse(response)) {
      return { type: 'cancelled' };
    }

    const { idToken } = response.data;
    if (!idToken) {
      throw new Error(
        'Google sign-in succeeded but no ID token was returned. Verify webClientId is configured.',
      );
    }

    return { type: 'success', idToken };
  } catch (error) {
    // Always log the raw error so the full code + native stack are visible in
    // Metro / `adb logcat` even if the snackbar truncates the translated
    // message.
    // eslint-disable-next-line no-console
    console.error('[googleSignIn.native] sign-in failed', error);
    throw new Error(describeGoogleSignInError(error));
  }
};

/**
 * Hook form mirrors the web variant's shape (`{ signIn, isReady }`) so the
 * calling React Query mutation can be platform-agnostic. On native the SDK is
 * always ready once the JS bundle has loaded, so `isReady` is trivially true.
 */
export const useGoogleSignIn = (): {
  signIn: () => Promise<GoogleSignInResult>;
  isReady: boolean;
} => ({
  signIn: signInWithGoogle,
  isReady: true,
});

export const signOutFromGoogle = async (): Promise<void> => {
  try {
    await GoogleSignin.signOut();
  } catch {
    // Best-effort: signing out of Google should not block app sign-out.
  }
};
