import { UseQueryResult, useQuery } from '@tanstack/react-query';
import { EntityID, FlowSensor, FlowSensorDAO } from '@brewskey/js-api';
import { createFilter } from '@brewskey/js-api/dist/filters';

enum FlowSensorQueryKeys {
  ByTapId = 'flow_sensor_by_tap_id',
}

export const useGetFlowSensorByTapId = (
  tapId: EntityID,
): UseQueryResult<FlowSensor, Error> =>
  useQuery({
    queryKey: [FlowSensorQueryKeys.ByTapId, tapId],
    queryFn: () =>
      FlowSensorDAO.fetchSingle({
        filters: [createFilter('tap/id').equals(tapId)],
      }),
  });
