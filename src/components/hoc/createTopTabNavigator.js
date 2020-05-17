// @flow

import type { Navigation } from '../../types';

import * as React from 'react';
import { Dimensions } from 'react-native';
import { createMaterialTopTabNavigator } from 'react-navigation-tabs';
import hoistNonReactStatic from 'hoist-non-react-statics';
import theme from '../../theme';

type ExportType<TConfig> = React.ComponentType<TConfig> & {
  router: Object,
};

export default function createTopTabNavigator<
  TScreenProps: {},
  TConfig: { navigation: Navigation, screenProps: TScreenProps },
>(config: Object): ExportType<TConfig> {
  const Navigator = createMaterialTopTabNavigator(config, {
    ...theme.tabBar,
    initialLayout: {
      height: 0,
      width: Dimensions.get('window').width,
    },
    lazy: true,
    swipeEnabled: false,
  });

  class NavigatorWrapper extends React.Component<TConfig> {
    render(): React.Node {
      // workaround for dynamically hiding tabs
      // todo change it when they implement the feature
      // https://github.com/react-navigation/react-navigation/issues/717
      // https://react-navigation.canny.io/feature-requests/p/hiding-tab-from-the-tabbar
      const { navigation, ...otherProps } = this.props;
      const navState = navigation.state;
      const filteredTabRoutes = navState.routes.filter(
        (route: Object): boolean => {
          const { getShouldShowTab } = config[route.routeName];
          return (
            getShouldShowTab == null || getShouldShowTab(otherProps.screenProps)
          );
        },
      );

      const activeIndex = filteredTabRoutes.findIndex(
        (route: Object): boolean =>
          route.routeName === navState.routes[navState.index].routeName,
      );

      return (
        <Navigator
          {...otherProps}
          navigation={{
            ...navigation,
            state: {
              ...navigation.state,
              index: activeIndex,
              routes: filteredTabRoutes,
            },
          }}
        />
      );
    }
  }

  hoistNonReactStatic(NavigatorWrapper, Navigator);
  return ((NavigatorWrapper: any): ExportType<TConfig>);
}
