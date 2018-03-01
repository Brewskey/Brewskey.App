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
import HeaderNavigationButton from '../common/Header/HeaderNavigationButton';
import LoaderComponent from '../common/LoaderComponent';
import LoadingIndicator from '../common/LoadingIndicator';
import flatNavigationParamsAndScreenProps from '../common/flatNavigationParamsAndScreenProps';
import TapDetailsKegScreen from './TapDetailsKegScreen';
import TapDetailsStatsScreen from './TapDetailsStatsScreen';
import TapDetailsLeaderboardScreen from './TapDetailsLeaderboardScreen';
import theme from '../theme';

/* eslint-disable sorting/sort-object-props */
const tabScreens = {
  tapDetailsKeg: { screen: TapDetailsKegScreen },
  tapDetailsStats: {
    screen: TapDetailsStatsScreen,
    hidePropName: 'hideStats',
  },
  tapDetailsLeaderboard: {
    screen: TapDetailsLeaderboardScreen,
    hidePropName: 'hideLeaderboard',
  },
};
/* eslint-enable */

const TapDetailsNavigator = TabNavigator(tabScreens, {
  ...theme.tabBar,
});

type InjectedProps = {|
  id: EntityID,
  navigation: Navigation,
|};

@flatNavigationParamsAndScreenProps
@observer
class TapDetailsScreen extends InjectedComponent<InjectedProps> {
  static router = TapDetailsNavigator.router;

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
        navigation={this.injectedProps.navigation}
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
  navigation: Navigation,
  value: Tap,
};

const LoadedComponent = ({
  navigation,
  value: { id, hideLeaderboard, hideStats },
}: LoadedComponentProps) => {
  // workaround for dynamically hiding tabs
  // todo change it when they implement the feature
  // https://github.com/react-navigation/react-navigation/issues/717
  // https://react-navigation.canny.io/feature-requests/p/hiding-tab-from-the-tabbar
  const navState = navigation.state;
  const hideProps = { hideLeaderboard, hideStats };

  const filteredTabRoutes = navState.routes.filter((route: Object): boolean => {
    const { hidePropName } = tabScreens[route.routeName];
    return !hidePropName || !hideProps[hidePropName];
  });

  const activeIndex = filteredTabRoutes.findIndex(
    (route: Object): boolean =>
      route.routeName === navState.routes[navState.index].routeName,
  );

  return (
    <Container>
      <Header
        rightComponent={
          <HeaderNavigationButton
            name="edit"
            params={{ id }}
            toRoute="editTap"
          />
        }
        showBackButton
        title="Tap"
      />
      <TapDetailsNavigator
        navigation={{
          ...navigation,
          state: {
            ...navigation.state,
            index: activeIndex,
            routes: filteredTabRoutes,
          },
        }}
        screenProps={{ tapId: id }}
      />
    </Container>
  );
};

export default TapDetailsScreen;
