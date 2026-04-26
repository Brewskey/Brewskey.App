import BrewskeyJSApi, { AccountDAO, Auth } from '@brewskey/js-api';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import { AUTH_QUERY_KEY, setAuthSession } from 'hooks/context/AuthContext';
import { useAppleSignIn } from 'utils/appleSignIn';
import { signOutFromGoogle, useGoogleSignIn } from 'utils/googleSignIn';

import type {
  AuthResponse,
  ChangePasswordArgs,
  LinkResult,
  ManageInfo,
  SetPasswordArgs,
  UserCredentials,
  UserLoginInfo,
} from '@brewskey/js-api';
import type { UseMutationResult } from '@tanstack/react-query';

import type { AuthSession } from 'hooks/context/AuthContext';

export const MANAGE_INFO_QUERY_KEY = ['account', 'manage-info'] as const;

const clearAuthenticatedCache = (
  queryClient: ReturnType<typeof useQueryClient>,
) => {
  queryClient.removeQueries({
    predicate: (query) => query.queryKey[0] !== AUTH_QUERY_KEY[0],
  });
  setAuthSession(queryClient, null);
};

interface ManageInfoResponse {
  LocalLoginProvider?: string;
  Logins?: ManageInfoLoginResponse[];
  UserName?: string;
  localLoginProvider?: string;
  logins?: ManageInfoLoginResponse[];
  userName?: string;
}

interface ManageInfoLoginResponse {
  LoginProvider?: string;
  ProviderKey?: string;
  loginProvider?: string;
  providerKey?: string;
}

const reformatManageInfoResponse = (
  response: ManageInfoResponse,
): ManageInfo => ({
  userName: response.UserName ?? response.userName ?? '',
  localLoginProvider:
    response.LocalLoginProvider ?? response.localLoginProvider ?? 'Local',
  logins: (response.Logins ?? response.logins ?? []).map((login) => ({
    loginProvider: login.LoginProvider ?? login.loginProvider ?? '',
    providerKey: login.ProviderKey ?? login.providerKey ?? '',
  })),
});

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
      return Auth.loginWithGoogle(result.idToken);
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
      try {
        await signOutFromGoogle();
      } finally {
        clearAuthenticatedCache(queryClient);
      }
    },
  });
};

export const useDeleteAccount = (): UseMutationResult<void, Error, void> => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async () => Auth.deleteAccount(),
    onSuccess: async () => {
      try {
        await signOutFromGoogle();
      } finally {
        clearAuthenticatedCache(queryClient);
      }
    },
  });
};

export const useGetManageInfo = () =>
  useQuery<ManageInfo>({
    queryKey: MANAGE_INFO_QUERY_KEY,
    queryFn: async () =>
      BrewskeyJSApi.fetch<ManageInfoResponse>(
        'api/Account/ManageInfo?returnUrl=%2F',
      ).then(reformatManageInfoResponse),
  });

export const useLinkGoogle = (): UseMutationResult<
  LinkResult | null,
  Error,
  void
> & { isReady: boolean } => {
  const queryClient = useQueryClient();
  const { signIn, isReady } = useGoogleSignIn();
  const mutation = useMutation({
    mutationFn: async (): Promise<LinkResult | null> => {
      const result = await signIn();
      if (result.type !== 'success') {
        return null;
      }
      return Auth.linkGoogle(result.idToken);
    },
    onSuccess: async (data) => {
      if (!data) {
        return;
      }
      if (data.merged) {
        await queryClient.invalidateQueries({ queryKey: [] });
        return;
      }
      await queryClient.invalidateQueries({ queryKey: MANAGE_INFO_QUERY_KEY });
    },
  });
  return Object.assign(mutation, { isReady });
};

export const useLinkApple = (): UseMutationResult<
  LinkResult | null,
  Error,
  void
> & { isReady: boolean; isAvailable: boolean } => {
  const queryClient = useQueryClient();
  const { signIn, isReady, isAvailable } = useAppleSignIn();
  const mutation = useMutation({
    mutationFn: async (): Promise<LinkResult | null> => {
      const result = await signIn();
      if (result.type !== 'success') {
        return null;
      }
      return Auth.linkApple(
        result.identityToken,
        result.fullName,
        result.authorizationCode,
      );
    },
    onSuccess: async (data) => {
      if (!data) {
        return;
      }
      if (data.merged) {
        await queryClient.invalidateQueries({ queryKey: [] });
        return;
      }
      await queryClient.invalidateQueries({ queryKey: MANAGE_INFO_QUERY_KEY });
    },
  });
  return Object.assign(mutation, { isReady, isAvailable });
};

export const useUnlinkLogin = (): UseMutationResult<
  void,
  Error,
  UserLoginInfo
> => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ loginProvider, providerKey }) =>
      Auth.unlinkLogin(loginProvider, providerKey),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: MANAGE_INFO_QUERY_KEY });
    },
  });
};

export const useUpdateUsername = (): UseMutationResult<
  AuthSession,
  Error,
  { userName: string }
> => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ userName }): Promise<AuthSession> => {
      const authSession = queryClient.getQueryData<AuthSession>(AUTH_QUERY_KEY);
      if (!authSession) {
        throw new Error('You must be signed in to update your username.');
      }

      await AccountDAO.put(authSession.id, {
        email: authSession.email,
        id: authSession.id,
        phoneNumber: authSession.phoneNumber ?? '',
        userName,
      });

      const updatedSession: AuthSession = {
        ...authSession,
        isNewAccount: false,
        userName,
      };
      setAuthSession(queryClient, updatedSession);
      return updatedSession;
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

export const useSetPassword = (): UseMutationResult<
  Record<string, never>,
  Error,
  SetPasswordArgs
> => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (params: SetPasswordArgs) => Auth.setPassword(params),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: MANAGE_INFO_QUERY_KEY });
    },
  });
};
