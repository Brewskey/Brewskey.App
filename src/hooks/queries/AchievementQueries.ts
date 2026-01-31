import { AchievementDAO } from '@brewskey/js-api';
import { useQuery } from '@tanstack/react-query';

import { getStringFromEntityID } from 'utils/getStringFromEntityID';

import type { AchievementCounter, EntityID } from '@brewskey/js-api';
import type { UseQueryResult } from '@tanstack/react-query';

export enum AchievementQueryKeys {
  CountsByUserId = 'achievement_counts_by_user_id',
}

export const useGetAchievementCountsByUserId = (
  userId: EntityID,
): UseQueryResult<AchievementCounter[]> =>
  useQuery({
    queryKey: [
      AchievementQueryKeys.CountsByUserId,
      getStringFromEntityID(userId),
    ],
    queryFn: async () => AchievementDAO.fetchAchievementCounters(userId),
    retry: (failureCount, error) => {
      // Don't retry on 401 (unauthorized) errors - user doesn't have permission
      if (error instanceof Error && error.message.includes('401')) {
        return false;
      }
      // Retry up to 2 times for other errors
      return failureCount < 2;
    },
  });
