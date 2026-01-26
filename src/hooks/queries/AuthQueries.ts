import { Auth } from '@brewskey/js-api';
import { useMutation, useQueryClient } from '@tanstack/react-query';

import { setAuthSession } from '../context/AuthContext';

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

export const useLogout = (): UseMutationResult<void, Error, void> => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async () => setAuthSession(queryClient, null),
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
