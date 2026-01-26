import { CloudDeviceDAO } from '@brewskey/js-api';
import { useQuery } from '@tanstack/react-query';
import nullthrows from 'nullthrows';

import { getStringFromEntityID } from '../../utils/getStringFromEntityID';

import type { CloudDevice, EntityID } from '@brewskey/js-api';
import type { UseQueryResult } from '@tanstack/react-query';

enum CloudDeviceQueryKeys {
  CloudDevice = 'cloud_device',
}

export const useGetCloudDevice = (
  particleID: EntityID | undefined | null,
): UseQueryResult<CloudDevice> =>
  useQuery({
    queryKey: [
      CloudDeviceQueryKeys.CloudDevice,
      getStringFromEntityID(particleID),
    ],
    queryFn: async () =>
      CloudDeviceDAO.getOne(nullthrows(particleID).toString()),
    enabled: particleID != null,
    retry: false,
    retryOnMount: false,
    // Don't throw errors to Error Boundary - handle them in component
    // 400 errors (invalid device IDs) are handled gracefully by DeviceOnlineIndicator
    throwOnError: false,
  });

// Alias for backward compatibility
export const useGetParticleAttributes = useGetCloudDevice;
