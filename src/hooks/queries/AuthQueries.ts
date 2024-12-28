import { UseMutationResult, useMutation } from '@tanstack/react-query';
import { Auth, AuthResponse, UserCredentials } from '@brewskey/js-api';
import { useAuthContext } from '../context/AuthContext';

export const useLogin = (): UseMutationResult<
  AuthResponse,
  Error,
  UserCredentials
> => {
  const [_, setAuthSession] = useAuthContext();
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
