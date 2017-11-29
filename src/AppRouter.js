// @flow

import * as React from 'react';
import { DrawerNavigator, StackNavigator } from 'react-navigation';
import PourButtonStore from './stores/PourButtonStore';

import MainDrawer from './components/MainDrawer';

import LoginScreen from './screens/LoginScreen';
import SplashScreen from './screens/SplashScreen';

import BeverageDetailsScreen from './screens/BeverageDetailsScreen';
import DeviceDetailsScreen from './screens/DeviceDetailsScreen';
import DevicesScreen from './screens/DevicesScreen';
import EditBeverageScreen from './screens/EditBeverageScreen';
import EditDeviceScreen from './screens/EditDeviceScreen';
import EditLocationScreen from './screens/EditLocationScreen';
import EditTapScreen from './screens/EditTapScreen';
import HomeScreen from './screens/HomeScreen';
import LocationDetailsScreen from './screens/LocationDetailsScreen';
import LocationsScreen from './screens/LocationsScreen';
import MyBeveragesScreen from './screens/MyBeveragesScreen';
import NewBeverageScreen from './screens/NewBeverageScreen';
import NewDeviceScreen from './screens/NewDeviceScreen';
import NewLocationScreen from './screens/NewLocationScreen';
import NewTapScreen from './screens/NewTapScreen';
import ProfileScreen from './screens/ProfileScreen';
import SettingsScreen from './screens/SettingsScreen';
import TapDetailsScreen from './screens/TapDetailsScreen';
import TapsScreen from './screens/TapsScreen';

type Props = {|
  rootRef: React.Ref<StackNavigator>,
|};

/* eslint-disable sorting/sort-object-props */
class AppRouter extends React.Component<Props> {
  _onNavigationStateChange = (
    previous: Object,
    next: Object,
    action: { routeName: string },
  ) => {
    if (action.routeName === 'DrawerOpen') {
      PourButtonStore.hide();
    }
    if (action.routeName === 'DrawerClose') {
      PourButtonStore.show();
    }
  };

  render() {
    const RootRouter = StackNavigator(
      {
        splash: { screen: SplashScreen },
        login: { screen: LoginScreen },
        main: {
          screen: DrawerNavigator(
            {
              home: {
                screen: StackNavigator(
                  { home: { screen: HomeScreen } },
                  { headerMode: 'none' },
                ),
              },
              profile: {
                screen: StackNavigator(
                  { profile: { screen: ProfileScreen } },
                  { headerMode: 'none' },
                ),
              },
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
                    headerMode: 'none',
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
                    headerMode: 'none',
                    initialRoute: 'taps',
                  },
                ),
              },
              devices: {
                screen: StackNavigator(
                  {
                    devices: { screen: DevicesScreen },
                    deviceDetails: { screen: DeviceDetailsScreen },
                    editDevice: { screen: EditDeviceScreen },
                    newDevice: { screen: NewDeviceScreen },
                  },
                  {
                    gesturesEnabled: false,
                    headerMode: 'none',
                    initialRoute: 'devices',
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
                    headerMode: 'none',
                    initialRoute: 'myBeverages',
                  },
                ),
              },
              settings: {
                screen: StackNavigator(
                  {
                    settings: { screen: SettingsScreen },
                  },
                  { headerMode: 'none' },
                ),
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
    return (
      <RootRouter
        {...this.props}
        onNavigationStateChange={this._onNavigationStateChange}
        ref={this.props.rootRef}
      />
    );
  }
}

export default AppRouter;
