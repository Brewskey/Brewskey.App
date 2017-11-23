// @flow

import type { Device, EntityID, LoadObject } from 'brewskey.js-api';
import type { Navigation } from '../types';

import * as React from 'react';
import InjectedComponent from '../common/InjectedComponent';
import DAOApi from 'brewskey.js-api';
import { Text, View } from 'react-native';
import loadDAOEntity from '../common/loadDAOEntity';
import withLoadingActivity from '../common/withLoadingActivity';
import flatNavigationParamsAndScreenProps from '../common/flatNavigationParamsAndScreenProps';

type InjectedProps = {|
  entityLoader: LoadObject<Device>,
  id: EntityID,
  navigation: Navigation,
|};

@flatNavigationParamsAndScreenProps
@loadDAOEntity(DAOApi.DeviceDAO)
@withLoadingActivity()
class DeviceDetailsScreen extends InjectedComponent<InjectedProps> {
  // todo find types for navigationOptions
  static navigationOptions = ({ navigation }: Object): Object => ({
    title:
      navigation.state.params.device && navigation.state.params.device.name,
  });

  componentDidMount() {
    // todo with this solution title on header appears after some lag :/
    const { entityLoader, navigation } = this.injectedProps;
    navigation.setParams({ device: entityLoader.getValueEnforcing() });
  }

  render() {
    const { entityLoader } = this.injectedProps;
    const { name, particleId } = entityLoader.getValueEnforcing();
    // todo prettify and move content to separate component
    return (
      <View>
        <Text>{name}</Text>
        <Text>{particleId}</Text>
      </View>
    );
  }
}

export default DeviceDetailsScreen;
