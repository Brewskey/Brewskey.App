// @flow

import {
  StackNavigator,
  SwitchNavigator,
  TabNavigator,
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
import HardwareSetupScreen from './screens/HardwareSetupScreen';

/* eslint-disable sorting/sort-object-props */
const AppRouter = SwitchNavigator(
  {
    splash: SplashScreen,
    auth: StackNavigator(
      {
        login: LoginScreen,
        register: RegisterScreen,
        resetPassword: ResetPasswordScreen,
      },
      {
        headerMode: 'none',
      },
    ),
    hardwareSetup: HardwareSetupScreen,
    main: TabNavigator(
      {
        home: HomeScreen,
        stats: StatsScreen,
        notifications: NotificationsScreen,
        menu: StackNavigator(
          {
            mainMenu: MenuScreen,
            profile: ProfileScreen,
            myProfile: MyProfileScreen,
            locations: StackNavigator(
              {
                locations: LocationsScreen,
                editLocation: EditLocationScreen,
                locationDetails: LocationDetailsScreen,
                newLocation: NewLocationScreen,
              },
              { headerMode: 'none' },
            ),
            taps: StackNavigator(
              {
                taps: TapsScreen,
                editFlowSensor: EditFlowSensorScreen,
                editTap: EditTapScreen,
                newFlowSensor: NewFlowSensorScreen,
                newKeg: NewKegScreen,
                newTap: NewTapScreen,
                tapDetails: TapDetailsScreen,
              },
              {
                headerMode: 'none',
              },
            ),
            devices: StackNavigator(
              {
                devices: DevicesScreen,
                deviceDetails: DeviceDetailsScreen,
                editDevice: EditDeviceScreen,
                newDevice: NewDeviceScreen,
                wifiSetup: WifiSetupScreen,
              },
              {
                headerMode: 'none',
              },
            ),
            myBeverages: StackNavigator(
              {
                myBeverages: MyBeveragesScreen,
                beverageDetails: BeverageDetailsScreen,
                editBeverage: EditBeverageScreen,
                newBeverage: NewBeverageScreen,
              },
              {
                headerMode: 'none',
              },
            ),
            help: HelpScreen,
            settings: StackNavigator(
              {
                settings: SettingsScreen,
              },
              { headerMode: 'none' },
            ),
          },
          { headerMode: 'none' },
        ),
      },
      {
        animationEnabled: false,
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
