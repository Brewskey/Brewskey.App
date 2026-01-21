import { UseQueryResult, useQuery } from '@tanstack/react-query';
import {
  CloudDevice,
  CloudDeviceDAO,
  EntityID,
} from '@brewskey/js-api';
import nullthrows from 'nullthrows';

enum CloudDeviceQueryKeys {
  CloudDevice = 'cloud_device',
}

export const useGetCloudDevice = (
  particleID: EntityID | undefined | null,
): UseQueryResult<CloudDevice, Error> =>
  useQuery({
    queryKey: [CloudDeviceQueryKeys.CloudDevice, particleID],
    queryFn: () => CloudDeviceDAO.getOne(nullthrows(particleID).toString()),
    enabled: particleID != null,
    retry: false,
    retryOnMount: false,
    // Don't throw errors to Error Boundary - handle them in component
    // 400 errors (invalid device IDs) are handled gracefully by DeviceOnlineIndicator
    throwOnError: false,
  });

// Alias for backward compatibility
export const useGetParticleAttributes = useGetCloudDevice;
