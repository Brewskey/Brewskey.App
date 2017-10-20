// @flow

import * as React from 'react';
import HeaderIcon from '../common/HeaderIcon';
import LocationsList from '../components/LocationsList';

type Props = {|
  navigation: Object,
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

  render(): React.Element<*> {
    return <LocationsList />;
  }
}

export default LocationsScreen;
