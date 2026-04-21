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
 * Mutation hook for requesting foreground location permission via the system prompt when available.
 * Does not open Settings automatically — let the UI open Settings only on an explicit user action when
 * `canAskAgain` is false (otherwise "Don't allow" reads like the app ignoring the user's choice).
 * Same behavior on Android and iOS; web uses expo-location’s browser flow.
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
      if (current.granted) {
        return current;
      }
      // Always call request first: `getForegroundPermissionsAsync()` can report `canAskAgain: false`
      // before any prompt on some OS/builds, which wrongly routed to Settings if we trusted preflight only.
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
