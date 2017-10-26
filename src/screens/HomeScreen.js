// @flow

import * as React from 'react';
import { Text, View, NativeModules } from 'react-native';
import { Button } from 'react-native-elements';
import { inject, observer } from 'mobx-react';

const { DeviceSetup } = NativeModules;

type Props = {|
  navigation: Object,
|};

@inject('locationStore')
@observer
class HomeScreen extends React.Component<Props> {
  static navigationOptions = {
    title: 'Home',
  };

  _onSetupDeviceButtonPress = async (): Promise<void> => {
    await DeviceSetup.setup();
  };

  render(): React.Node {
    return (
      <View>
        <Text>Home Home</Text>
        <Button onPress={this._onSetupDeviceButtonPress} title="setup device" />
      </View>
    );
  }
}

export default HomeScreen;
