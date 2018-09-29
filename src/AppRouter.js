// @flow

import {
  createStackNavigator,
  createSwitchNavigator,
  createBottomTabNavigator,
} from 'react-navigation';

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

import NuxLocationScreen from './screens/NuxLocationScreen';
import NuxWifiSetupScreen from './screens/NuxWifiScreen';
import NuxDeviceScreen from './screens/NuxDeviceScreen';
import NuxTapScreen from './screens/NuxTapScreen';
import NuxFinishScreen from './screens/NuxFinishScreen';

const STACK_CONFIG = {
  headerMode: 'none',
};

/* eslint-disable sorting/sort-object-props */
const TapRouting = {
  tapDetails: TapDetailsScreen,
  editTap: EditTapScreen,
  newKeg: NewKegScreen,
  newTap: NewTapScreen,
  editFlowSensor: EditFlowSensorScreen,
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
            tapDetails: createStackNavigator(TapRouting, STACK_CONFIG),
          },
          STACK_CONFIG,
        ),
        stats: StatsScreen,
        notifications: NotificationsScreen,
        menu: createStackNavigator(
          {
            mainMenu: MenuScreen,
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
                editLocation: EditLocationScreen,
                locationDetails: LocationDetailsScreen,
                newLocation: NewLocationScreen,
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
            newFlowSensor: NewFlowSensorScreen,
            newFlowSensorCustom: NewFlowSensorCustomScreen,
            devices: createStackNavigator(
              {
                devices: DevicesScreen,
                deviceDetails: DeviceDetailsScreen,
                editDevice: EditDeviceScreen,
                newDevice: NewDeviceScreen,
                wifiSetup: WifiSetupScreen,
                ...TapRouting,
              },
              STACK_CONFIG,
            ),
            myBeverages: createStackNavigator(
              {
                myBeverages: MyBeveragesScreen,
                beverageDetails: BeverageDetailsScreen,
                editBeverage: EditBeverageScreen,
                newBeverage: NewBeverageScreen,
              },
              STACK_CONFIG,
            ),
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
        animationEnabled: false,
        lazy: true,
        swipeEnabled: false,
        tabBarComponent: MainTabBar,
        tabBarPosition: 'bottom',
      },
    ),
  },
  {
    initialRouteName: 'splash',
  },
);

export default AppRouter;
