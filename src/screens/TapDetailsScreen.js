// @flow

import type { EntityID, LoadObject, Tap } from 'brewskey.js-api';
import type { Navigation } from '../types';

import * as React from 'react';
import InjectedComponent from '../common/InjectedComponent';
import { TapStore } from '../stores/DAOStores';
import { observer } from 'mobx-react';
import { Text } from 'react-native';
import Container from '../common/Container';
import Header from '../common/Header';
import LoaderComponent from '../common/LoaderComponent';
import LoadingIndicator from '../common/LoadingIndicator';
import flatNavigationParamsAndScreenProps from '../common/flatNavigationParamsAndScreenProps';

type InjectedProps = {|
  id: EntityID,
  navigation: Navigation,
  entityLoader: LoadObject<Tap>,
|};

@flatNavigationParamsAndScreenProps
@observer
class TapDetailsScreen extends InjectedComponent<InjectedProps> {
  _renderLoading = (): React.Node => (
    <Container>
      <Header showBackButton />
      <LoadingIndicator />
    </Container>
  );

  _renderLoaded = (value: Tap): React.Node => (
    <Container>
      <Header showBackButton title={value.name} />
      <Text>{value.name}</Text>
      <Text>{value.description}</Text>
    </Container>
  );

  render() {
    const { id } = this.injectedProps;
    return (
      <LoaderComponent
        loader={TapStore.getByID(id)}
        renderLoading={this._renderLoading}
        renderLoaded={this._renderLoaded}
      />
    );
  }
}

export default TapDetailsScreen;
