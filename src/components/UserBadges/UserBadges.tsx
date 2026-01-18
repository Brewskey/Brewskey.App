import type {
  AchievementCounter,
  AchievementType,
  EntityID,
} from '@brewskey/js-api';

import * as React from 'react';
import LoadedUserBadges, { LoadedUserBadgesHandle } from './LoadedUserBadges';
import EmptyUserBadges from './EmptyUserBadges';
import { useImperativeHandle } from 'react';
import { useGetAchievementCountsByUserId } from '../../hooks/queries/AchievementQueries';

type Props = {
  userID: EntityID;
};

export type UserBadgesHandle = {
  openBadgeModal(achievementType: AchievementType): Promise<void>;
  refresh(): void;
};

export const UserBadges = React.forwardRef<UserBadgesHandle, Props>(
  ({ userID }, ref) => {
    const { data: achievementCounters, isLoading, refetch } = useGetAchievementCountsByUserId(userID);
    const loadedUserBadgesRef = React.useRef<LoadedUserBadgesHandle | null>(null);

    useImperativeHandle(
      ref,
      () => ({
        async openBadgeModal(achievementType: AchievementType): Promise<void> {
          loadedUserBadgesRef.current?.selectAchievementCounterByType(
            achievementType,
          );
        },
        refresh() {
          refetch();
        },
      }),
      [loadedUserBadgesRef, refetch],
    );

    if (isLoading) {
      return null; // Or return a loading component if needed
    }

    if (!achievementCounters || achievementCounters.length === 0) {
      return <EmptyUserBadges />;
    }

    return (
      <LoadedUserBadges
        ref={loadedUserBadgesRef}
        value={{ achievementCounter: achievementCounters }}
      />
    );
  },
);
