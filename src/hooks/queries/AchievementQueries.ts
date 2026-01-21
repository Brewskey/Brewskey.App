import { UseQueryResult, useQuery } from '@tanstack/react-query';
import { AchievementCounter, AchievementDAO, EntityID } from '@brewskey/js-api';

export enum AchievementQueryKeys {
  CountsByUserId = 'achievement_counts_by_user_id',
}

export const useGetAchievementCountsByUserId = (
  userId: EntityID,
): UseQueryResult<AchievementCounter[], Error> =>
  useQuery({
    queryKey: [AchievementQueryKeys.CountsByUserId, userId],
    queryFn: () => AchievementDAO.fetchAchievementCounters(userId),
    retry: (failureCount, error) => {
      // Don't retry on 401 (unauthorized) errors - user doesn't have permission
      if (error instanceof Error && error.message.includes('401')) {
        return false;
      }
      // Retry up to 2 times for other errors
      return failureCount < 2;
    },
  });
