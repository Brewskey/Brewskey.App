// @flow

import type { EntityID, LoadObject, Tap } from 'brewskey.js-api';
import type { Navigation } from '../types';

import * as React from 'react';
import InjectedComponent from '../common/InjectedComponent';
import { TabNavigator } from 'react-navigation';
import { TapStore } from '../stores/DAOStores';
import { computed } from 'mobx';
import { observer } from 'mobx-react';
import Container from '../common/Container';
import Header from '../common/Header';
import LoaderComponent from '../common/LoaderComponent';
import LoadingIndicator from '../common/LoadingIndicator';
import flatNavigationParamsAndScreenProps from '../common/flatNavigationParamsAndScreenProps';
import TapDetailsKegScreen from './TapDetailsKegScreen';
import TapDetailsStatsScreen from './TapDetailsStatsScreen';
import TapDetailsLeaderboardScreen from './TapDetailsLeaderboardScreen';
import theme from '../theme';

/* eslint-disable sorting/sort-object-props */
const TapDetailsNavigator = TabNavigator(
  {
    tapDetailsKeg: { screen: TapDetailsKegScreen },
    tapDetailsStats: { screen: TapDetailsStatsScreen },
    tapDetailsLeaderboard: { screen: TapDetailsLeaderboardScreen },
  },
  /* eslint-enable */
  {
    ...theme.tabBar,
    lazy: true,
  },
);

type InjectedProps = {|
  id: EntityID,
  navigation: Navigation,
|};

@flatNavigationParamsAndScreenProps
@observer
class TapDetailsScreen extends InjectedComponent<InjectedProps> {
  @computed
  get _tapLoader(): LoadObject<Tap> {
    return TapStore.getByID(this.injectedProps.id);
  }

  render() {
    return (
      <LoaderComponent
        loadedComponent={LoadedComponent}
        loader={this._tapLoader}
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
  value: Tap,
};

const LoadedComponent = ({ value: { id, name } }: LoadedComponentProps) => (
  <Container>
    <Header showBackButton title={name} />
    <TapDetailsNavigator screenProps={{ tapId: id }} />
  </Container>
);

export default TapDetailsScreen;
