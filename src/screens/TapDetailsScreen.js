// @flow

import type { EntityID, FlowSensor, Permission, Tap } from 'brewskey.js-api';
import type { Navigation } from '../types';

import * as React from 'react';
import { Dimensions } from 'react-native';
import InjectedComponent from '../common/InjectedComponent';
import { createMaterialTopTabNavigator } from 'react-navigation';
import DAOApi, { LoadObject } from 'brewskey.js-api';
import {
  FlowSensorStore,
  PermissionStore,
  TapStore,
} from '../stores/DAOStores';
import { computed } from 'mobx';
import { observer } from 'mobx-react/native';
import ErrorScreen from '../common/ErrorScreen';
import { errorBoundary } from '../common/ErrorBoundary';
import Container from '../common/Container';
import Header from '../common/Header';
import HeaderNavigationButton from '../common/Header/HeaderNavigationButton';
import WarningNotification from '../common/WarningNotification';
import LoaderComponent from '../common/LoaderComponent';
import LoadingIndicator from '../common/LoadingIndicator';
import flatNavigationParamsAndScreenProps from '../common/flatNavigationParamsAndScreenProps';
import TapDetailsKegScreen from './TapDetailsKegScreen';
import TapDetailsStatsScreen from './TapDetailsStatsScreen';
import TapDetailsLeaderboardScreen from './TapDetailsLeaderboardScreen';
import theme from '../theme';
import { checkCanEdit } from '../permissionHelpers';

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

const TapDetailsNavigator = createMaterialTopTabNavigator(tabScreens, {
  ...theme.tabBar,
  initialLayout: {
    height: 0,
    width: Dimensions.get('window').width,
  },
  lazy: true,
  optimizationsEnabled: true,
  swipeEnabled: false,
});

type InjectedProps = {|
  id: EntityID,
  navigation: Navigation,
|};

@errorBoundary(<ErrorScreen showBackButton />)
@flatNavigationParamsAndScreenProps
@observer
class TapDetailsScreen extends InjectedComponent<InjectedProps> {
  static router = TapDetailsNavigator.router;

  @computed
  get _tapDataLoader(): LoadObject<[Tap, ?Permission, FlowSensor]> {
    const { id = 2 } = this.injectedProps;
    return LoadObject.merge([
      TapStore.getByID(id),
      PermissionStore.getForEntityByID('tap', id),
      FlowSensorStore.getMany({
        filters: [DAOApi.createFilter('tap/id').equals(id)],
        limit: 1,
        orderBy: [{ column: 'id', direction: 'desc' }],
      }).map(
        (loaders: Array<LoadObject<FlowSensor>>): LoadObject<FlowSensor> =>
          loaders[0] || LoadObject.empty(),
      ),
    ]);
  }

  render() {
    return (
      <LoaderComponent
        loadedComponent={LoadedComponent}
        loader={this._tapDataLoader}
        loadingComponent={LoadingComponent}
        navigation={this.injectedProps.navigation}
      />
    );
  }
}

const LoadingComponent = () => (
  <Container>
    <Header showBackButton title="Tap" />
    <LoadingIndicator />
  </Container>
);

type LoadedComponentProps = {
  navigation: Navigation,
  value: [Tap, ?Permission, ?FlowSensor],
};

@observer
class LoadedComponent extends React.Component<LoadedComponentProps> {
  _onNoFlowSensorWarningPress = () => {
    const { navigation, value } = this.props;
    const [tap] = value;

    navigation.navigate('newFlowSensor', {
      returnOnFinish: true,
      showBackButton: true,
      tapId: tap.id,
    });
  };

  render() {
    const { navigation, value } = this.props;
    const [tap, tapPermission, flowSensor] = value;
    const { id, hideLeaderboard, hideStats } = tap;

    // workaround for dynamically hiding tabs
    // todo change it when they implement the feature
    // https://github.com/react-navigation/react-navigation/issues/717
    // https://react-navigation.canny.io/feature-requests/p/hiding-tab-from-the-tabbar
    const navState = navigation.state;
    const hideProps = { hideLeaderboard, hideStats };

    const filteredTabRoutes = navState.routes.filter(
      (route: Object): boolean => {
        const { hidePropName } = tabScreens[route.routeName];
        return !hidePropName || !hideProps[hidePropName];
      },
    );

    const activeIndex = filteredTabRoutes.findIndex(
      (route: Object): boolean =>
        route.routeName === navState.routes[navState.index].routeName,
    );

    const noFlowSensorWarning =
      !flowSensor && checkCanEdit(tapPermission) ? (
        <WarningNotification
          message="You haven't setup flow sensor on the tap. Click to setup."
          onPress={this._onNoFlowSensorWarningPress}
        />
      ) : null;

    return (
      <Container>
        <Header
          rightComponent={
            !checkCanEdit(tapPermission) ? null : (
              <HeaderNavigationButton
                name="edit"
                params={{ id }}
                toRoute="editTap"
              />
            )
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
          screenProps={{
            noFlowSensorWarning,
            tap,
            tapPermission,
          }}
        />
      </Container>
    );
  }
}

export default TapDetailsScreen;
