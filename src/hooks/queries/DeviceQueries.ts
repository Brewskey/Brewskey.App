import { DeviceDAO } from '@brewskey/js-api';
import {
  useInfiniteQuery,
  useMutation,
  useQuery,
  useQueryClient,
} from '@tanstack/react-query';
import nullthrows from 'nullthrows';

import { getStringFromEntityID } from 'utils/getStringFromEntityID';

import type {
  Device,
  DeviceMutator,
  EntityID,
  QueryOptions,
} from '@brewskey/js-api';
import type {
  InfiniteData,
  UseInfiniteQueryResult,
  UseQueryResult,
} from '@tanstack/react-query';

enum DeviceQueryKeys {
  DeviceById = 'device_by_id',
  Devices = 'devices',
}

export const useGetDeviceById = (
  id: EntityID | undefined,
): UseQueryResult<Device> =>
  useQuery({
    queryKey: [DeviceQueryKeys.DeviceById, getStringFromEntityID(id)],
    queryFn: async () => DeviceDAO.fetchByID(nullthrows(id)),
    enabled: id != null,
  });
export const useGetDevices = (
  queryOptions?: Omit<QueryOptions, 'skip'>,
): UseInfiniteQueryResult<InfiniteData<Device[]>> =>
  useInfiniteQuery({
    queryKey: [DeviceQueryKeys.Devices, queryOptions],
    queryFn: async ({ pageParam = 0 }) =>
      DeviceDAO.fetchMany({
        ...queryOptions,
        orderBy: queryOptions?.orderBy ?? [
          {
            column: 'id',
            direction: 'desc',
          },
        ],
        skip: pageParam * 20,
        take: 20,
      }),
    initialPageParam: 0,
    getNextPageParam: (lastPage, pages) =>
      lastPage.length === 20 ? pages.length : undefined,
    getPreviousPageParam: (_, pages) => pages.length,
  });

export const useCreateDevice = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (mutator: DeviceMutator) => {
      const device = await DeviceDAO.post(mutator);
      return device;
    },
    onSuccess: (device) => {
      queryClient.setQueryData(
        [DeviceQueryKeys.DeviceById, getStringFromEntityID(device.id)],
        device,
      );
      queryClient.invalidateQueries({ queryKey: [DeviceQueryKeys.Devices] });
    },
  });
};

export const useUpdateDevice = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (mutator: DeviceMutator) => {
      const deviceId = nullthrows(mutator.id);
      await DeviceDAO.put(deviceId, mutator);
      return DeviceDAO.fetchByID(deviceId);
    },
    onSuccess: (device) => {
      queryClient.setQueryData(
        [DeviceQueryKeys.DeviceById, getStringFromEntityID(device.id)],
        device,
      );
      queryClient.invalidateQueries({ queryKey: [DeviceQueryKeys.Devices] });
    },
  });
};

export const useDeleteDevice = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (deviceId: EntityID) => DeviceDAO.deleteByID(deviceId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [DeviceQueryKeys.Devices] });
      queryClient.invalidateQueries({ queryKey: [DeviceQueryKeys.DeviceById] });
    },
  });
};
