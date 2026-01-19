import type { Organization } from '@brewskey/js-api';

import * as React from 'react';
import { useState, useCallback, createContext, useContext } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import Storage from '../../utils/Storage';
import DAOApi from '@brewskey/js-api';

const APP_SETTINGS_STORAGE_KEY = 'app_settings';
export const APP_SETTINGS_QUERY_KEY = ['app', 'settings'] as const;

export type AppSettings = {
  manageTapsEnabled: boolean;
  selectedOrganization: Organization | null | undefined;
};

/**
 * Load app settings from Storage for hydration
 */
export const loadAppSettingsFromStorage = async (): Promise<
  AppSettings | null
> => {
  try {
    const storedSettings = await Storage.getForCurrentUser<AppSettings>(
      APP_SETTINGS_STORAGE_KEY,
    );
    return storedSettings || null;
  } catch (error) {
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
      await Storage.setForCurrentUser(APP_SETTINGS_STORAGE_KEY, settings);
    } else {
      await Storage.removeForCurrentUser(APP_SETTINGS_STORAGE_KEY);
    }
  } catch (error) {
    // Ignore storage errors
  }
};

type AppSettingsContextValue = {
  isManageTapsEnabled: boolean;
  selectedOrganization: Organization | null | undefined;
  updateMetadata: {
    appVersion: string;
    label: string;
  } | null | undefined;
  onToggleManageTaps: () => void;
  onOrganizationChange: (selectedOrganization?: Organization | null) => void;
  updateAppSettings: (appSettings: Partial<AppSettings>) => void;
};

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

  const appSettings = query.data || {
    manageTapsEnabled: false,
    selectedOrganization: null,
  };

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
    queryClient.removeQueries({
      predicate: (query) => {
        // Remove all queries except app settings
        return (
          query.queryKey[0] !== 'app' || query.queryKey[1] !== 'settings'
        );
      },
    });
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

  const value: AppSettingsContextValue = {
    isManageTapsEnabled: appSettings.manageTapsEnabled,
    selectedOrganization: appSettings.selectedOrganization,
    updateMetadata,
    onToggleManageTaps,
    onOrganizationChange,
    updateAppSettings,
  };

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
