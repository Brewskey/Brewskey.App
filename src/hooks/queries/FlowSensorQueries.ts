import { FlowSensorDAO } from '@brewskey/js-api';
import { createFilter } from '@brewskey/js-api/dist/filters';
import { useMutation, useQuery } from '@tanstack/react-query';

import { getStringFromEntityID } from 'utils/getStringFromEntityID';

import type { EntityID, FlowSensor, FlowSensorMutator } from '@brewskey/js-api';
import type { UseMutationResult, UseQueryResult } from '@tanstack/react-query';

enum FlowSensorQueryKeys {
  ByTapId = 'flow_sensor_by_tap_id',
}

export const useGetFlowSensorByTapId = (
  tapId: EntityID,
): UseQueryResult<FlowSensor> =>
  useQuery({
    queryKey: [FlowSensorQueryKeys.ByTapId, getStringFromEntityID(tapId)],
    queryFn: async () =>
      FlowSensorDAO.fetchSingle({
        filters: [createFilter('tap/id').equals(tapId)],
      }),
  });

export const useCreateFlowSensor = (): UseMutationResult<
  FlowSensor,
  Error,
  FlowSensorMutator
> =>
  useMutation({
    mutationFn: async (mutator) => FlowSensorDAO.post(mutator),
    onSuccess: () => {},
  });
