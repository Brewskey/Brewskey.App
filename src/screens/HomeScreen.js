// @flow

import type { Location } from 'brewskey.js-api';
import type DAOEntityStore from '../stores/DAOEnityStore';

import * as React from 'react';
import { Text, View } from 'react-native';
import { inject, observer } from 'mobx-react';
import { Button } from 'react-native-elements';

type Props = {|
  locationStore: DAOEntityStore<Location, Location>,
  navigation: Object,
|};

@inject('locationStore')
@observer
class HomeScreen extends React.Component<Props> {
  onButtonPress = async (): Promise<void> => {
    try {
      await this.props.locationStore.fetchMany();
    } catch (error) {}
  };

  render(): React.Element<*> {
    return (
      <View>
        <Text>Home Home</Text>
        {this.props.locationStore.all.map((location: Location): React.Element<
          *,
        > => <Text key={location.id}>{location.name}</Text>)}
        <Button title="fetch Locations" onPress={this.onButtonPress} />
      </View>
    );
  }
}

export default HomeScreen;
