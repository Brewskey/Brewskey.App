export const isAppleSignInAvailable = false;

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
    throw new Error('Apple sign-in is only available on supported iOS devices.');
  },
  isReady: true,
  isAvailable: false,
});
