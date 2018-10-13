// @flow

import type { NavigationParams } from 'react-navigation';

import nullthrows from 'nullthrows';
import { NavigationActions, StackActions } from 'react-navigation';

// todo annotate better
export const getCurrentRoute = (navigationState: Object): Object => {
  const route = navigationState.routes[navigationState.index];
  if (route.routes) {
    return getCurrentRoute(route);
  }
  return route;
};

class NavigationService {
  static _navigator: ?Object;

  static getNavigator = (): Object => nullthrows(NavigationService._navigator);

  static setNavigator = (navigator: ?Object) => {
    NavigationService._navigator = navigator;
  };

  static dispatch = (navigationAction: Object) =>
    NavigationService.getNavigator().dispatch(navigationAction);

  static goBack = (): void =>
    NavigationService.getNavigator().dispatch(NavigationActions.back());

  static navigate = (routeName: string, params?: NavigationParams): void =>
    NavigationService.getNavigator().dispatch(
      NavigationActions.navigate({ params, routeName }),
    );

  static reset = (
    stackName: string,
    routeName: string,
    params?: NavigationParams,
  ): void =>
    NavigationService.getNavigator().dispatch(
      StackActions.reset({
        actions: [NavigationActions.navigate({ params, routeName })],
        index: 0,
        key: stackName,
      }),
    );
}

export default NavigationService;
