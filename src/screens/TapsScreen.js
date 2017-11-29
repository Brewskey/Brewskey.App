// @flow

import type { Navigation } from '../types';

import * as React from 'react';
import { View } from 'react-native';
import Header from '../common/Header';
import HeaderNavigationButton from '../common/Header/HeaderNavigationButton';
import TapsList from '../components/TapsList';

type Props = {|
  navigation: Navigation,
|};

class TapsScreen extends React.Component<Props> {
  render() {
    return (
      <View>
        <Header
          rightComponent={<HeaderNavigationButton name="add" to="newTap" />}
          title="Taps"
        />
        <TapsList />
      </View>
    );
  }
}

export default TapsScreen;
