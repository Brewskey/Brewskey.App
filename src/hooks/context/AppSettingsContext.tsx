import * as React from 'react';
import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
} from 'react';

import DAOApi from '@brewskey/js-api';
import { useQuery, useQueryClient } from '@tanstack/react-query';

import { Storage, StorageKeys } from 'utils/Storage';

import type { Organization } from '@brewskey/js-api';

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
  updateMetadata:
    | {
        appVersion: string;
        label: string;
      }
    | null
    | undefined;
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

  // Clear all queries when organization changes
  React.useEffect(() => {
    // Clear all queries except app settings
    // TODO: add this back in later but make it work with e2e tests
    // queryClient.removeQueries({
    //   predicate: (query) => {
    //     // Remove all queries except app settings
    //     return (
    //       query.queryKey[0] !== 'app' || query.queryKey[1] !== 'settings'
    //     );
    //   },
    // });
  }, [appSettings.selectedOrganization, queryClient]);

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
  const [updateMetadata] = useState<{
    appVersion: string;
    label: string;
  } | null>(null);

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
      updateMetadata,
      onToggleManageTaps,
      onOrganizationChange,
      updateAppSettings,
    }),
    [
      appSettings.manageTapsEnabled,
      appSettings.selectedOrganization,
      updateMetadata,
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
