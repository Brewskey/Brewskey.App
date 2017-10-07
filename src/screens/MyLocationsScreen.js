// @flow

import * as React from 'react';
import { Text, View } from 'react-native';

type Props = {|
  navigation: Object,
|};

class MyLocationsScreen extends React.Component<Props> {
  render(): React.Element<*> {
    return (
      <View>
        <Text>My locations screen</Text>
      </View>
    );
  }
}

export default MyLocationsScreen;
