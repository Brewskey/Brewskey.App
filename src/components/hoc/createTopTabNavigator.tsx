import * as React from 'react';

import { createMaterialTopTabNavigator } from "expo-router/js-top-tabs";
import { Dimensions } from 'react-native';

import { theme } from 'theme';

import type { NavigationState, Route } from "expo-router/react-navigation";

type TabConfig = Record<
  string,
  { getShouldShowTab?: (screenProps: unknown) => boolean }
>;

type ExportType<TConfig> = React.ComponentType<TConfig> & {
  router: unknown;
};

export const createTopTabNavigator = <TConfig,>(
  config: TabConfig,
): ExportType<TConfig> => {
  const TopTab = createMaterialTopTabNavigator({
    screens: {},
    ...theme.tabBar,
    initialLayout: {
      height: 0,
      width: Dimensions.get('window').width,
    },
  });

  const NavigatorWrapper: React.FC<
    TConfig & {
      navigation?: { state?: NavigationState };
      screenProps?: unknown;
      children?: React.ReactNode;
    }
  > = (props) => {
    // workaround for dynamically hiding tabs
    // todo change it when they implement the feature
    // https://github.com/react-navigation/react-navigation/issues/717
    // https://react-navigation.canny.io/feature-requests/p/hiding-tab-from-the-tabbar
    const { navigation, screenProps, children, ...otherProps } =
      props as TConfig & {
        navigation?: { state?: NavigationState };
        screenProps?: unknown;
        children?: React.ReactNode;
      };
    const navState = navigation?.state;
    const filteredTabRoutes = (navState?.routes?.filter(
      (route: Route<string>): boolean => {
        const routeName =
          'name' in route
            ? route.name
            : (route as { routeName?: string }).routeName;
        const { getShouldShowTab } = config[routeName ?? ''];
        return getShouldShowTab == null || getShouldShowTab(screenProps);
      },
    ) || []) as Route<string>[];

    const activeIndex = filteredTabRoutes.findIndex(
      (route: Route<string>): boolean => {
        const routeName =
          'name' in route
            ? route.name
            : (route as { routeName?: string }).routeName;
        const activeRouteName = navState?.routes?.[navState?.index ?? 0];
        const activeName =
          activeRouteName &&
          ('name' in activeRouteName
            ? activeRouteName.name
            : (activeRouteName as { routeName?: string }).routeName);
        return routeName === activeName;
      },
    );

    return (
      <TopTab.Navigator
        screenOptions={{
          lazy: true,
          swipeEnabled: false,
        }}
        {...(otherProps as TConfig)}
        navigation={
          navigation
            ? {
                ...navigation,
                state: {
                  ...navigation.state,
                  index: activeIndex,
                  routes: filteredTabRoutes,
                },
              }
            : undefined
        }
      >
        {children}
      </TopTab.Navigator>
    );
  };

  return NavigatorWrapper as ExportType<TConfig>;
};
