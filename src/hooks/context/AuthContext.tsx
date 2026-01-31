import { useCallback } from 'react';

import BrewskeyJSApi from '@brewskey/js-api';
import { useQuery, useQueryClient } from '@tanstack/react-query';

import { Storage, StorageKeys } from 'utils/Storage';

import type { AuthResponse } from '@brewskey/js-api';
import type { QueryClient } from '@tanstack/react-query';

export const AUTH_QUERY_KEY = ['auth', 'session'] as const;

/**
 * Load auth state from Storage for hydration
 */
export const loadAuthStateFromStorage =
  async (): Promise<AuthResponse | null> => {
    try {
      // Check for Playwright test data first (for e2e tests)
      // This needs to be checked synchronously if possible, or we need to ensure
      // it's set before React Query runs
      if (typeof window !== 'undefined') {
        const playwrightAuth = (
          window as Window & { __PLAYWRIGHT_AUTH_DATA__?: AuthResponse }
        ).__PLAYWRIGHT_AUTH_DATA__;
        if (playwrightAuth) {
          // Store it in Storage for consistency
          try {
            await Storage.setItem(StorageKeys.SessionData, playwrightAuth);
          } catch {
            // Storage might not be ready yet, but we can still return the auth data
          }
          return playwrightAuth;
        }
      }

      return await Storage.getItem<AuthResponse>(StorageKeys.SessionData);
    } catch {
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
      await Storage.setItem(StorageKeys.SessionData, authResponse);
    } else {
      await Storage.removeItem(StorageKeys.SessionData);
    }
  } catch {
    // Ignore storage errors
  }
};

/**
 * Hook to access the current auth state using react-query
 * @returns The current AuthResponse or undefined if not authenticated
 */
export const useAuthSession = () =>
  useQuery<AuthResponse | null>({
    queryKey: AUTH_QUERY_KEY,
    queryFn: async () => loadAuthStateFromStorage(),
    staleTime: Infinity, // Auth state doesn't become stale
    gcTime: Infinity, // Never garbage collect auth state
    retry: false,
  });

export const setAuthSession = (
  queryClient: QueryClient,
  authResponse: AuthResponse | null,
) => {
  queryClient.setQueryData(AUTH_QUERY_KEY, authResponse);
  saveAuthStateToStorage(authResponse);
  BrewskeyJSApi.initializeForSession(authResponse ?? null);
};

/**
 * Hook to set auth response (for login/logout)
 */
// export const useSetAuthSession = () => {
//   const queryClient = useQueryClient();

//   return React.useCallback(
//     async (response: AuthResponse | undefined) => {
//       const value = response || null;

//       // Update query cache
//       queryClient.setQueryData<AuthResponse | null>(AUTH_QUERY_KEY, value);

//       // Save to Storage
//       await saveAuthStateToStorage(value);

//       // Update Brewskey API tokens
//       if (response) {
//         BrewskeyJSApi.initializeForSession(response);
//       }
//     },
//     [queryClient],
//   );
// };

/**
 * Set auth session (for login/logout). Uses setAuthSession with queryClient.
 */
export const useSetAuthSession = () => {
  const queryClient = useQueryClient();
  return useCallback(
    (response: AuthResponse | null) => {
      setAuthSession(queryClient, response);
    },
    [queryClient],
  );
};

/**
 * Backward compatibility hook - returns tuple [session, setSession] like the old useAuthContext
 */
export const useAuthContext = () => {
  const { data: authResponse } = useAuthSession();
  const setAuthResponse = useSetAuthSession();
  return [authResponse ?? null, setAuthResponse] as const;
};

export const useUserID = (): string => {
  const { data: authResponse } = useAuthSession();
  return authResponse?.id?.toString() ?? '';
};

export const useAccessToken = (): string | null => {
  const { data: authResponse } = useAuthSession();
  return authResponse?.accessToken ?? null;
};

export const useIsSignedIn = () => {
  const { data: authResponse } = useAuthSession();
  return authResponse != null;
};

export const useIsSignedOut = () => {
  const { data: authResponse } = useAuthSession();
  return authResponse == null;
};
