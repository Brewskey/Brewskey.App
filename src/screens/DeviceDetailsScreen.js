// @flow

import type { Device, EntityID } from 'brewskey.js-api';
import type { Navigation } from '../types';

import * as React from 'react';
import InjectedComponent from '../common/InjectedComponent';
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
  _renderLoading = (): React.Node => (
    <Container>
      <Header showBackButton />
      <LoadingIndicator />
    </Container>
  );

  _renderLoaded = (value: Device): React.Node => (
    <Container>
      <Header showBackButton title={value.name} />
      <Text>{value.name}</Text>
      <Text>{value.particleId}</Text>
    </Container>
  );

  render() {
    const { id } = this.injectedProps;
    return (
      <LoaderComponent
        loader={DeviceStore.getByID(id)}
        renderLoading={this._renderLoading}
        renderLoaded={this._renderLoaded}
      />
    );
  }
}

export default DeviceDetailsScreen;
