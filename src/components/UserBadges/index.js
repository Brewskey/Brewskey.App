// @flow

import type { AchievementCounter, EntityID } from 'brewskey.js-api';

import * as React from 'react';
import { observer } from 'mobx-react';
import nullthrows from 'nullthrows';
import { action, computed, observable, when } from 'mobx';
import { LoadObject } from 'brewskey.js-api';
import { AchievementStore } from '../../stores/DAOStores';
import LoaderComponent from '../../common/LoaderComponent';
import LoadingUserBadges from './LoadingUserBadges';
import LoadedUserBadges from './LoadedUserBadges';
import EmptyUserBadges from './EmptyUserBadges';
import ErrorUserBadges from './ErrorUserBadges';

type Props = {|
  userID: EntityID,
|};

const johnID = '68ae3ba1-7841-4273-8d4b-0fb4fa6ed3ca';

@observer
class UserBadges extends React.Component<Props> {
  @observable _loadedComponent: ?LoadedUserBadges = null;

  @computed
  get _achievementCountersLoader(): LoadObject<AchievementCounter> {
    return AchievementStore.getAchievementCounters(johnID);
  }

  openBadgeModal = async (achievementType: AchievementType): Promise<void> => {
    await when(
      () =>
        !this._achievementCountersLoader.isLoading() && this._loadedComponent,
    );

    nullthrows(this._loadedComponent).selectAchievementCounterByType(
      achievementType,
    );
  };

  @action _setLoadedComponentRef = ref => (this._loadedComponent = ref);

  render() {
    return (
      <LoaderComponent
        emptyComponent={EmptyUserBadges}
        errorComponent={ErrorUserBadges}
        loadedComponent={LoadedUserBadges}
        loadedComponentRef={this._setLoadedComponentRef}
        loader={this._achievementCountersLoader}
        loadingComponent={LoadingUserBadges}
      />
    );
  }
}

export default UserBadges;
