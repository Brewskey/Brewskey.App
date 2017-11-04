// @flow

import type { Device, DeviceMutator } from 'brewskey.js-api';
import type { Navigation } from '../types';
import type DAOEntityStore from '../stores/DAOEntityStore';

import * as React from 'react';
import InjectedComponent from '../common/InjectedComponent';
import { inject, observer } from 'mobx-react';
import { Text, View } from 'react-native';
import flatNavigationParamsAndScreenProps from '../common/flatNavigationParamsAndScreenProps';

type InjectedProps = {|
  deviceStore: DAOEntityStore<Device, DeviceMutator>,
  id: string,
  navigation: Navigation,
|};

@flatNavigationParamsAndScreenProps
@inject('deviceStore')
@observer
class DeviceDetailsScreen extends InjectedComponent<InjectedProps> {
  // todo find types for navigationOptions
  static navigationOptions = ({ navigation }: Object): Object => ({
    title:
      navigation.state.params.device && navigation.state.params.device.name,
  });

  componentDidMount() {
    // todo with this solution title on header appears after some lag :/
    const { deviceStore, id, navigation } = this.injectedProps;
    navigation.setParams({ device: deviceStore.getByID(id) });
  }

  render(): React.Node {
    const device = this.injectedProps.deviceStore.getByID(
      this.injectedProps.id,
    );
    // todo prettify and move content to separate component
    return (
      <View>
        <Text>{device.name}</Text>
        <Text>{device.particleId}</Text>
      </View>
    );
  }
}

export default DeviceDetailsScreen;
