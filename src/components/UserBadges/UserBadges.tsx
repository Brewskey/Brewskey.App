import * as React from 'react';
import { useImperativeHandle } from 'react';

import { EmptyUserBadges } from 'components/UserBadges/EmptyUserBadges';
import { LoadedUserBadges } from 'components/UserBadges/LoadedUserBadges';
import { useGetAchievementCountsByUserId } from 'hooks/queries/AchievementQueries';

import type { AchievementType, EntityID } from '@brewskey/js-api';

import type { LoadedUserBadgesHandle } from 'components/UserBadges/LoadedUserBadges';

interface Props {
  userID: EntityID;
}

export interface UserBadgesHandle {
  openBadgeModal: (achievementType: AchievementType) => Promise<void>;
  refresh: () => void;
}

export const UserBadges = React.forwardRef<UserBadgesHandle, Props>(
  ({ userID }, ref) => {
    const {
      data: achievementCounters,
      isLoading,
      error,
      refetch,
    } = useGetAchievementCountsByUserId(userID);
    const loadedUserBadgesRef = React.useRef<LoadedUserBadgesHandle | null>(
      null,
    );

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

    // Handle errors gracefully - show empty badges for 401 (unauthorized) or any other errors
    // This happens when the user doesn't have permission to view achievements
    if (error) {
      return <EmptyUserBadges />;
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
