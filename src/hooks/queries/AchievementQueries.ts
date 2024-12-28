import { UseQueryResult, useQuery } from '@tanstack/react-query';
import { AchievementCounter, AchievementDAO, EntityID } from '@brewskey/js-api';

enum AchievementQueryKeys {
  CountsByUserId = 'achievement_counts_by_user_id',
}

export const useGetAchievementCountsByUserId = (
  userId: EntityID,
): UseQueryResult<AchievementCounter[], Error> =>
  useQuery({
    queryKey: [AchievementQueryKeys.CountsByUserId, userId],
    queryFn: () => AchievementDAO.fetchAchievementCounters(userId),
  });
