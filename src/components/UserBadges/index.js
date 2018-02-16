// @flow

import type { AchievementCounter, EntityID } from 'brewskey.js-api';
import type { Badge } from '../../badges';

import * as React from 'react';
import { observer } from 'mobx-react';
import { computed } from 'mobx';
import { LoadObject } from 'brewskey.js-api';
import { AchievementStore } from '../../stores/DAOStores';
import LoaderComponent from '../../common/LoaderComponent';
import LoadingUserBadges from './LoadingUserBadges';
import BADGES_BY_TYPE from '../../badges';
import LoadedUserBadges from './LoadedUserBadges';
import EmptyUserBadges from './EmptyUserBadges';
import ErrorUserBadges from './ErrorUserBadges';

type Props = {|
  userID: EntityID,
|};

@observer
class UserBadges extends React.Component<Props> {
  @computed
  get _badgesLoader(): LoadObject<Array<Badge>> {
    return AchievementStore.getAchievementCounters(this.props.userID)
      .map((achievementCounters: Array<AchievementCounter>): Array<Badge> =>
        achievementCounters.map(
          (achievementCounter: AchievementCounter): Badge =>
            BADGES_BY_TYPE[achievementCounter.achievementType],
        ),
      )
      .map(
        (badges: Array<Badge>): Array<Badge> | LoadObject<Array<Badge>> =>
          badges.length ? badges : LoadObject.empty(),
      );
  }

  render() {
    return (
      <LoaderComponent
        emptyComponent={EmptyUserBadges}
        errorComponent={ErrorUserBadges}
        loadedComponent={LoadedUserBadges}
        loader={this._badgesLoader}
        loadingComponent={LoadingUserBadges}
      />
    );
  }
}

export default UserBadges;
