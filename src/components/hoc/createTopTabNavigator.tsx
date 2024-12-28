import * as React from 'react';
import { Dimensions } from 'react-native';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import hoistNonReactStatic from 'hoist-non-react-statics';
import theme from '../../theme';

type ExportType<TConfig> = React.ComponentType<TConfig> & {
  router: any;
};

export default function createTopTabNavigator<TConfig>(
  config: any,
): ExportType<TConfig> {
  const TopTab = createMaterialTopTabNavigator({
    screens: {},
    ...theme.tabBar,
    initialLayout: {
      height: 0,
      width: Dimensions.get('window').width,
    },
  });

  class NavigatorWrapper extends React.Component<TConfig> {
    render(): React.ReactElement {
      // workaround for dynamically hiding tabs
      // todo change it when they implement the feature
      // https://github.com/react-navigation/react-navigation/issues/717
      // https://react-navigation.canny.io/feature-requests/p/hiding-tab-from-the-tabbar
      const { navigation, ...otherProps } = this.props;
      const navState = navigation.state;
      const filteredTabRoutes = navState.routes.filter(
        (route: any): boolean => {
          const { getShouldShowTab } = config[route.routeName];
          return (
            getShouldShowTab == null || getShouldShowTab(otherProps.screenProps)
          );
        },
      );

      const activeIndex = filteredTabRoutes.findIndex(
        (route: any): boolean =>
          route.routeName === navState.routes[navState.index].routeName,
      );

      return (
        <TopTab.Navigator
          screenOptions={{
            lazy: true,
            swipeEnabled: false,
          }}
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
  return NavigatorWrapper as ExportType<TConfig>;
}
