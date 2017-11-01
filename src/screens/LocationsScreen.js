// @flow

import type { Navigation } from '../types';

import * as React from 'react';
import HeaderIcon from '../common/HeaderIcon';
import LocationsList from '../components/LocationsList';

type Props = {|
  navigation: Navigation,
|};

class LocationsScreen extends React.Component<Props> {
  static navigationOptions = ({ navigation }: Object): Object => ({
    headerRight: (
      <HeaderIcon
        name="add"
        onPress={(): void => navigation.navigate('newLocation')}
      />
    ),
    title: 'Locations',
  });

  render(): React.Node {
    return <LocationsList />;
  }
}

export default LocationsScreen;
