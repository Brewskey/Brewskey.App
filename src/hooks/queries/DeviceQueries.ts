import {
  InfiniteData,
  UseInfiniteQueryResult,
  UseQueryResult,
  useInfiniteQuery,
  useMutation,
  useQuery,
  useQueryClient,
} from '@tanstack/react-query';
import {
  Device,
  DeviceDAO,
  DeviceMutator,
  EntityID,
  QueryOptions,
} from '@brewskey/js-api';
import nullthrows from 'nullthrows';

enum DeviceQueryKeys {
  DeviceById = 'device_by_id',
  Devices = 'devices',
}

export const useGetDeviceById = (
  id: EntityID | undefined,
): UseQueryResult<Device, Error> =>
  useQuery({
    queryKey: [DeviceQueryKeys.DeviceById, id],
    queryFn: () => DeviceDAO.fetchByID(nullthrows(id)),
    enabled: id != null,
  });
export const useGetDevices = (
  queryOptions?: Omit<QueryOptions, 'skip'>,
): UseInfiniteQueryResult<InfiniteData<Device[]>, Error> =>
  useInfiniteQuery({
    queryKey: [DeviceQueryKeys.Devices, queryOptions],
    queryFn: ({ pageParam = 0 }) =>
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
        [DeviceQueryKeys.DeviceById, device.id],
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
      return await DeviceDAO.fetchByID(deviceId);
    },
    onSuccess: (device) => {
      queryClient.setQueryData(
        [DeviceQueryKeys.DeviceById, device.id],
        device,
      );
      queryClient.invalidateQueries({ queryKey: [DeviceQueryKeys.Devices] });
    },
  });
};

export const useDeleteDevice = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (deviceId: EntityID) => DeviceDAO.deleteByID(deviceId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [DeviceQueryKeys.Devices] });
      queryClient.invalidateQueries({ queryKey: [DeviceQueryKeys.DeviceById] });
    },
  });
};
