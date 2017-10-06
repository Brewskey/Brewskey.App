// @flow

import type { NavigationParams, NavigationRoute } from 'react-navigation';

import { NavigationActions } from 'react-navigation';

class NavigationService {
  static _navigator: Object;

  static setNavigator = navigator => {
    NavigationService._navigator = navigator;
  };

  // todo wrap in nulltrows
  static navigate = (routeName: string, params?: NavigationParams): void =>
    NavigationService._navigator.dispatch(
      NavigationActions.navigate({ params, routeName }),
    );
  // todo add other methods like back etc
}

export default NavigationService;
