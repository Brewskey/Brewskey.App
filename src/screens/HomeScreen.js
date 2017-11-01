// @flow

import type { Navigation } from '../types';

import * as React from 'react';
import { Text, View } from 'react-native';
import { observer } from 'mobx-react';

type Props = {|
  navigation: Navigation,
|};

@observer
class HomeScreen extends React.Component<Props> {
  static navigationOptions = {
    title: 'Home',
  };

  render(): React.Node {
    return (
      <View>
        <Text>Home Home</Text>
      </View>
    );
  }
}

export default HomeScreen;
