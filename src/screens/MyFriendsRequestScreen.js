// @flow

import * as React from 'react';
import { View, Text } from 'react-native';

class MyFriendsRequestScreen extends React.Component<{}> {
  static navigationOptions = {
    tabBarLabel: 'Requests',
  };

  render() {
    return (
      <View>
        <Text>Request screen</Text>
      </View>
    );
  }
}

export default MyFriendsRequestScreen;
