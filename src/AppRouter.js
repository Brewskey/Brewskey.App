// @flow

import type {
  NavigationContainer,
  NavigationContainerProps,
  NavigationState,
} from 'react-navigation';

import { createAppContainer, createSwitchNavigator } from 'react-navigation';
import { createStackNavigator } from 'react-navigation-stack';
import { createBottomTabNavigator } from 'react-navigation-tabs';

import MainTabBar from './components/MainTabBar';

import LoginScreen from './screens/LoginScreen';
import RegisterScreen from './screens/RegisterScreen';
import ResetPasswordScreen from './screens/ResetPasswordScreen';
import SplashScreen from './screens/SplashScreen';

import BeverageDetailsScreen from './screens/BeverageDetailsScreen';
import DeviceDetailsScreen from './screens/DeviceDetailsScreen';
import DevicesScreen from './screens/DevicesScreen';
import EditBeverageScreen from './screens/EditBeverageScreen';
import EditDeviceScreen from './screens/EditDeviceScreen';
import EditFlowSensorScreen from './screens/EditFlowSensorScreen';
import EditLocationScreen from './screens/EditLocationScreen';
import EditTapScreen from './screens/EditTapScreen';
import HomeScreen from './screens/HomeScreen';
import LocationDetailsScreen from './screens/LocationDetailsScreen';
import LocationsScreen from './screens/LocationsScreen';
import MyBeveragesScreen from './screens/MyBeveragesScreen';
import MyProfileScreen from './screens/MyProfileScreen';
import NewBeverageScreen from './screens/NewBeverageScreen';
import NewDeviceScreen from './screens/NewDeviceScreen';
import NewFlowSensorScreen from './screens/NewFlowSensorScreen';
import NewFlowSensorCustomScreen from './screens/NewFlowSensorCustomScreen';
import NewKegScreen from './screens/NewKegScreen';
import NewLocationScreen from './screens/NewLocationScreen';
import NewTapScreen from './screens/NewTapScreen';
import PaymentsScreen from './screens/PaymentsScreen';
import ProfileScreen from './screens/ProfileScreen';
import SettingsScreen from './screens/SettingsScreen';
import TapDetailsScreen from './screens/TapDetailsScreen';
import TapsScreen from './screens/TapsScreen';
import WifiSetupScreen from './screens/WifiSetupScreen';
import NotificationsScreen from './screens/NotificationsScreen';
import MenuScreen from './screens/MenuScreen';
import StatsScreen from './screens/StatsScreen';
import HelpScreen from './screens/HelpScreen';
import MyFriendsScreen from './screens/MyFriendsScreen';
import WriteNFCScreen from './screens/WriteNFCScreen';

import NuxLocationScreen from './screens/NuxLocationScreen';
import NuxWifiSetupScreen from './screens/NuxWifiScreen';
import NuxDeviceScreen from './screens/NuxDeviceScreen';
import NuxTapScreen from './screens/NuxTapScreen';
import NuxFinishScreen from './screens/NuxFinishScreen';

import hideFooterHOC from './components/hoc/hideFooterHOC';

const STACK_CONFIG = {
  headerMode: 'none',
};

/* eslint-disable sorting/sort-object-props */
const TapRouting = {
  tapDetails: TapDetailsScreen,
  editTap: hideFooterHOC(EditTapScreen),
  newKeg: hideFooterHOC(NewKegScreen),
  newTap: hideFooterHOC(NewTapScreen),
  editFlowSensor: hideFooterHOC(EditFlowSensorScreen),
  profile: ProfileScreen,
};

/* eslint-disable sorting/sort-object-props */
const AppRouter = createSwitchNavigator(
  {
    splash: SplashScreen,
    auth: createStackNavigator(
      {
        login: LoginScreen,
        register: RegisterScreen,
        resetPassword: ResetPasswordScreen,
      },
      STACK_CONFIG,
    ),
    main: createBottomTabNavigator(
      {
        home: createStackNavigator(
          {
            home: HomeScreen,
            ...TapRouting,
          },
          STACK_CONFIG,
        ),
        stats: StatsScreen,
        notifications: createStackNavigator(
          {
            notifications: NotificationsScreen,
            myFriends: MyFriendsScreen,
            ...TapRouting,
          },
          STACK_CONFIG,
        ),
        menu: createStackNavigator(
          {
            menu: MenuScreen,
            nuxLocation: NuxLocationScreen,
            nuxWifi: NuxWifiSetupScreen,
            nuxDevice: NuxDeviceScreen,
            nuxTap: NuxTapScreen,
            nuxFinish: NuxFinishScreen,
            profile: ProfileScreen,
            myProfile: MyProfileScreen,
            myFriends: MyFriendsScreen,
            locations: createStackNavigator(
              {
                locations: LocationsScreen,
                editLocation: hideFooterHOC(EditLocationScreen),
                locationDetails: LocationDetailsScreen,
                newLocation: hideFooterHOC(NewLocationScreen),
              },
              STACK_CONFIG,
            ),
            taps: createStackNavigator(
              {
                taps: TapsScreen,
                ...TapRouting,
              },
              STACK_CONFIG,
            ),
            newFlowSensor: hideFooterHOC(NewFlowSensorScreen),
            newFlowSensorCustom: hideFooterHOC(NewFlowSensorCustomScreen),
            devices: createStackNavigator(
              {
                devices: DevicesScreen,
                deviceDetails: DeviceDetailsScreen,
                editDevice: hideFooterHOC(EditDeviceScreen),
                newDevice: hideFooterHOC(NewDeviceScreen),
                wifiSetup: hideFooterHOC(WifiSetupScreen),
                ...TapRouting,
              },
              STACK_CONFIG,
            ),
            myBeverages: createStackNavigator(
              {
                myBeverages: MyBeveragesScreen,
                beverageDetails: BeverageDetailsScreen,
                editBeverage: hideFooterHOC(EditBeverageScreen),
                newBeverage: hideFooterHOC(NewBeverageScreen),
              },
              STACK_CONFIG,
            ),
            writeNFC: hideFooterHOC(WriteNFCScreen),
            payments: PaymentsScreen,
            help: HelpScreen,
            settings: createStackNavigator(
              {
                settings: SettingsScreen,
              },
              STACK_CONFIG,
            ),
          },
          STACK_CONFIG,
        ),
      },
      {
        //animationEnabled: false,
        lazy: true,
        // swipeEnabled: false,
        tabBarComponent: MainTabBar,
        // tabBarPosition: 'bottom',
      },
    ),
  },
  {
    initialRouteName: 'splash',
  },
);

export default (createAppContainer(AppRouter): NavigationContainer <
  NavigationState,
  {||},
NavigationContainerProps < {||}, NavigationState >,
>);
