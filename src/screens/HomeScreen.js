// @flow

import * as React from 'react';
import { Text, View } from 'react-native';
import { inject, observer } from 'mobx-react';

type Props = {|
  navigation: Object,
|};

@inject('locationStore')
@observer
class HomeScreen extends React.Component<Props> {
  static navigationOptions = {
    title: 'Home',
  };

  render(): React.Element<*> {
    return (
      <View>
        <Text>Home Home</Text>
      </View>
    );
  }
}

export default HomeScreen;
