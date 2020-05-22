// @flow

import type { Navigation } from '../types';
import type { NavigationNavigateAction } from 'react-navigation';

import * as React from 'react';
import InjectedComponent from '../common/InjectedComponent';
import { withNavigation } from 'react-navigation';
import MenuButton from './MenuButton';

type Props = {|
  ...React.ElementProps<typeof MenuButton>,
  action?: NavigationNavigateAction,
  routeName: string,
|};

type InjectedProps = {|
  navigation: Navigation,
|};

@withNavigation
class MenuNavigationButton extends InjectedComponent<InjectedProps, Props> {
  _onPress = () =>
    this.injectedProps.navigation.navigate({
      action: this.props.action,
      routeName: this.props.routeName,
    });

  render(): React.Node {
    const { action: _1, routeName: _2, ...otherProps } = this.props;
    return <MenuButton {...otherProps} onPress={this._onPress} />;
  }
}

export default MenuNavigationButton;
