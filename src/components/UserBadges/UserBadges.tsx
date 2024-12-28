import type {
  Achievement,
  AchievementCounter,
  AchievementType,
  EntityID,
} from '@brewskey/js-api';

import * as React from 'react';
import LoadedUserBadges, { LoadedUserBadgesHandle } from './LoadedUserBadges';
import EmptyUserBadges from './EmptyUserBadges';
import { LoaderComponent } from '../../common/LoaderComponent';
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
    const achievementCounter = useGetAchievementCountsByUserId(userID);
    const loadedUserBadgesRef = React.useRef<LoadedUserBadgesHandle>();

    useImperativeHandle(
      ref,
      () => ({
        async openBadgeModal(achievementType: AchievementType): Promise<void> {
          loadedUserBadgesRef.current?.selectAchievementCounterByType(
            achievementType,
          );
        },
        refresh() {
          achievementCounter.refetch();
        },
      }),
      [loadedUserBadgesRef, achievementCounter],
    );

    return (
      <LoaderComponent
        emptyComponent={EmptyUserBadges}
        loadedComponent={LoadedUserBadges}
        queries={{
          achievementCounter,
        }}
      />
    );
  },
);
