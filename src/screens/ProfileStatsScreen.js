// @flow

import type { Account } from 'brewskey.js-api';

import * as React from 'react';
import ErrorScreen from '../common/ErrorScreen';
import { errorBoundary } from '../common/ErrorBoundary';
import { Text, View } from 'react-native';
import InjectedComponent from '../common/InjectedComponent';

import flatNavigationParamsAndScreenProps from '../common/flatNavigationParamsAndScreenProps';

type InjectedProps = {|
  account: Account,
|};

@errorBoundary(<ErrorScreen showBackButton />)
@flatNavigationParamsAndScreenProps
class ProfileStatsScreen extends InjectedComponent<InjectedProps> {
  static navigationOptions = {
    tabBarLabel: 'Stats',
  };

  render() {
    return (
      <View>
        <Text>Profile stats and charts </Text>
      </View>
    );
  }
}

export default ProfileStatsScreen;
