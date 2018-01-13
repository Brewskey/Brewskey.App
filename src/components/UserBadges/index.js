// @flow

import type { AchievementCounter, EntityID, LoadObject } from 'brewskey.js-api';
import type { Badge } from '../../badges';

import * as React from 'react';
import { observer } from 'mobx-react';
import { computed } from 'mobx';
import { AchievementStore } from '../../stores/DAOStores';
import LoaderComponent from '../../common/LoaderComponent';
import BADGES_BY_TYPE from '../../badges';
import LoadedUserBadges from './LoadedUserBadges';

type Props = {|
  userID: EntityID,
|};

@observer
class UserBadges extends React.Component<Props> {
  @computed
  get _badgesLoader(): LoadObject<Array<Badge>> {
    return AchievementStore.getAchievementCounters(this.props.userID).map(
      (achievementCounters: Array<AchievementCounter>): Array<Badge> =>
        achievementCounters.map(
          (achievementCounter: AchievementCounter): Badge =>
            BADGES_BY_TYPE[achievementCounter.achievementType],
        ),
    );
  }

  render() {
    return (
      <LoaderComponent
        loader={this._badgesLoader}
        loadedComponent={LoadedUserBadges}
      />
    );
  }
}

export default UserBadges;
