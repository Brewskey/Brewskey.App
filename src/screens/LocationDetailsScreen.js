// @flow

import type { EntityID, LoadObject, Location } from 'brewskey.js-api';
import type { Navigation } from '../types';

import * as React from 'react';
import InjectedComponent from '../common/InjectedComponent';
import { observer } from 'mobx-react';
import DAOApi from 'brewskey.js-api';
import { Text } from 'react-native';
import Container from '../common/Container';
import Header from '../common/Header';
import flatNavigationParamsAndScreenProps from '../common/flatNavigationParamsAndScreenProps';
import loadDAOEntity from '../common/loadDAOEntity';
import withLoadingActivity from '../common/withLoadingActivity';

type InjectedProps = {|
  id: EntityID,
  entityLoader: LoadObject<Location>,
  navigation: Navigation,
|};

@flatNavigationParamsAndScreenProps
@loadDAOEntity(DAOApi.LocationDAO)
@withLoadingActivity()
@observer
class LocationDetailsScreen extends InjectedComponent<InjectedProps> {
  render() {
    const { entityLoader } = this.injectedProps;
    const { description, name } = entityLoader.getValueEnforcing();

    // todo prettify and move content to separate component
    return (
      <Container>
        <Header showBackButton title={name} />
        <Text>{name}</Text>
        <Text>{description}</Text>
      </Container>
    );
  }
}

export default LocationDetailsScreen;
