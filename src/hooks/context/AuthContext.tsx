import BrewskeyJSApi, { AuthResponse } from '@brewskey/js-api';
import * as React from 'react';
import { useQuery, useQueryClient, useMutation } from '@tanstack/react-query';
import Storage from '../../utils/Storage';

export const SESSION_DATA = 'session_data';
export const AUTH_QUERY_KEY = ['auth', 'session'] as const;

/**
 * Load auth state from Storage for hydration
 */
export const loadAuthStateFromStorage = async (): Promise<
  AuthResponse | null
> => {
  try {
    // Check for Playwright test data first (for e2e tests)
    // This needs to be checked synchronously if possible, or we need to ensure
    // it's set before React Query runs
    if (typeof window !== 'undefined') {
      const playwrightAuth = (window as any).__PLAYWRIGHT_AUTH_DATA__;
      if (playwrightAuth) {
        // Store it in Storage for consistency
        try {
          await Storage.setItem(SESSION_DATA, playwrightAuth);
        } catch (e) {
          // Storage might not be ready yet, but we can still return the auth data
        }
        return playwrightAuth;
      }
    }
    
    return await Storage.getItem<AuthResponse>(SESSION_DATA);
  } catch (error) {
    return null;
  }
};

/**
 * Save auth state to Storage
 */
export const saveAuthStateToStorage = async (
  authResponse: AuthResponse | null,
): Promise<void> => {
  try {
    if (authResponse) {
      await Storage.setItem(SESSION_DATA, authResponse);
    } else {
      await Storage.removeItem(SESSION_DATA);
    }
  } catch (error) {
    // Ignore storage errors
  }
};

/**
 * Refresh auth token if refresh token is available
 */
const refreshAuthToken = async (
  sessionData: AuthResponse,
): Promise<AuthResponse | null> => {
  if (!sessionData.refreshToken) {
    return sessionData;
  }

  try {
    const { Auth } = await import('@brewskey/js-api');
    const newAuthResponse = await Auth.refreshToken(sessionData.refreshToken);
    // Merge the refreshed token data with the existing session data
    return { ...sessionData, ...newAuthResponse };
  } catch (refreshError) {
    // If refresh fails, return null to clear session
    return null;
  }
};

/**
 * Hook to access the current auth state using react-query
 * @returns The current AuthResponse or undefined if not authenticated
 */
export const useAuthSession = () => {
  const queryClient = useQueryClient();

  const query = useQuery<AuthResponse | null>({
    queryKey: AUTH_QUERY_KEY,
    queryFn: async () => {
      const stored = await loadAuthStateFromStorage();
      if (!stored) {
        return null;
      }

      // Try to refresh the token if we have a refresh token
      const refreshed = await refreshAuthToken(stored);
      if (refreshed) {
        // Save refreshed token
        await saveAuthStateToStorage(refreshed);
        return refreshed;
      }

      // Refresh failed, clear storage
      await saveAuthStateToStorage(null);
      return null;
    },
    staleTime: Infinity, // Auth state doesn't become stale
    gcTime: Infinity, // Never garbage collect auth state
    retry: false,
  });

  const authResponse = query.data || undefined;

  // Setup Storage.getUserID callback
  React.useEffect(() => {
    const userID = authResponse?.id
      ? authResponse.id === ''
        ? null
        : authResponse.id.toString()
      : null;
    Storage.setGetUserID(async () => {
      return userID || '';
    });
  }, [authResponse?.id]);

  // Update Brewskey API tokens when auth state changes
  React.useEffect(() => {
    if (authResponse?.accessToken) {
      BrewskeyJSApi.initializeForSession(authResponse);
    }
  }, [authResponse]);

  // Setup session update listener
  React.useEffect(() => {
    const setAuthResponse = async (response: AuthResponse | undefined) => {
      const value = response || null;

      // Update query cache
      queryClient.setQueryData<AuthResponse | null>(AUTH_QUERY_KEY, value);

      // Save to Storage
      await saveAuthStateToStorage(value);
    };

    BrewskeyJSApi.setOnSessionUpdated((session, error) => {
      if (error) {
        console.error(error);
      }
      setAuthResponse(session ?? undefined);
    });
  }, [queryClient]);

  return {
    authResponse,
    isLoading: query.isLoading,
  };
};

/**
 * Hook to set auth response (for login/logout)
 */
export const useSetAuthSession = () => {
  const queryClient = useQueryClient();

  return React.useCallback(
    async (response: AuthResponse | undefined) => {
      const value = response || null;

      // Update query cache
      queryClient.setQueryData<AuthResponse | null>(AUTH_QUERY_KEY, value);

      // Save to Storage
      await saveAuthStateToStorage(value);

      // Update Brewskey API tokens
      if (response) {
        BrewskeyJSApi.initializeForSession(response);
      }
    },
    [queryClient],
  );
};

/**
 * Backward compatibility hook - returns tuple like the old useAuthContext
 */
export const useAuthContext = () => {
  const { authResponse, isLoading } = useAuthSession();
  const setAuthResponse = useSetAuthSession();

  return [authResponse, setAuthResponse] as const;
};

export const useIsSignedIn = () => {
  const { authResponse } = useAuthSession();
  return authResponse != null;
};

export const useIsSignedOut = () => {
  const { authResponse } = useAuthSession();
  return authResponse == null;
};
