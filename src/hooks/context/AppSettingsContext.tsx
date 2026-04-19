import * as React from 'react';
import { createContext, useCallback, useContext, useMemo } from 'react';

import DAOApi from '@brewskey/js-api';
import { useQuery, useQueryClient } from '@tanstack/react-query';

import { AUTH_QUERY_KEY } from 'hooks/context/AuthContext';
import { Storage, StorageKeys } from 'utils/Storage';

import type { Organization } from '@brewskey/js-api';
import type { Query } from '@tanstack/react-query';

function isPersistedGlobalQuery(query: Query): boolean {
  const key = query.queryKey;
  return (
    (key[0] === APP_SETTINGS_QUERY_KEY[0] &&
      key[1] === APP_SETTINGS_QUERY_KEY[1]) ||
    (key[0] === AUTH_QUERY_KEY[0] && key[1] === AUTH_QUERY_KEY[1])
  );
}

export const APP_SETTINGS_QUERY_KEY = ['app', 'settings'] as const;

export interface AppSettings {
  manageTapsEnabled: boolean;
  selectedOrganization: Organization | null | undefined;
}

/**
 * Load app settings from Storage for hydration
 */
export const loadAppSettingsFromStorage =
  async (): Promise<AppSettings | null> => {
    try {
      // Check for Playwright test data first (for e2e tests)
      if (typeof window !== 'undefined') {
        const playwrightSettings = (
          window as Window & { __PLAYWRIGHT_APP_SETTINGS__?: AppSettings }
        ).__PLAYWRIGHT_APP_SETTINGS__;
        if (playwrightSettings) {
          // Store it in Storage for consistency
          try {
            await Storage.setForCurrentUser(
              StorageKeys.AppSettings,
              playwrightSettings,
            );
          } catch {
            // Storage might not be ready yet, but we can still return the settings
          }
          return playwrightSettings;
        }
      }

      const storedSettings = await Storage.getForCurrentUser<AppSettings>(
        StorageKeys.AppSettings,
      );
      return storedSettings || null;
    } catch {
      return null;
    }
  };

/**
 * Save app settings to Storage
 */
export const saveAppSettingsToStorage = async (
  settings: AppSettings | null,
): Promise<void> => {
  try {
    if (settings) {
      await Storage.setForCurrentUser(StorageKeys.AppSettings, settings);
    } else {
      await Storage.removeForCurrentUser(StorageKeys.AppSettings);
    }
  } catch {
    // Ignore storage errors
  }
};

interface AppSettingsContextValue {
  isManageTapsEnabled: boolean;
  selectedOrganization: Organization | null | undefined;
  onToggleManageTaps: () => void;
  onOrganizationChange: (selectedOrganization?: Organization | null) => void;
  updateAppSettings: (appSettings: Partial<AppSettings>) => void;
}

const AppSettingsContext = createContext<AppSettingsContextValue | undefined>(
  undefined,
);

/**
 * Hook to access app settings using react-query
 */
const useAppSettingsQuery = () => {
  const queryClient = useQueryClient();

  const query = useQuery<AppSettings | null>({
    queryKey: APP_SETTINGS_QUERY_KEY,
    queryFn: async () => {
      const stored = await loadAppSettingsFromStorage();
      return stored || { manageTapsEnabled: false, selectedOrganization: null };
    },
    initialData: { manageTapsEnabled: false, selectedOrganization: null },
    staleTime: Infinity, // Settings don't become stale
    gcTime: Infinity, // Never garbage collect settings
    retry: false,
  });

  const appSettings = useMemo(
    () =>
      query.data ?? {
        manageTapsEnabled: false,
        selectedOrganization: null,
      },
    [query.data],
  );

  // Set organization ID when settings change
  React.useEffect(() => {
    if (appSettings.selectedOrganization) {
      DAOApi.setOrganizationID(appSettings.selectedOrganization.id);
    } else {
      DAOApi.setOrganizationID(null);
    }
  }, [appSettings.selectedOrganization]);

  const prevSelectedOrgIdRef = React.useRef<string | null | undefined>(
    undefined,
  );

  // Drop org-scoped cache when the user switches organizations (not on initial mount).
  React.useEffect(() => {
    const id = appSettings.selectedOrganization?.id;
    const idKey = id != null ? String(id) : null;

    if (prevSelectedOrgIdRef.current === undefined) {
      prevSelectedOrgIdRef.current = idKey;
      return;
    }

    if (prevSelectedOrgIdRef.current === idKey) {
      return;
    }

    prevSelectedOrgIdRef.current = idKey;

    queryClient.removeQueries({
      predicate: (query) => !isPersistedGlobalQuery(query),
    });
  }, [appSettings.selectedOrganization?.id, queryClient]);

  const updateAppSettings = useCallback(
    async (newSettings: Partial<AppSettings>) => {
      const updatedSettings = { ...appSettings, ...newSettings };

      // Update query cache
      queryClient.setQueryData<AppSettings>(
        APP_SETTINGS_QUERY_KEY,
        updatedSettings,
      );

      // Save to Storage
      await saveAppSettingsToStorage(updatedSettings);
    },
    [appSettings, queryClient],
  );

  return {
    appSettings,
    isLoading: query.isLoading,
    updateAppSettings,
  };
};

export const AppSettingsProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const { appSettings, isLoading, updateAppSettings } = useAppSettingsQuery();

  const onToggleManageTaps = useCallback(() => {
    updateAppSettings({
      manageTapsEnabled: !appSettings.manageTapsEnabled,
    });
  }, [appSettings.manageTapsEnabled, updateAppSettings]);

  const onOrganizationChange = useCallback(
    (selectedOrganization?: Organization | null) => {
      DAOApi.setOrganizationID(
        selectedOrganization ? selectedOrganization.id : null,
      );
      updateAppSettings({
        selectedOrganization: selectedOrganization || null,
      });
    },
    [updateAppSettings],
  );

  const value = useMemo<AppSettingsContextValue>(
    () => ({
      isManageTapsEnabled: appSettings.manageTapsEnabled,
      selectedOrganization: appSettings.selectedOrganization,
      onToggleManageTaps,
      onOrganizationChange,
      updateAppSettings,
    }),
    [
      appSettings.manageTapsEnabled,
      appSettings.selectedOrganization,
      onToggleManageTaps,
      onOrganizationChange,
      updateAppSettings,
    ],
  );

  // Don't render children until settings are loaded to avoid flash of wrong state
  if (isLoading) {
    return null;
  }

  return (
    <AppSettingsContext.Provider value={value}>
      {children}
    </AppSettingsContext.Provider>
  );
};

export const useAppSettings = (): AppSettingsContextValue => {
  const context = useContext(AppSettingsContext);
  if (context === undefined) {
    throw new Error('useAppSettings must be used within AppSettingsProvider');
  }
  return context;
};
