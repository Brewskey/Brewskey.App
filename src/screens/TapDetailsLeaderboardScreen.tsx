import type { Tap } from '@brewskey/js-api';
import type { LeaderboardDurationValue } from '../components/LeaderboardDurationPicker';

import * as React from 'react';
import { View } from 'react-native';

import { action, observable } from 'mobx';
import ErrorScreen from '../common/ErrorScreen';
import { errorBoundary } from '../common/ErrorBoundary';
import LeaderboardList from '../components/LeaderboardList';
import LeaderboardDurationPicker, {
  LEADERBOARD_DURATION_OPTIONS,
} from '../components/LeaderboardDurationPicker';
import flatNavigationParamsAndScreenProps from '../common/flatNavigationParamsAndScreenProps';
import nullthrows from 'nullthrows';

type InjectedProps = {
  noFlowSensorWarning: React.ReactNode | null | undefined;
  tap: Tap;
};

@errorBoundary(<ErrorScreen showBackButton />)
@flatNavigationParamsAndScreenProps
class TapDetailsLeaderboardScreen extends InjectedComponent<InjectedProps> {
  static navigationOptions = {
    tabBarLabel: 'Leader\nboard',
  };

  _leaderboardDuration: LeaderboardDurationValue =
    LEADERBOARD_DURATION_OPTIONS.TWELVE_HOURS.value;

  _onChangeLeaderboardDuration = (
    duration?: LeaderboardDurationValue | null,
  ) => {
    this._leaderboardDuration = nullthrows(duration);
  };

  render(): React.ReactElement {
    const {
      noFlowSensorWarning,
      tap: { id },
    } = this.injectedProps;
    return (
      <LeaderboardList
        duration={this._leaderboardDuration}
        ListHeaderComponent={
          <View>
            {noFlowSensorWarning}
            <LeaderboardDurationPicker
              onChange={this._onChangeLeaderboardDuration}
              value={this._leaderboardDuration}
            />
          </View>
        }
        tapID={id}
      />
    );
  }
}

export default TapDetailsLeaderboardScreen;
