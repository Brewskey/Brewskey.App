// @flow

import type { EntityID, Location, LoadObject } from 'brewskey.js-api';
import type { Navigation } from '../types';

import * as React from 'react';
import InjectedComponent from '../common/InjectedComponent';
import { computed } from 'mobx';
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
  @computed
  get _locationLoader(): LoadObject<Location> {
    return LocationStore.getByID(this.injectedProps.id);
  }

  render() {
    return (
      <LoaderComponent
        loadedComponent={LoadedLocationDetails}
        loader={this._locationLoader}
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
