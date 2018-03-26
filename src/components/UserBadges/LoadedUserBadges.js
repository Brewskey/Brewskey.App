// @flow

import type { AchievementCounter } from 'brewskey.js-api';

import * as React from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import { observer } from 'mobx-react';
import { action, observable } from 'mobx';
import ToggleStore from '../../stores/ToggleStore';
import BadgeIcon from '../BadgeIcon';
import BadgeModal from '../modals/BadgeModal';

export const styles = StyleSheet.create({
  badgeContainer: {
    paddingHorizontal: 5,
  },
  container: {
    alignItems: 'center',
    height: 80,
    justifyContent: 'center',
  },
});

type Props = {|
  value: Array<AchievementCounter>,
|};

@observer
class LoadedUserBadges extends React.Component<Props> {
  _modalToggleStore = new ToggleStore();
  @observable _selectedAchievementCounter: ?AchievementCounter = null;

  selectAchievementCounterByType = (
    achievementType: AchievementType,
  ): ?AchievementCounter => {
    const counter = this.props.value.find(
      (achievementCounter: AchievementCounter): boolean =>
        achievementCounter.achievementType === achievementType,
    );

    counter && this._selectAchievementCounter(counter);
  };

  @action
  _selectAchievementCounter = (achievementCounter: achievementCounter) => {
    this._selectedAchievementCounter = achievementCounter;
    this._modalToggleStore.toggleOn();
  };

  render() {
    return (
      <ScrollView contentContainerStyle={styles.container} horizontal>
        {this.props.value.map(
          ({ achievementType, total }: AchievementCounter): React.Node => (
            <View key={achievementType} style={styles.badgeContainer}>
              <BadgeIcon
                achievementType={achievementType}
                count={total}
                onPress={this.selectAchievementCounterByType}
              />
            </View>
          ),
        )}
        <BadgeModal
          achievementCounter={this._selectedAchievementCounter}
          isVisible={this._modalToggleStore.isToggled}
          onHideModal={this._modalToggleStore.toggleOff}
        />
      </ScrollView>
    );
  }
}

export default LoadedUserBadges;
