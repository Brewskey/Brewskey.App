import type { AuthResponse, UserCredentials } from '@brewskey/js-api';
import * as React from 'react';
import { Auth } from '@brewskey/js-api';
import { useAuthSession, useSetAuthSession } from '../hooks/context/AuthContext';
import Storage from '../utils/Storage';

/**
 * Hook to access the current auth state
 * @returns The current AuthResponse or undefined if not authenticated
 */
export const useAuthStore = (): AuthResponse | undefined => {
  const { authResponse } = useAuthSession();
  return authResponse;
};

/**
 * Hook to get the current user's ID
 * @returns The user ID as a string, or null if not authenticated
 */
export const useUserID = (): string | null => {
  const authResponse = useAuthStore();
  if (!authResponse?.id) {
    return null;
  }
  return authResponse.id === '' ? null : authResponse.id.toString();
};

/**
 * Hook to get the current user's name
 * @returns The user name, or null if not authenticated
 */
export const useUserName = (): string | null => {
  const authResponse = useAuthStore();
  return authResponse?.userName || null;
};

/**
 * Hook to get the current access token
 * @returns The access token, or null if not authenticated
 */
export const useAccessToken = (): string | null => {
  const authResponse = useAuthStore();
  return authResponse?.accessToken || null;
};

/**
 * Hook to check if the user is authorized
 * @returns true if the user is authenticated, false otherwise
 */
export const useIsAuthorized = (): boolean => {
  const authResponse = useAuthStore();
  return !!authResponse?.accessToken;
};

/**
 * Hook to get login and logout functions
 * @returns An object with login and logout functions
 */
export const useAuthActions = () => {
  const setAuthResponse = useSetAuthSession();

  const login = React.useCallback(
    async (userCredentials: UserCredentials): Promise<void> => {
      const authResponse = await Auth.login(userCredentials);
      await setAuthResponse(authResponse);
    },
    [setAuthResponse],
  );

  const logout = React.useCallback(async (): Promise<void> => {
    await setAuthResponse(undefined);
  }, [setAuthResponse]);

  return { login, logout };
};

/**
 * Main hook that provides AuthStore-like API for easier migration
 * Use this hook in components instead of accessing AuthStore properties directly
 * @returns An object with auth state and actions, similar to the old AuthStore API
 */
export const useAuthStoreHook = () => {
  const authResponse = useAuthStore();
  const { login, logout } = useAuthActions();

  const userID = React.useMemo(() => {
    if (!authResponse?.id) {
      return null;
    }
    return authResponse.id === '' ? null : authResponse.id.toString();
  }, [authResponse?.id]);

  return {
    accessToken: authResponse?.accessToken || null,
    userID,
    userName: authResponse?.userName || null,
    isAuthorized: !!authResponse?.accessToken,
    login,
    logout,
  };
};

// Setup Storage.getUserID callback
// This will be set up when useSetupAuthStore is called
let currentUserID: string | null = null;

/**
 * Hook to setup the Storage.getUserID callback
 * This should be called once in the app root component (e.g., in AuthProvider or AppRouter)
 */
export const useSetupAuthStore = () => {
  const userID = useUserID();

  React.useEffect(() => {
    currentUserID = userID;
    Storage.setGetUserID(async () => {
      return currentUserID || '';
    });
  }, [userID]);
};
