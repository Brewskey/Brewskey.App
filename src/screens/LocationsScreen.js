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

  _onAddButtonPress = (): void => this.props.navigation.navigate('newLocation');

  render(): React.Element<*> {
    return <LocationsList />;
  }
}

export default LocationsScreen;
