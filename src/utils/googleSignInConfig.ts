/**
 * Google Sign-In OAuth client IDs (Google Cloud Console → Credentials).
 *
 * - `webClientId` is the same OAuth 2.0 "Web application" client ID used by
 *   ALL three platforms:
 *     - Web (`expo-auth-session` in `googleSignIn.ts`) opens Google's auth
 *       page using this id directly.
 *     - iOS / Android (`@react-native-google-signin/google-signin`) request
 *       an ID token whose audience (`aud`) is this id, regardless of the
 *       per-platform client id used to actually launch the system sheet.
 *   The backend (`google_id_token` OAuth grant in
 *   `ApplicationOAuthProvider.cs`) validates incoming tokens against this
 *   same value (`Google.WebClientId` in Web.config).
 *
 *   IMPORTANT for web: the redirect URI returned by `makeRedirectUri()` (the
 *   page that opened the popup — usually the app's origin) MUST be added to
 *   the Web OAuth client's "Authorized redirect URIs" list in Google Cloud
 *   Console, otherwise Google rejects the request before the popup opens.
 *   Add at least `http://localhost:8081` for local dev plus every production
 *   origin (e.g. `https://app.brewskey.com`).
 *
 * - `iosClientId` is the iOS-flavoured OAuth client (bundle id
 *   `com.brewskey.app`). Required by the iOS Google Sign-In flow even though
 *   the eventual ID token's audience is the web client id.
 *
 * - On Android no separate android client id is needed in code; the platform
 *   client (with package name + SHA-1) is matched implicitly. Known SHA-1
 *   fingerprints for `com.brewskey.app` that must be registered on the
 *   Android OAuth client in Google Cloud Console:
 *     - EAS keystore (all `eas build` profiles):
 *         9D:49:56:87:7B:E7:F7:47:B5:0B:38:EF:50:C7:7C:90:13:E8:1A:53
 *     - Google Play App Signing key (add once published — Play Console ›
 *       App integrity › App signing): TBD.
 *     - Per-developer debug keystore (`~/.android/debug.keystore`): only
 *       needed for `npx expo run:android` on that specific machine. Each
 *       developer has their own; add your own fingerprint to the Android
 *       OAuth client if you want Google Sign-In to work locally.
 *
 * Replace the placeholders below before shipping. To avoid committing real
 * credentials, prefer moving these to EAS Secrets (`process.env.EXPO_PUBLIC_*`)
 * or an `app.config.ts` reading from `extra`.
 */
export const GOOGLE_WEB_CLIENT_ID =
  '892379035045-csrl78mqg7du8ihe4bfj5ng3d0scjehf.apps.googleusercontent.com';

export const GOOGLE_IOS_CLIENT_ID =
  '892379035045-ld6ai6u7649on1h33858rmk4c31rs3eu.apps.googleusercontent.com';

/**
 * True when both the Web client ID has been configured. Used by the UI to
 * decide whether to render the Google sign-in button at all (we hide it in
 * unconfigured environments rather than show a button that always errors).
 */
export const isGoogleSignInConfigured = (): boolean =>
  !GOOGLE_WEB_CLIENT_ID.startsWith('__REPLACE_');
