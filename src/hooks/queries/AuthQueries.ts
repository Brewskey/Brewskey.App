import { Auth } from '@brewskey/js-api';
import { useMutation, useQueryClient } from '@tanstack/react-query';

import { setAuthSession } from 'hooks/context/AuthContext';
import { useAppleSignIn } from 'utils/appleSignIn';
import { signOutFromGoogle, useGoogleSignIn } from 'utils/googleSignIn';

import type {
  AuthResponse,
  ChangePasswordArgs,
  UserCredentials,
} from '@brewskey/js-api';
import type { UseMutationResult } from '@tanstack/react-query';

export const useLogin = (): UseMutationResult<
  AuthResponse,
  Error,
  UserCredentials
> => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (params: UserCredentials) => Auth.login(params),
    onSuccess: (data) => {
      setAuthSession(queryClient, data);
    },
  });
};

/**
 * Triggers the platform-appropriate Google sign-in flow (native SDK on iOS /
 * Android, `expo-auth-session` popup on web), then exchanges the resulting
 * ID token for a Brewskey AuthResponse via the `google_id_token` OAuth grant
 * (see `ApplicationOAuthProvider.GrantCustomExtension` on the backend).
 *
 * Resolves with `null` if the user cancelled the Google sheet so callers can
 * distinguish "user backed out" from "login error".
 *
 * The returned object extends React Query's mutation result with `isReady`,
 * which on web is false until `expo-auth-session` has finished loading the
 * underlying `AuthRequest`. Buttons should use this to disable themselves on
 * first paint instead of letting the user click into an error.
 */
export const useLoginWithGoogle = (): UseMutationResult<
  AuthResponse | null,
  Error,
  void
> & { isReady: boolean } => {
  const queryClient = useQueryClient();
  const { signIn, isReady } = useGoogleSignIn();
  const mutation = useMutation({
    mutationFn: async (): Promise<AuthResponse | null> => {
      const result = await signIn();
      if (result.type !== 'success') {
        return null;
      }
      // Cast: `loginWithGoogle` exists in @brewskey/js-api source but is not
      // yet exposed in the published d.ts of the version this app pins. Drop
      // the cast once the package is republished with the new method.
      return (
        Auth as typeof Auth & {
          loginWithGoogle: (idToken: string) => Promise<AuthResponse>;
        }
      ).loginWithGoogle(result.idToken);
    },
    onSuccess: (data) => {
      if (data) {
        setAuthSession(queryClient, data);
      }
    },
  });
  return Object.assign(mutation, { isReady });
};

export const useLoginWithApple = (): UseMutationResult<
  AuthResponse | null,
  Error,
  void
> & { isReady: boolean; isAvailable: boolean } => {
  const queryClient = useQueryClient();
  const { signIn, isReady, isAvailable } = useAppleSignIn();
  const mutation = useMutation({
    mutationFn: async (): Promise<AuthResponse | null> => {
      const result = await signIn();
      if (result.type !== 'success') {
        return null;
      }
      return Auth.loginWithApple(
        result.identityToken,
        result.fullName,
        result.authorizationCode,
      );
    },
    onSuccess: (data) => {
      if (data) {
        setAuthSession(queryClient, data);
      }
    },
  });
  return Object.assign(mutation, { isReady, isAvailable });
};

export const useLogout = (): UseMutationResult<void, Error, void> => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async () => {
      await signOutFromGoogle();
      setAuthSession(queryClient, null);
    },
  });
};

export const useDeleteAccount = (): UseMutationResult<void, Error, void> => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async () => Auth.deleteAccount(),
    onSuccess: async () => {
      await signOutFromGoogle();
      setAuthSession(queryClient, null);
    },
  });
};

export const useResetPassword = (): UseMutationResult<
  void,
  Error,
  {
    email: string;
  }
> =>
  useMutation({
    mutationFn: async (params: { email: string }) =>
      Auth.resetPassword(params.email),
  });

export const useRegister = (): UseMutationResult<
  void,
  Error,
  {
    email: string;
    password: string;
    userName: string;
  }
> =>
  useMutation({
    mutationFn: async (params: {
      email: string;
      password: string;
      userName: string;
    }) => Auth.register(params),
  });

export const useChangePassword = (): UseMutationResult<
  Record<string, never>,
  Error,
  ChangePasswordArgs
> =>
  useMutation({
    mutationFn: async (params: ChangePasswordArgs) =>
      Auth.changePassword(params),
  });
