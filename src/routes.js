// @flow

import * as React from 'react';
import { DrawerNavigator, StackNavigator } from 'react-navigation';
import { inject } from 'mobx-react';

import MainDrawer from './components/MainDrawer';

import LoginScreen from './screens/LoginScreen';
import SplashScreen from './screens/SplashScreen';

import HomeScreen from './screens/HomeScreen';
import SettingsScreen from './screens/SettingsScreen';
import LocationsScreen from './screens/LocationsScreen';

type Props = {|
  routesSettingsStore: RoutesSettingsStore,
|};

@inject('routesSettingsStore')
/* eslint-disable sorting/sort-object-props */
class AppRouter extends React.Component<Props> {
  _addInitialRouteSettings = (
    routeObject: Object,
    settings: $Shape<RouteSettings>,
  ): Object => {
    Object.keys(routeObject).forEach((routeName: string) => {
      this.props.routesSettingsStore.updateRouteSettings(routeName, settings);
    });

    return routeObject;
  };

  render(): React.Element<*> {
    const RootRouter = StackNavigator(
      {
        splash: { screen: SplashScreen },
        login: { screen: LoginScreen },
        main: {
          screen: DrawerNavigator(
            {
              home: { screen: HomeScreen },
              ...this._addInitialRouteSettings(
                { locations: { screen: LocationsScreen } },
                { requireManageTaps: true },
              ),
              settings: { screen: SettingsScreen },
            },
            {
              contentComponent: MainDrawer,
            },
          ),
        },
      },
      {
        headerMode: 'none',
        initialRouteName: 'splash',
        navigationOptions: {
          gesturesEnabled: false,
        },
      },
    );
    return <RootRouter {...this.props} ref={this.props.rootRef} />;
  }
}

export default AppRouter;
