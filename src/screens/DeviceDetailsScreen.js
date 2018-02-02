// @flow

import type { Device, EntityID, LoadObject } from 'brewskey.js-api';
import type { Navigation } from '../types';

import * as React from 'react';
import InjectedComponent from '../common/InjectedComponent';
import { computed } from 'mobx';
import { observer } from 'mobx-react';
import { DeviceStore } from '../stores/DAOStores';
import { Text } from 'react-native';
import Container from '../common/Container';
import LoaderComponent from '../common/LoaderComponent';
import LoadingIndicator from '../common/LoadingIndicator';
import Header from '../common/Header';
import flatNavigationParamsAndScreenProps from '../common/flatNavigationParamsAndScreenProps';

type InjectedProps = {|
  id: EntityID,
  navigation: Navigation,
|};

@flatNavigationParamsAndScreenProps
@observer
class DeviceDetailsScreen extends InjectedComponent<InjectedProps> {
  @computed
  get _deviceLoader(): LoadObject<Device> {
    return DeviceStore.getByID('25');
  }

  render() {
    return (
      <LoaderComponent
        loadedComponent={LoadedComponent}
        loader={this._deviceLoader}
        loadingComponent={LoadingComponent}
      />
    );
  }
}

const LoadingComponent = () => (
  <Container>
    <Header showBackButton />
    <LoadingIndicator />
  </Container>
);

type LoadedComponentProps = {
  value: Device,
};

const LoadedComponent = observer(
  ({ value: { name, particleId } }: LoadedComponentProps) => (
    // console.log(DeviceStore.getParticleAttributes(id));
    <Container>
      <Header showBackButton title={name} />
      <Text>{name}</Text>
      <Text>{particleId}</Text>
    </Container>
  ),
);

export default DeviceDetailsScreen;
