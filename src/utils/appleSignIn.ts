const isPlaywrightAppleSignInAvailable = (): boolean =>
  typeof window !== 'undefined' &&
  Boolean(
    (
      window as Window & {
        __BREWSKEY_E2E_APPLE_SIGN_IN_AVAILABLE__?: boolean;
      }
    ).__BREWSKEY_E2E_APPLE_SIGN_IN_AVAILABLE__,
  );

export const isAppleSignInAvailable = isPlaywrightAppleSignInAvailable();

export type AppleSignInResult =
  | {
      type: 'success';
      identityToken: string;
      fullName: string | null;
      authorizationCode: string | null;
    }
  | { type: 'cancelled' };

export const useAppleSignIn = (): {
  signIn: () => Promise<AppleSignInResult>;
  isReady: boolean;
  isAvailable: boolean;
} => ({
  signIn: async () => {
    if (isPlaywrightAppleSignInAvailable()) {
      return {
        authorizationCode: 'playwright-apple-authorization-code',
        fullName: 'Playwright Apple User',
        identityToken: 'playwright-apple-identity-token',
        type: 'success',
      };
    }
    throw new Error(
      'Apple sign-in is only available on supported iOS devices.',
    );
  },
  isReady: true,
  isAvailable: isAppleSignInAvailable,
});
