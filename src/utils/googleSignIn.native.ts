import {
  GoogleSignin,
  isSuccessResponse,
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
 * Triggers the native sign-in UI and returns the resulting Google ID token.
 * Cancellation (user dismissed the sheet) is reported as a `cancelled` result
 * rather than an error, so the calling mutation can no-op silently. The
 * library's own `signIn()` already maps the native cancellation code to a
 * `{ type: 'cancelled' }` response, so we only need to check the result type
 * here. Any other failure (no Play Services, network error, missing ID token)
 * is rethrown so the React Query mutation surfaces it to the snackbar.
 */
const signInWithGoogle = async (): Promise<GoogleSignInResult> => {
  configureGoogleSignIn();

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
