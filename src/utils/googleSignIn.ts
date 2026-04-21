import * as React from 'react';

import {
  makeRedirectUri,
  ResponseType,
  useAuthRequest,
} from 'expo-auth-session';

import { GOOGLE_WEB_CLIENT_ID } from './googleSignInConfig';

import type {
  AuthRequestPromptOptions,
  DiscoveryDocument,
} from 'expo-auth-session';

// NOTE: `WebBrowser.maybeCompleteAuthSession()` (required so the popup window
// can post the auth result back to the opener) is invoked from
// `src/routes/_layout.tsx` so it runs as soon as the bundle loads — including
// in the popup window itself, regardless of which route the redirect URI
// happens to land on.

export const isGoogleSignInAvailable = true;

export type GoogleSignInResult =
  | { type: 'success'; idToken: string }
  | { type: 'cancelled' };

/**
 * Google's OpenID Connect discovery endpoints. Hard-coded rather than fetched
 * via `useAutoDiscovery` so the first paint of the login screen doesn't need a
 * round-trip to Google. Only `authorizationEndpoint` is required for the
 * implicit `id_token` flow we use here.
 */
const GOOGLE_DISCOVERY: DiscoveryDocument = {
  authorizationEndpoint: 'https://accounts.google.com/o/oauth2/v2/auth',
  tokenEndpoint: 'https://oauth2.googleapis.com/token',
  revocationEndpoint: 'https://oauth2.googleapis.com/revoke',
};

/**
 * Web equivalent of `useGoogleSignIn` from `googleSignIn.native.ts`. Uses
 * `expo-auth-session` to open Google's OAuth page in a popup and reads the
 * `id_token` back from the redirect URL fragment.
 *
 * Why `ResponseType.IdToken` (Implicit ID Token flow):
 * - We only need an ID token; the backend never calls Google APIs on the
 *   user's behalf, so an `access_token` (and the code-exchange step needed to
 *   get one) would just be dead weight.
 * - Google's "Web application" OAuth client requires `client_secret` to swap
 *   an authorization code for tokens, and there is no safe way to ship a
 *   client secret in a browser bundle. The implicit flow avoids that.
 * - The resulting ID token has `aud === GOOGLE_WEB_CLIENT_ID`, the same value
 *   the backend (`ApplicationOAuthProvider.GrantGoogleIdToken`) validates
 *   against — so the same `Google.WebClientId` appSetting works for both web
 *   and native.
 *
 * Caveats:
 * - The redirect URI returned by `makeRedirectUri()` (e.g. the current origin
 *   in production, or `http://localhost:8081` in dev) MUST be added to the
 *   Web OAuth client's "Authorized redirect URIs" list in Google Cloud
 *   Console. Without it Google rejects the request before the popup loads.
 * - PKCE is disabled because Google's implicit `id_token` flow does not
 *   accept a `code_challenge` parameter.
 */
export const useGoogleSignIn = (): {
  signIn: () => Promise<GoogleSignInResult>;
  isReady: boolean;
} => {
  const redirectUri = React.useMemo(() => makeRedirectUri(), []);

  const [request, , promptAsync] = useAuthRequest(
    {
      clientId: GOOGLE_WEB_CLIENT_ID,
      redirectUri,
      responseType: ResponseType.IdToken,
      scopes: ['openid', 'email', 'profile'],
      usePKCE: false,
      extraParams: {
        // Forces Google to return tokens as URL-fragment query params instead
        // of via `form_post`, which is what `expo-auth-session` parses on web.
        nonce: 'brewskey-google-id-token',
      },
    },
    GOOGLE_DISCOVERY,
  );

  const signIn = React.useCallback(async (): Promise<GoogleSignInResult> => {
    if (!request) {
      throw new Error('Google sign-in request is not ready yet.');
    }

    const promptOptions: AuthRequestPromptOptions = {
      // Default to a popup on web; on native this option is ignored.
      windowFeatures: { width: 500, height: 650 },
    };
    const result = await promptAsync(promptOptions);

    if (result.type === 'cancel' || result.type === 'dismiss') {
      return { type: 'cancelled' };
    }
    if (result.type !== 'success') {
      const description =
        ('error' in result && result.error?.message) ||
        ('params' in result && result.params?.error_description) ||
        ('params' in result && result.params?.error) ||
        'Google sign-in failed.';
      throw new Error(description);
    }

    const idToken = result.params?.id_token;
    if (!idToken) {
      throw new Error(
        'Google sign-in succeeded but no ID token was returned. Verify the OAuth client is a "Web application" type and the redirect URI is registered.',
      );
    }

    return { type: 'success', idToken };
  }, [promptAsync, request]);

  return { signIn, isReady: !!request };
};

/**
 * No-op on web: `expo-auth-session` does not maintain a persistent Google
 * session on our behalf — Google's own cookie in the browser is all there is,
 * and we don't want to globally sign the user out of Google when they sign
 * out of Brewskey. Provided to match the native API.
 */
export const signOutFromGoogle = async (): Promise<void> => {};
