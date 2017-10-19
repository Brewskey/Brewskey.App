// @flow

import * as React from 'react';
import { DrawerNavigator, StackNavigator } from 'react-navigation';
import { inject } from 'mobx-react';

import MainDrawer from './components/MainDrawer';

import LoginScreen from './screens/LoginScreen';
import SplashScreen from './screens/SplashScreen';

import HomeScreen from './screens/HomeScreen';
import LocationDetailsScreen from './screens/LocationDetailsScreen';
import LocationsScreen from './screens/LocationsScreen';
import EditLocationScreen from './screens/EditLocationScreen';
import NewLocationScreen from './screens/NewLocationScreen';
import SettingsScreen from './screens/SettingsScreen';

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
              home: {
                screen: StackNavigator({ home: { screen: HomeScreen } }),
              },
              ...this._addInitialRouteSettings(
                {
                  locations: {
                    screen: StackNavigator(
                      {
                        // todo ordering matter figure out why initialRoute
                        // doesn't work
                        locations: { screen: LocationsScreen },
                        editLocation: { screen: EditLocationScreen },
                        locationDetails: { screen: LocationDetailsScreen },
                        newLocation: { screen: NewLocationScreen },
                      },
                      {
                        gesturesEnabled: false,
                        headerStyle: { backgroundColor: 'black' },
                        initialRoute: 'locations',
                        lazy: true,
                      },
                    ),
                  },
                },
                { requireManageTaps: true },
              ),
              settings: {
                screen: StackNavigator({
                  settings: { screen: SettingsScreen },
                }),
              },
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
