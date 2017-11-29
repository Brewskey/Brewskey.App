// @flow

import type { Navigation } from '../types';

import * as React from 'react';
import { View } from 'react-native';
import Header from '../common/Header';
import NearbyLocationsList from '../components/NearbyLocationsList';

type Props = {|
  navigation: Navigation,
|};

class HomeScreen extends React.Component<Props> {
  render() {
    return (
      <View>
        <Header title="Nearby locations" />
        <NearbyLocationsList />
      </View>
    );
  }
}

export default HomeScreen;
