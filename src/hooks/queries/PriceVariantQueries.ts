import {
  UseQueryResult,
  useMutation,
  useQuery,
  useQueryClient,
} from '@tanstack/react-query';
import {
  EntityID,
  Location,
  LocationDAO,
  PriceVariant,
  PriceVariantDAO,
  PriceVariantMutator,
  QueryOptions,
} from '@brewskey/js-api';
import nullthrows from 'nullthrows';
import { LocationQueryKeys } from './LocationQueries';

enum PriceVariantQueryKeys {
  PriceVariantSingle = 'price_variant_single',
}

export const useGetPriceVariantSingle = (
  queryOptions?: QueryOptions,
): UseQueryResult<PriceVariant | null, Error> =>
  useQuery({
    queryKey: [PriceVariantQueryKeys.PriceVariantSingle, queryOptions],
    queryFn: () => PriceVariantDAO.fetchSingle(queryOptions),
  });

export const useCreatePriceVariant = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (mutator: PriceVariantMutator) => PriceVariantDAO.post(mutator),
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
      return await PriceVariantDAO.fetchByID(priceVariantId);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [PriceVariantQueryKeys.PriceVariantSingle],
      });
    },
  });
};

