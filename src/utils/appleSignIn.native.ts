import * as React from 'react';

import * as AppleAuthentication from 'expo-apple-authentication';

export const isAppleSignInAvailable = true;

export type AppleSignInResult =
  | {
      type: 'success';
      identityToken: string;
      fullName: string | null;
      authorizationCode: string | null;
    }
  | { type: 'cancelled' };

const formatFullName = (
  fullName: AppleAuthentication.AppleAuthenticationFullName | null,
): string | null => {
  if (!fullName) {
    return null;
  }

  const nameParts = [
    fullName.givenName,
    fullName.middleName,
    fullName.familyName,
  ].filter(Boolean);

  return nameParts.length > 0 ? nameParts.join(' ') : null;
};

const isCancelledAppleSignIn = (error: unknown): boolean =>
  typeof error === 'object' &&
  error !== null &&
  'code' in error &&
  (error as { code?: string }).code === 'ERR_REQUEST_CANCELED';

const signInWithApple = async (): Promise<AppleSignInResult> => {
  try {
    const credential = await AppleAuthentication.signInAsync({
      requestedScopes: [
        AppleAuthentication.AppleAuthenticationScope.FULL_NAME,
        AppleAuthentication.AppleAuthenticationScope.EMAIL,
      ],
    });

    if (!credential.identityToken) {
      throw new Error(
        'Apple sign-in succeeded but no identity token was returned.',
      );
    }

    return {
      type: 'success',
      identityToken: credential.identityToken,
      fullName: formatFullName(credential.fullName),
      authorizationCode: credential.authorizationCode ?? null,
    };
  } catch (error) {
    if (isCancelledAppleSignIn(error)) {
      return { type: 'cancelled' };
    }
    throw error;
  }
};

export const useAppleSignIn = (): {
  signIn: () => Promise<AppleSignInResult>;
  isReady: boolean;
  isAvailable: boolean;
} => {
  const [isAvailable, setIsAvailable] = React.useState(false);
  const [isReady, setIsReady] = React.useState(false);

  React.useEffect(() => {
    let isMounted = true;

    AppleAuthentication.isAvailableAsync()
      .then((available) => {
        if (isMounted) {
          setIsAvailable(available);
        }
      })
      .catch(() => {})
      .finally(() => {
        if (isMounted) {
          setIsReady(true);
        }
      });

    return () => {
      isMounted = false;
    };
  }, []);

  return {
    signIn: signInWithApple,
    isReady,
    isAvailable,
  };
};
