// @flow

import type { EntityID, Location } from 'brewskey.js-api';
import type { Navigation } from '../types';

import * as React from 'react';
import InjectedComponent from '../common/InjectedComponent';
import { observer } from 'mobx-react';
import { LocationStore } from '../stores/DAOStores';
import { Text } from 'react-native';
import flatNavigationParamsAndScreenProps from '../common/flatNavigationParamsAndScreenProps';
import Container from '../common/Container';
import LoadingIndicator from '../common/LoadingIndicator';
import LoaderComponent from '../common/LoaderComponent';
import Header from '../common/Header';

type InjectedProps = {|
  id: EntityID,
  navigation: Navigation,
|};

@flatNavigationParamsAndScreenProps
@observer
class LocationDetailsScreen extends InjectedComponent<InjectedProps> {
  render() {
    const { id } = this.injectedProps;
    return (
      <LoaderComponent
        loadedComponent={LoadedLocationDetails}
        loader={LocationStore.getByID(id)}
        loadingComponent={LoadingLocationDetails}
      />
    );
  }
}

const LoadingLocationDetails = () => (
  <Container>
    <Header showBackButton />
    <LoadingIndicator />
  </Container>
);

type LoadedLocationDetailsProps = {
  value: Location,
};

const LoadedLocationDetails = ({
  value: { name },
}: LoadedLocationDetailsProps) => (
  <Container>
    <Header showBackButton title={name} />
    <Text>{name}</Text>
  </Container>
);

export default LocationDetailsScreen;
