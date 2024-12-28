import { UseQueryResult, useQuery } from '@tanstack/react-query';
import { Device, DeviceDAO, EntityID } from '@brewskey/js-api';

enum DeviceQueryKeys {
  DeviceById = 'device_by_id',
}

export const useGetDeviceById = (id: EntityID): UseQueryResult<Device, Error> =>
  useQuery({
    queryKey: [DeviceQueryKeys.DeviceById, id],
    queryFn: () => DeviceDAO.fetchByID(id),
  });
