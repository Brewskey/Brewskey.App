import { UseQueryResult, useMutation, useQuery } from '@tanstack/react-query';
import { EntityID, Tap, TapDAO } from '@brewskey/js-api';

enum TapQueryKeys {
  TapById = 'tap_by_id',
}

export const useGetTapById = (id: EntityID): UseQueryResult<Tap, Error> =>
  useQuery({
    queryKey: [TapQueryKeys.TapById, id],
    queryFn: () => TapDAO.fetchByID(id),
  });

export const useDeleteTap = () => {
  return useMutation({
    mutationFn: (tapId: EntityID) => TapDAO.deleteByID(tapId),
  });
};
