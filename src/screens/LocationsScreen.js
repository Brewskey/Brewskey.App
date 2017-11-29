// @flow

import type { Navigation } from '../types';

import * as React from 'react';
import { View } from 'react-native';
import Header from '../common/Header';
import HeaderNavigationButton from '../common/Header/HeaderNavigationButton';
import LocationsList from '../components/LocationsList';

type Props = {|
  navigation: Navigation,
|};

class LocationsScreen extends React.Component<Props> {
  render() {
    return (
      <View>
        <Header
          rightComponent={
            <HeaderNavigationButton name="add" toRoute="newLocation" />
          }
          title="Locations"
        />
        <LocationsList />
      </View>
    );
  }
}

export default LocationsScreen;
