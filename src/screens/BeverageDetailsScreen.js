// @flow

import type { Beverage, EntityID } from 'brewskey.js-api';
import type { Navigation } from '../types';

import * as React from 'react';
import InjectedComponent from '../common/InjectedComponent';
import { BeverageStore } from '../stores/DAOStores';
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
|};

@flatNavigationParamsAndScreenProps
@observer
class BeverageDetailsScreen extends InjectedComponent<InjectedProps> {
  _renderLoading = (): React.Node => (
    <Container>
      <Header showBackButton />
      <LoadingIndicator />
    </Container>
  );

  _renderLoaded = (value: Beverage): React.Node => (
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
        loader={BeverageStore.getByID(id)}
        renderLoading={this._renderLoading}
        renderLoaded={this._renderLoaded}
      />
    );
  }
}

export default BeverageDetailsScreen;
