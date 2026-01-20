import LoginScreen from './screens/LoginScreen';
import RegisterScreen from './screens/RegisterScreen';
import ResetPasswordScreen from './screens/ResetPasswordScreen';

import BeverageDetailsScreen from './screens/BeverageDetailsScreen';
import DeviceDetailsScreen from './screens/DeviceDetailsScreen';
import DevicesScreen from './screens/DevicesScreen';
import EditBeverageScreen from './screens/EditBeverageScreen';
import EditDeviceScreen from './screens/EditDeviceScreen';
import EditFlowSensorScreen from './screens/EditFlowSensorScreen';
import EditLocationScreen from './screens/EditLocationScreen';
import HomeScreen from './screens/HomeScreen';
import LocationDetailsScreen from './screens/LocationDetailsScreen';
import LocationsScreen from './screens/LocationsScreen';
import MyBeveragesScreen from './screens/MyBeveragesScreen';
import MyProfileScreen from './screens/MyProfileScreen';
import NewBeverageScreen from './screens/NewBeverageScreen';
import NewDeviceScreen from './screens/NewDeviceScreen';
import NewLocationScreen from './screens/NewLocationScreen';
import NewTapScreen from './screens/NewTapScreen';
import PaymentsScreen from './screens/PaymentsScreen';
import ProfileScreen from './screens/ProfileScreen';
import { TapsScreen } from './screens/TapsScreen';
import { WifiSetupScreen } from './screens/WifiSetupScreen';
import HelpScreen from './screens/HelpScreen';
import MyFriendsScreen from './screens/MyFriendsScreen';
import { WriteNFCScreen } from './screens/WriteNFCScreen';

import NuxLocationScreen from './screens/NuxLocationScreen';
import NuxWifiSetupScreen from './screens/NuxWifiScreen';
import NuxDeviceScreen from './screens/NuxDeviceScreen';
import NuxTapScreen from './screens/NuxTapScreen';
import NuxFinishScreen from './screens/NuxFinishScreen';

import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import {
  NavigationProp,
  StaticParamList,
  createStaticNavigation,
  LinkingOptions,
} from '@react-navigation/native';
import { useIsSignedIn, useIsSignedOut } from './hooks/context/AuthContext';
import { Platform } from 'react-native';
import { MainTabBar } from './components/MainTabBar/MainTabBar';
import { StatsScreen } from './screens/StatsScreen';
import { MenuScreen } from './screens/MenuScreen';
import SettingsScreen from './screens/SettingsScreen';
import { NotificationsScreen } from './screens/NotificationsScreen';
import { TapDetailsScreen } from './screens/TapDetailsScreen';
import { NewFlowSensorScreen } from './screens/NewFlowSensorScreen';
import { NewFlowSensorCustomScreen } from './screens/NewFlowSensorCustomScreen';
import EditTapScreen from './screens/EditTapScreen';
import NewKegScreen from './screens/NewKegScreen';
import TapDetailsKegScreen from './screens/TapDetailsKegScreen';
import TapDetailsStatsScreen from './screens/TapDetailsStatsScreen';
import { TapDetailsLeaderboardScreen } from './screens/TapDetailsLeaderboardScreen';


const HomeStack = createNativeStackNavigator({
  initialRouteName: 'homeMain',
  screenOptions: {
    headerShown: false,
  },
  screens: {
    homeMain: {
      screen: HomeScreen,
      linking: { path: '', exact: false },
    },
    tapDetails: {
      screen: TapDetailsScreen,
      linking: {
        path: 'tap/:tapId',
        exact: false,
      },
    },
    editTap: {
      screen: EditTapScreen,
      linking: {
        path: 'tap/:tapId/edit',
        exact: false,
      },
    },
    newKeg: {
      screen: NewKegScreen,
      linking: {
        path: 'tap/:tapId/keg/new',
        exact: false,
      },
    },
    newTap: {
      screen: NewTapScreen,
      linking: { path: 'tap/new', exact: false },
    },
    editFlowSensor: {
      screen: EditFlowSensorScreen,
      linking: {
        path: 'flow-sensor/:tapId/edit',
        exact: false,
      },
    },
    profile: {
      screen: ProfileScreen,
      linking: { path: 'profile/:id', exact: false },
    },
    tapDetailsKeg: {
      screen: TapDetailsKegScreen,
      linking: {
        path: 'tap/:tapId/keg',
        exact: false,
      },
    },
    tapDetailsStats: {
      screen: TapDetailsStatsScreen,
      linking: {
        path: 'tap/:tapId/stats',
        exact: false,
      },
    },
    tapDetailsLeaderboard: {
      screen: TapDetailsLeaderboardScreen,
      linking: {
        path: 'tap/:tapId/leaderboard',
        exact: false,
      },
    },
    newFlowSensor: NewFlowSensorScreen,
    newFlowSensorCustom: NewFlowSensorCustomScreen,
  },
});

export type HomeStackParamList = StaticParamList<typeof HomeStack>;

const NotificationStack = createNativeStackNavigator({
  initialRouteName: 'notificationsMain',
  screenOptions: {
    headerShown: false,
  },
  screens: {
    notificationsMain: NotificationsScreen,
    myFriends: MyFriendsScreen,
    // Linking paths are defined in HomeStack to avoid conflicts
    // These screens share the same canonical paths regardless of which stack they're accessed from
    tapDetails: TapDetailsScreen,
    editTap: EditTapScreen,
    newKeg: NewKegScreen,
    newTap: NewTapScreen,
    editFlowSensor: EditFlowSensorScreen,
    profile: ProfileScreen,
    tapDetailsKeg: TapDetailsKegScreen,
    tapDetailsStats: TapDetailsStatsScreen,
    tapDetailsLeaderboard: TapDetailsLeaderboardScreen,
  },
});

const LocationsStack = createNativeStackNavigator({
  initialRouteName: 'locationsMain',
  screenOptions: {
    headerShown: false,
  },
  screens: {
    locationsMain: {
      screen: LocationsScreen,
      linking: { path: 'locations', exact: false },
    },
    editLocation: EditLocationScreen,
    locationDetails: LocationDetailsScreen,
    newLocation: NewLocationScreen,
  },
});

const TapsStack = createNativeStackNavigator({
  initialRouteName: 'tapsMain',
  screenOptions: {
    headerShown: false,
  },
  screens: {
    tapsMain: {
      screen: TapsScreen,
      linking: { path: 'taps', exact: false },
    },
    tapDetails: TapDetailsScreen,
    editTap: EditTapScreen,
    newKeg: NewKegScreen,
    newTap: NewTapScreen,
    editFlowSensor: EditFlowSensorScreen,
    profile: ProfileScreen,
    tapDetailsKeg: TapDetailsKegScreen,
    tapDetailsStats: TapDetailsStatsScreen,
    tapDetailsLeaderboard: TapDetailsLeaderboardScreen,
  },
});

const DevicesStack = createNativeStackNavigator({
  initialRouteName: 'devicesMain',
  screenOptions: {
    headerShown: false,
  },
  screens: {
    devicesMain: {
      screen: DevicesScreen,
      linking: { path: 'devices', exact: false },
    },
    deviceDetails: DeviceDetailsScreen,
    editDevice: EditDeviceScreen,
    newDevice: NewDeviceScreen,
    wifiSetup: WifiSetupScreen,
    tapDetails: TapDetailsScreen,
    editTap: EditTapScreen,
    newKeg: NewKegScreen,
    newTap: NewTapScreen,
    editFlowSensor: EditFlowSensorScreen,
    profile: ProfileScreen,
    tapDetailsKeg: TapDetailsKegScreen,
    tapDetailsStats: TapDetailsStatsScreen,
    tapDetailsLeaderboard: TapDetailsLeaderboardScreen,
  },
});

const MyBeveragesStack = createNativeStackNavigator({
  initialRouteName: 'myBeveragesMain',
  screenOptions: {
    headerShown: false,
  },
  screens: {
    myBeveragesMain: {
      screen: MyBeveragesScreen,
      linking: { path: 'beverages', exact: false },
    },
    beverageDetails: BeverageDetailsScreen,
    editBeverage: EditBeverageScreen,
    newBeverage: {
      screen: NewBeverageScreen,
      linking: { path: 'beverages/new', exact: false },
    },
  },
});

const MenuStack = createNativeStackNavigator({
  initialRouteName: 'menuMain',
  screenOptions: {
    headerShown: false,
  },
  screens: {
    menuMain: MenuScreen,
    nuxLocation: NuxLocationScreen,
    nuxWifi: NuxWifiSetupScreen,
    nuxDevice: NuxDeviceScreen,
    nuxTap: NuxTapScreen,
    nuxFinish: NuxFinishScreen,
    // Linking path for profile is defined in HomeStack to avoid conflicts
    profile: ProfileScreen,
    myProfile: MyProfileScreen,
    myFriends: MyFriendsScreen,
    locations: LocationsStack,
    taps: TapsStack,
    newFlowSensor: NewFlowSensorScreen,
    newFlowSensorCustom: NewFlowSensorCustomScreen,
    devices: DevicesStack,
    myBeverages: MyBeveragesStack,
    writeNFC: WriteNFCScreen,
    payments: PaymentsScreen,
    help: HelpScreen,
    settings: SettingsScreen,
  },
});

const LoggedInStack = createBottomTabNavigator({
  tabBar: (props) => <MainTabBar {...props} />,
  screenOptions: {
    headerShown: false,
  },
  initialRouteName: 'home',
  screens: {
    home: {
      screen: HomeStack,
      linking: { path: '', exact: false },
    },
    stats: {
      screen: StatsScreen,
      linking: { path: 'stats', exact: false },
    },
    notifications: {
      screen: NotificationStack,
      linking: { path: 'notifications', exact: false },
    },
    menu: {
      screen: MenuStack,
      linking: { path: 'menu', exact: false },
    },
  },
});

const RootStack = createNativeStackNavigator({
  groups: {
    SignedIn: {
      if: useIsSignedIn,
      screens: {
        LoggedInStack: LoggedInStack,
      },
    },
    SignedOut: {
      if: useIsSignedOut,
      initialRouteName: 'login',
      screens: {
        login: {
          screen: LoginScreen,
          linking: { path: 'login', exact: false },
        },
        register: {
          screen: RegisterScreen,
          linking: { path: 'register', exact: false },
        },
        resetPassword: {
          screen: ResetPasswordScreen,
          linking: { path: 'resetPassword', exact: false },
        },
      },
    },
  },
  screenOptions: {
    headerShown: false,
  },
});

export type RootStackParamList = StaticParamList<typeof RootStack>;
declare global {
   
  namespace ReactNavigation {
    interface RootParamList extends RootStackParamList {}
  }
}

const Navigation = createStaticNavigation(RootStack);

// Linking configuration for web browser navigation
// We use explicit linking paths for duplicate screens to avoid conflicts while enabling URL syncing.
// The 'exact: false' option allows these screens to share the same canonical path regardless of which stack they're accessed from.
const linking = Platform.OS === 'web' 
  ? {
      enabled: true,
      prefixes: ['/'],
    }
  : {
      enabled: false,
      prefixes: [],
    };

// Wrapper component that passes linking prop for web browser navigation
export const AppRouter = () => {
  return <Navigation linking={linking} />;
};

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
