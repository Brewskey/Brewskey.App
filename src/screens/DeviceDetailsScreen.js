// @flow

import type { Device, DeviceMutator } from 'brewskey.js-api';
import type { Navigation } from '../types';
import type DAOEntityStore from '../stores/DAOEntityStore';

import * as React from 'react';
import { inject, observer } from 'mobx-react';
import { Text, View } from 'react-native';
import flatNavigationParamsAndScreenProps from '../common/flatNavigationParamsAndScreenProps';

type Props = {|
  deviceStore: DAOEntityStore<Device, DeviceMutator>,
  id: string,
  navigation: Navigation,
|};

@flatNavigationParamsAndScreenProps
@inject('deviceStore')
@observer
class DeviceDetailsScreen extends React.Component<Props> {
  // todo find types for navigationOptions
  static navigationOptions = ({ navigation }: Object): Object => ({
    title:
      navigation.state.params.device && navigation.state.params.device.name,
  });

  componentDidMount() {
    // todo with this solution title on header appears after some lag :/
    const { deviceStore, id, navigation } = this.props;
    navigation.setParams({ device: deviceStore.getByID(id) });
  }

  render(): React.Node {
    const device = this.props.deviceStore.getByID(this.props.id);
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
