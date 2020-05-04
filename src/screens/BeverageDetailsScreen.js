// @flow
import type { Beverage, EntityID, LoadObject } from 'brewskey.js-api';
import type { Navigation } from '../types';

import * as React from 'react';
import { ScrollView } from 'react-native';
import InjectedComponent from '../common/InjectedComponent';
import { BeverageStore } from '../stores/DAOStores';
import { computed } from 'mobx';
import { observer } from 'mobx-react';
import ErrorScreen from '../common/ErrorScreen';
import { errorBoundary } from '../common/ErrorBoundary';
import BeverageDetailsContent from '../components/BeverageDetailsContent';
import Container from '../common/Container';
import SectionContent from '../common/SectionContent';
import Header from '../common/Header';
import HeaderNavigationButton from '../common/Header/HeaderNavigationButton';
import LoaderComponent from '../common/LoaderComponent';
import LoadingIndicator from '../common/LoadingIndicator';
import flatNavigationParamsAndScreenProps from '../common/flatNavigationParamsAndScreenProps';

type InjectedProps = {|
  id: EntityID,
  navigation: Navigation,
|};

@errorBoundary(<ErrorScreen showBackButton />)
@flatNavigationParamsAndScreenProps
@observer
class BeverageDetailsScreen extends InjectedComponent<InjectedProps> {
  @computed
  get _beverageLoader(): LoadObject<Beverage> {
    return BeverageStore.getByID(this.injectedProps.id);
  }

  render(): React.Node {
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
      <SectionContent>
        <BeverageDetailsContent beverage={beverage} />
      </SectionContent>
    </ScrollView>
  </Container>
);

export default BeverageDetailsScreen;
