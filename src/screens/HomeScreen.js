// @flow

import * as React from 'react';
import { Text, View } from 'react-native';
import { inject, observer } from 'mobx-react';
import { Button } from 'react-native-elements';
import requireAuth from '../common/requireAuth';

@inject('locationStore')
@observer
class HomeScreen extends React.Component {
  onButtonPress = () => {
    try {
      this.props.locationStore.fetchByID('275');
    } catch (error) {}
  };

  render() {
    return (
      <View>
        <Text>home home</Text>
        {this.props.locationStore.all.map(location => (
          <Text key={location.id}>{location.name}</Text>
        ))}
        <Button title="fetch Location" onPress={this.onButtonPress} />
      </View>
    );
  }
}

export default HomeScreen;
