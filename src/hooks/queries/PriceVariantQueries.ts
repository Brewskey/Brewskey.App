import { PriceVariantDAO } from '@brewskey/js-api';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import nullthrows from 'nullthrows';

import type {
  PriceVariant,
  PriceVariantMutator,
  QueryOptions,
} from '@brewskey/js-api';
import type { UseQueryResult } from '@tanstack/react-query';

enum PriceVariantQueryKeys {
  PriceVariantSingle = 'price_variant_single',
}

export const useGetPriceVariantSingle = (
  queryOptions?: QueryOptions,
): UseQueryResult<PriceVariant | null> =>
  useQuery({
    queryKey: [PriceVariantQueryKeys.PriceVariantSingle, queryOptions],
    queryFn: async () => PriceVariantDAO.fetchSingle(queryOptions),
  });

export const useCreatePriceVariant = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (mutator: PriceVariantMutator) =>
      PriceVariantDAO.post(mutator),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [PriceVariantQueryKeys.PriceVariantSingle],
      });
    },
  });
};

export const useUpdatePriceVariant = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (mutator: PriceVariantMutator) => {
      const priceVariantId = nullthrows(mutator.id);
      await PriceVariantDAO.put(priceVariantId, mutator);
      return PriceVariantDAO.fetchByID(priceVariantId);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [PriceVariantQueryKeys.PriceVariantSingle],
      });
    },
  });
};
