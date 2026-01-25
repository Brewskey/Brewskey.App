import { UseMutationResult, useMutation, useQueryClient } from '@tanstack/react-query';
import { Auth, AuthResponse, ChangePasswordArgs, UserCredentials } from '@brewskey/js-api';
import { setAuthSession } from '../context/AuthContext';

export const useLogin = (): UseMutationResult<
  AuthResponse, 
  Error,
  UserCredentials
> => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (params: UserCredentials) => Auth.login(params),
    onSuccess: (data) => {
      setAuthSession(queryClient, data);
    },
  });
};

export const useLogout = (): UseMutationResult<
  void,
  Error,
  void
> => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async () => 
      setAuthSession(queryClient, null),
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
    mutationFn: (params: { email: string }) => Auth.resetPassword(params.email),
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
    mutationFn: (params: { email: string; password: string; userName: string }) =>
      Auth.register(params),
  });

export const useChangePassword = (): UseMutationResult<
  Record<string, never>,
  Error,
  ChangePasswordArgs
> =>
  useMutation({
    mutationFn: (params: ChangePasswordArgs) => Auth.changePassword(params),
  });
