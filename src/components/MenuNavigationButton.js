// @flow

import type { Navigation } from '../types';
import type { Props as MenuButtonProps } from './MenuButton';
import type { NavigationNavigateAction } from 'react-navigation';

import * as React from 'react';
import InjectedComponent from '../common/InjectedComponent';
import { withNavigation } from 'react-navigation';
import MenuButton from './MenuButton';

type Props<TOtherProps> = MenuButtonProps<{|
  ...TOtherProps,
  action?: NavigationNavigateAction,
  routeName: string,
|}>;

type InjectedProps = {|
  navigation: Navigation,
|};

@withNavigation
class MenuNavigationButton<TOtherProps> extends InjectedComponent<
  InjectedProps,
  Props<TOtherProps>,
> {
  _onPress = () =>
    this.injectedProps.navigation.navigate({
      action: this.props.action,
      routeName: this.props.routeName,
    });

  render(): React.Node {
    return <MenuButton {...this.props} onPress={this._onPress} />;
  }
}

export default MenuNavigationButton;
