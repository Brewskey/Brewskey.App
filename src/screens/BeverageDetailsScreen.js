// @flow
import type { Beverage, EntityID, LoadObject } from 'brewskey.js-api';
import type { Navigation } from '../types';

import * as React from 'react';
import { ScrollView } from 'react-native';
import InjectedComponent from '../common/InjectedComponent';
import { BeverageStore } from '../stores/DAOStores';
import { computed } from 'mobx';
import { observer } from 'mobx-react';
import BeverageDetailsContent from '../components/BeverageDetailsLoader/BeverageDetailsContent';
import Container from '../common/Container';
import Header from '../common/Header';
import HeaderNavigationButton from '../common/Header/HeaderNavigationButton';
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
  @computed
  get _beverageLoader(): LoadObject<Beverage> {
    return BeverageStore.getByID(this.injectedProps.id);
  }

  render() {
    return (
      <LoaderComponent
        loadedComponent={LoadedComponent}
        loader={this._beverageLoader}
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
  value: Beverage,
};

const LoadedComponent = ({ value: beverage }: LoadedComponentProps) => (
  <Container>
    <Header
      rightComponent={
        <HeaderNavigationButton
          name="edit"
          params={{ id: beverage.id }}
          toRoute="editBeverage"
        />
      }
      showBackButton
      title={beverage.name}
    />
    <ScrollView>
      <BeverageDetailsContent beverage={beverage} />
    </ScrollView>
  </Container>
);

export default BeverageDetailsScreen;
