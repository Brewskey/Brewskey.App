// @flow

import type { NavigationParams } from 'react-navigation';

import nullthrows from 'nullthrows';
import { NavigationActions } from 'react-navigation';

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

  // todo this works only for rootNavigator
  // need to implement something like navigateDeep with good api
  static reset = (routeName: string, params?: NavigationParams): void =>
    NavigationService.getNavigator().dispatch(
      NavigationActions.reset({
        actions: [NavigationActions.navigate({ params, routeName })],
        index: 0,
        key: null,
      }),
    );
}

export default NavigationService;
