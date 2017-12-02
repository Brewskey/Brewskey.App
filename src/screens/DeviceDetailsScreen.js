// @flow

import type { Device, EntityID, LoadObject } from 'brewskey.js-api';
import type { Navigation } from '../types';

import * as React from 'react';
import InjectedComponent from '../common/InjectedComponent';
import DAOApi from 'brewskey.js-api';
import { Text } from 'react-native';
import Container from '../common/Container';
import loadDAOEntity from '../common/loadDAOEntity';
import Header from '../common/Header';
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
  render() {
    const { entityLoader } = this.injectedProps;
    const { name, particleId } = entityLoader.getValueEnforcing();

    // todo prettify and move content to separate component
    return (
      <Container>
        <Header showBackButton title={name} />
        <Text>{name}</Text>
        <Text>{particleId}</Text>
      </Container>
    );
  }
}

export default DeviceDetailsScreen;
