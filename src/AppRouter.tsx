// import MainTabBar from './components/MainTabBar';

import LoginScreen from './screens/LoginScreen';
// import RegisterScreen from './screens/RegisterScreen';
import ResetPasswordScreen from './screens/ResetPasswordScreen';
// import SplashScreen from './screens/SplashScreen';

// import BeverageDetailsScreen from './screens/BeverageDetailsScreen';
// import DeviceDetailsScreen from './screens/DeviceDetailsScreen';
// import DevicesScreen from './screens/DevicesScreen';
// import EditBeverageScreen from './screens/EditBeverageScreen';
// import EditDeviceScreen from './screens/EditDeviceScreen';
// import EditFlowSensorScreen from './screens/EditFlowSensorScreen';
// import EditLocationScreen from './screens/EditLocationScreen';
// import EditTapScreen from './screens/EditTapScreen';
// import HomeScreen from './screens/HomeScreen';
// import LocationDetailsScreen from './screens/LocationDetailsScreen';
// import LocationsScreen from './screens/LocationsScreen';
// import MyBeveragesScreen from './screens/MyBeveragesScreen';
// import MyProfileScreen from './screens/MyProfileScreen';
// import NewBeverageScreen from './screens/NewBeverageScreen';
// import NewDeviceScreen from './screens/NewDeviceScreen';
// import NewFlowSensorScreen from './screens/NewFlowSensorScreen';
// import NewFlowSensorCustomScreen from './screens/NewFlowSensorCustomScreen';
// import NewKegScreen from './screens/NewKegScreen';
// import NewLocationScreen from './screens/NewLocationScreen';
// import NewTapScreen from './screens/NewTapScreen';
// import PaymentsScreen from './screens/PaymentsScreen';
// import ProfileScreen from './screens/ProfileScreen';
// import SettingsScreen from './screens/SettingsScreen';
// import TapDetailsScreen from './screens/TapDetailsScreen';
// import TapsScreen from './screens/TapsScreen';
// import WifiSetupScreen from './screens/WifiSetupScreen';
// import NotificationsScreen from './screens/NotificationsScreen';
// import MenuScreen from './screens/MenuScreen';
// import { StatsScreen } from './screens/StatsScreen';
// import HelpScreen from './screens/HelpScreen';
// import MyFriendsScreen from './screens/MyFriendsScreen';
// import { WriteNFCScreen } from './screens/WriteNFCScreen';

// import NuxLocationScreen from './screens/NuxLocationScreen';
// import NuxWifiSetupScreen from './screens/NuxWifiScreen';
// import NuxDeviceScreen from './screens/NuxDeviceScreen';
// import NuxTapScreen from './screens/NuxTapScreen';
// import NuxFinishScreen from './screens/NuxFinishScreen';

// import hideFooterHOC from './components/hoc/hideFooterHOC';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import {
  StaticParamList,
  createStaticNavigation,
} from '@react-navigation/native';
// import TapDetailsKegScreen from './screens/TapDetailsKegScreen';
import { createStackNavigator } from '@react-navigation/stack';
import HomeScreen from './screens/HomeScreen';
import { useIsSignedIn, useIsSignedOut } from './hooks/context/AuthContext';
import { MainTabBar } from './components/MainTabBar/MainTabBar';
import { StatsScreen } from './screens/StatsScreen';
import MenuScreen from './screens/MenuScreen';
import SettingsScreen from './screens/SettingsScreen';
import NotificationsScreen from './screens/NotificationsScreen';
import { TapDetailsScreen } from './screens/TapDetailsScreen';

const STACK_CONFIG = {
  headerMode: 'none',
} as const;

const TapDetailsRouting = createNativeStackNavigator({
  initialRouteName: 'tapDetails',
  screens: {
    tapDetails: TapDetailsScreen,
    // editTap: hideFooterHOC(EditTapScreen),
    // newKeg: hideFooterHOC(NewKegScreen),
    // newTap: hideFooterHOC(NewTapScreen),
    // editFlowSensor: hideFooterHOC(EditFlowSensorScreen),
    // profile: ProfileScreen,
    // tapDetailsKeg: TapDetailsKegScreen,
    // tapDetailsStats: {
    //   getShouldShowTab: ({ tap }) => !tap.hideStats,
    //   screen: TapDetailsStatsScreen,
    // },
    // tapDetailsLeaderboard: {
    //   getShouldShowTab: ({ tap }) => !tap.hideLeaderboard,
    //   screen: TapDetailsLeaderboardScreen,
    // },
  },
  screenOptions: {
    headerShown: false,
  },
});

// const DeviceRouting = createNativeStackNavigator({
//   screens: {
//     deviceDetails: DeviceDetailsScreen,
//   },
// });

const LoggedInStack = createBottomTabNavigator({
  tabBar: MainTabBar,
  screenOptions: {
    headerShown: false,
  },
  initialRouteName: 'home',
  screens: {
    home: createNativeStackNavigator({
      screenOptions: {
        headerShown: false,
      },
      screens: {
        home: HomeScreen,
        TapStack: TapDetailsRouting,
        // DeviceRouting: DeviceRouting,
      },
      config: STACK_CONFIG,
    }),
    stats: StatsScreen,
    notifications: StatsScreen,
    menu: StatsScreen,
    // notificationStack: createStackNavigator({
    //   screens: {
    //     notifications: NotificationsScreen,
    //     // myFriends: MyFriendsScreen,
    //   },
    //   config: STACK_CONFIG,
    // }),
    // menuStack: createStackNavigator({
    //   screens: {
    //     menu: MenuScreen,
    //     // nuxLocation: NuxLocationScreen,
    //     // nuxWifi: NuxWifiSetupScreen,
    //     // nuxDevice: NuxDeviceScreen,
    //     // nuxTap: NuxTapScreen,
    //     // nuxFinish: NuxFinishScreen,
    //     // profile: ProfileScreen,
    //     // myProfile: MyProfileScreen,
    //     // myFriends: MyFriendsScreen,
    //     // locations: createStackNavigator(
    //     //   {
    //     //     locations: LocationsScreen,
    //     //     editLocation: hideFooterHOC(EditLocationScreen),
    //     //     locationDetails: LocationDetailsScreen,
    //     //     newLocation: hideFooterHOC(NewLocationScreen),
    //     //   },
    //     //   STACK_CONFIG,
    //     // ),
    //     // taps: createStackNavigator(
    //     //   {
    //     //     taps: TapsScreen,
    //     //     ...TapRouting,
    //     //   },
    //     //   STACK_CONFIG,
    //     // ),
    //     // newFlowSensor: hideFooterHOC(NewFlowSensorScreen),
    //     // newFlowSensorCustom: hideFooterHOC(NewFlowSensorCustomScreen),
    //     // devices: createStackNavigator(
    //     //   {
    //     //     devices: DevicesScreen,
    //     //     deviceDetails: DeviceDetailsScreen,
    //     //     editDevice: hideFooterHOC(EditDeviceScreen),
    //     //     newDevice: hideFooterHOC(NewDeviceScreen),
    //     //     wifiSetup: hideFooterHOC(WifiSetupScreen),
    //     //     ...TapRouting,
    //     //   },
    //     //   STACK_CONFIG,
    //     // ),
    //     // myBeverages: createStackNavigator(
    //     //   {
    //     //     myBeverages: MyBeveragesScreen,
    //     //     beverageDetails: BeverageDetailsScreen,
    //     //     editBeverage: hideFooterHOC(EditBeverageScreen),
    //     //     newBeverage: hideFooterHOC(NewBeverageScreen),
    //     //   },
    //     //   STACK_CONFIG,
    //     // ),
    //     // writeNFC: hideFooterHOC(WriteNFCScreen),
    //     // payments: PaymentsScreen,
    //     // help: HelpScreen,
    //     settings: SettingsScreen,

    //     // settings: createStackNavigator(
    //     //   {
    //     //     settings: SettingsScreen,
    //     //   },
    //     //   STACK_CONFIG,
    //     // ),
    //   },
    //   config: STACK_CONFIG,
    // }),
  },
});

const RootStack = createNativeStackNavigator({
  initialRouteName: 'login',
  // screens: {
  //   loggedIn: LoggedInStack,
  //   login: LoginScreen,
  //   // register: RegisterScreen,
  //   resetPassword: ResetPasswordScreen,
  // },
  groups: {
    SignedIn: {
      if: useIsSignedIn,
      screens: {
        LoggedInStack: LoggedInStack,
        // Profile: ProfileScreen,
      },
    },
    SignedOut: {
      if: useIsSignedOut,
      screens: {
        login: LoginScreen,
        // register: RegisterScreen,
        resetPassword: ResetPasswordScreen,
      },
    },
  },
  screenOptions: {
    headerShown: false,
  },
});

export type RootStackParamList = StaticParamList<typeof RootStack>;
declare global {
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace ReactNavigation {
    interface RootParamList extends RootStackParamList {}
  }
}

export const AppRouter = createStaticNavigation(RootStack);

// return (
//   <Stack.Navigator>
//     <Stack.Screen name={Routes.Login} component={LoginScreen} />
//     <Stack.Screen name={Routes.Register} component={RegisterScreen} />
//     <Stack.Screen
//       name={Routes.ResetPassword}
//       component={ResetPasswordScreen}
//     />
//   </Stack.Navigator>
// );

// const AppRouter = createSwitchNavigator(
//   {
//     splash: SplashScreen,
//     auth: createNativeStackNavigator(
//       {
//         login: LoginScreen,
//         register: RegisterScreen,
//         resetPassword: ResetPasswordScreen,
//       },
//       STACK_CONFIG,
//     ),
//     main: createBottomTabNavigator(
//       {
//         home: createNativeStackNavigator(
//           {
//             home: HomeScreen,
//             ...TapRouting,
//           },
//           STACK_CONFIG,
//         ),
//         stats: StatsScreen,
//         notifications: createStackNavigator(
//           {
//             notifications: NotificationsScreen,
//             myFriends: MyFriendsScreen,
//             ...TapRouting,
//           },
//           STACK_CONFIG,
//         ),
//         menu: createStackNavigator(
//           {
//             menu: MenuScreen,
//             nuxLocation: NuxLocationScreen,
//             nuxWifi: NuxWifiSetupScreen,
//             nuxDevice: NuxDeviceScreen,
//             nuxTap: NuxTapScreen,
//             nuxFinish: NuxFinishScreen,
//             profile: ProfileScreen,
//             myProfile: MyProfileScreen,
//             myFriends: MyFriendsScreen,
//             locations: createStackNavigator(
//               {
//                 locations: LocationsScreen,
//                 editLocation: hideFooterHOC(EditLocationScreen),
//                 locationDetails: LocationDetailsScreen,
//                 newLocation: hideFooterHOC(NewLocationScreen),
//               },
//               STACK_CONFIG,
//             ),
//             taps: createStackNavigator(
//               {
//                 taps: TapsScreen,
//                 ...TapRouting,
//               },
//               STACK_CONFIG,
//             ),
//             newFlowSensor: hideFooterHOC(NewFlowSensorScreen),
//             newFlowSensorCustom: hideFooterHOC(NewFlowSensorCustomScreen),
//             devices: createStackNavigator(
//               {
//                 devices: DevicesScreen,
//                 deviceDetails: DeviceDetailsScreen,
//                 editDevice: hideFooterHOC(EditDeviceScreen),
//                 newDevice: hideFooterHOC(NewDeviceScreen),
//                 wifiSetup: hideFooterHOC(WifiSetupScreen),
//                 ...TapRouting,
//               },
//               STACK_CONFIG,
//             ),
//             myBeverages: createStackNavigator(
//               {
//                 myBeverages: MyBeveragesScreen,
//                 beverageDetails: BeverageDetailsScreen,
//                 editBeverage: hideFooterHOC(EditBeverageScreen),
//                 newBeverage: hideFooterHOC(NewBeverageScreen),
//               },
//               STACK_CONFIG,
//             ),
//             writeNFC: hideFooterHOC(WriteNFCScreen),
//             payments: PaymentsScreen,
//             help: HelpScreen,
//             settings: createStackNavigator(
//               {
//                 settings: SettingsScreen,
//               },
//               STACK_CONFIG,
//             ),
//           },
//           STACK_CONFIG,
//         ),
//       },
//       {
//         //animationEnabled: false,
//         lazy: true,
//         // swipeEnabled: false,
//         tabBarComponent: MainTabBar,
//         // tabBarPosition: 'bottom',
//       },
//     ),
//   },
//   {
//     initialRouteName: 'splash',
//   },
// );

// export default createAppContainer(AppRouter) as NavigationContainer<
//   NavigationState,
//   Record<any, any>,
//   NavigationContainerProps<Record<any, any>, NavigationState>
// >;
