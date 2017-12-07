// @flow

import type { EntityID, LoadObject, Location } from 'brewskey.js-api';
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
  entityLoader: LoadObject<Location>,
  navigation: Navigation,
|};

@flatNavigationParamsAndScreenProps
@observer
class LocationDetailsScreen extends InjectedComponent<InjectedProps> {
  _renderLoading = (): React.Node => (
    <Container>
      <Header showBackButton />
      <LoadingIndicator />
    </Container>
  );

  _renderLoaded = (value: Location): React.Node => (
    <Container>
      <Header showBackButton title={value.name} />
      <Text>{value.name}</Text>
    </Container>
  );

  render() {
    const { id } = this.injectedProps;
    return (
      <LoaderComponent
        loader={LocationStore.getByID(id)}
        renderLoading={this._renderLoading}
        renderLoaded={this._renderLoaded}
      />
    );
  }
}

export default LocationDetailsScreen;
