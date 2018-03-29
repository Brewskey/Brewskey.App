// @flow

import type { Tap } from 'brewskey.js-api';
import type { LeaderboardDurationValue } from '../components/LeaderboardDurationPicker';

import * as React from 'react';
import { View } from 'react-native';
import InjectedComponent from '../common/InjectedComponent';
import { observer } from 'mobx-react/native';
import { action, observable } from 'mobx';
import LeaderboardList from '../components/LeaderboardList';
import LeaderboardDurationPicker, {
  LEADERBOARD_DURATION_OPTIONS,
} from '../components/LeaderboardDurationPicker';
import flatNavigationParamsAndScreenProps from '../common/flatNavigationParamsAndScreenProps';

type InjectedProps = {|
  noFlowSensorWarning: ?React.Element<any>,
  tap: Tap,
|};

@flatNavigationParamsAndScreenProps
@observer
class TapDetailsLeaderboardScreen extends InjectedComponent<InjectedProps> {
  static navigationOptions = {
    tabBarLabel: 'Leaderboard',
  };

  @observable
  _leaderboardDuration: LeaderboardDurationValue = LEADERBOARD_DURATION_OPTIONS
    .TWELVE_HOURS.value;

  @action
  _onChangeLeaderboardDuration = (duration: LeaderboardDurationValue) => {
    this._leaderboardDuration = duration;
  };

  render() {
    const { noFlowSensorWarning, tap: { id } } = this.injectedProps;
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
