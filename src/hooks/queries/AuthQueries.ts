import { UseMutationResult, useMutation } from '@tanstack/react-query';
import { Auth, AuthResponse, ChangePasswordArgs, UserCredentials } from '@brewskey/js-api';
import { useSetAuthSession } from '../context/AuthContext';

export const useLogin = (): UseMutationResult<
  AuthResponse,
  Error,
  UserCredentials
> => {
  const setAuthSession = useSetAuthSession();
  return useMutation({
    mutationFn: (params: UserCredentials) => Auth.login(params),
    onSuccess: (data) => {
      setAuthSession(data);
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
