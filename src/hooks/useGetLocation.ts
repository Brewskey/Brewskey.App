import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { PermissionStatus } from 'expo-location';
import * as Location from 'expo-location';
import { Linking, Platform } from 'react-native';

import type { UseMutationResult, UseQueryResult } from '@tanstack/react-query';

export enum LocationQueryKeys {
  LocationPermission = 'location_permission',
  DeviceLocation = 'device_location',
}

/**
 * Query hook for checking location permission status
 */
export const useLocationPermission =
  (): UseQueryResult<Location.LocationPermissionResponse> =>
    useQuery({
      queryKey: [LocationQueryKeys.LocationPermission],
      queryFn: async () => Location.getForegroundPermissionsAsync(),
    });

/**
 * Query hook for getting device location
 * Only enabled when permission is granted
 */
export const useDeviceLocation =
  (): UseQueryResult<Location.LocationObject> => {
    const permissionQuery = useLocationPermission();
    const isGranted = permissionQuery.data?.status === 'granted';

    return useQuery({
      queryKey: [LocationQueryKeys.DeviceLocation],
      queryFn: async () => Location.getCurrentPositionAsync(),
      enabled: isGranted,
    });
  };

/**
 * Mutation hook for requesting location permission (or opening system settings when the OS will
 * not show the prompt again — native + denied status).
 */
export const useRequestLocationPermission = (): UseMutationResult<
  Location.LocationPermissionResponse,
  Error,
  void
> => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async () => {
      const current = await Location.getForegroundPermissionsAsync();
      if (current.status === PermissionStatus.DENIED && Platform.OS !== 'web') {
        await Linking.openSettings();
        return Location.getForegroundPermissionsAsync();
      }
      return Location.requestForegroundPermissionsAsync();
    },
    onSettled: () => {
      // Refresh after allow/deny/error so UI matches OS state (onSuccess skips errors)
      void queryClient.invalidateQueries({
        queryKey: [LocationQueryKeys.LocationPermission],
      });
      void queryClient.invalidateQueries({
        queryKey: [LocationQueryKeys.DeviceLocation],
      });
    },
  });
};
