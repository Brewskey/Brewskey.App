// @flow

import * as React from 'react';
import { DrawerNavigator, StackNavigator } from 'react-navigation';
import { inject } from 'mobx-react';

import MainDrawer from './components/MainDrawer';

import LoginScreen from './screens/LoginScreen';
import SplashScreen from './screens/SplashScreen';

import BeverageDetailsScreen from './screens/BeverageDetailsScreen';
import DeviceDetailsScreen from './screens/DeviceDetailsScreen';
import DevicesScreen from './screens/DevicesScreen';
import EditBeverageScreen from './screens/EditBeverageScreen';
import EditLocationScreen from './screens/EditLocationScreen';
import EditTapScreen from './screens/EditTapScreen';
import HomeScreen from './screens/HomeScreen';
import LocationDetailsScreen from './screens/LocationDetailsScreen';
import LocationsScreen from './screens/LocationsScreen';
import MyBeveragesScreen from './screens/MyBeveragesScreen';
import NewBeverageScreen from './screens/NewBeverageScreen';
import NewLocationScreen from './screens/NewLocationScreen';
import NewTapScreen from './screens/NewTapScreen';
import SettingsScreen from './screens/SettingsScreen';
import TapDetailsScreen from './screens/TapDetailsScreen';
import TapsScreen from './screens/TapsScreen';

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
        // main: { screen: TestScreen },
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
                        initialRoute: 'locations',
                      },
                    ),
                  },
                  taps: {
                    screen: StackNavigator(
                      {
                        taps: { screen: TapsScreen },
                        editTap: { screen: EditTapScreen },
                        tapDetails: { screen: TapDetailsScreen },
                        newTap: { screen: NewTapScreen },
                      },
                      {
                        gesturesEnabled: false,
                        initialRoute: 'taps',
                      },
                    ),
                  },
                  devices: {
                    screen: StackNavigator(
                      {
                        devices: { screen: DevicesScreen },
                        deviceDetails: { screen: DeviceDetailsScreen },
                      },
                      {
                        gesturesEnabled: false,
                        initialRoute: '',
                      },
                    ),
                  },
                  myBeverages: {
                    screen: StackNavigator(
                      {
                        myBeverages: { screen: MyBeveragesScreen },
                        beverageDetails: { screen: BeverageDetailsScreen },
                        editBeverage: { screen: EditBeverageScreen },
                        newBeverage: { screen: NewBeverageScreen },
                      },
                      {
                        gesturesEnabled: false,
                        initialRoute: 'myBeverages',
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
