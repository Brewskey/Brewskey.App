import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import * as Location from 'expo-location';

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
 * Mutation hook for requesting location permission
 */
export const useRequestLocationPermission = (): UseMutationResult<
  Location.LocationPermissionResponse,
  Error,
  void
> => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async () => Location.requestForegroundPermissionsAsync(),
    onSuccess: () => {
      // Invalidate and refetch permission and location queries after permission change
      queryClient.invalidateQueries({
        queryKey: [LocationQueryKeys.LocationPermission],
      });
      queryClient.invalidateQueries({
        queryKey: [LocationQueryKeys.DeviceLocation],
      });
    },
  });
};
