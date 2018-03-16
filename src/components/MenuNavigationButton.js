// @flow

import type { Navigation } from '../types';
import type { Props as MenuButtonProps } from './MenuButton';

import * as React from 'react';
import InjectedComponent from '../common/InjectedComponent';
import { withNavigation } from 'react-navigation';
import MenuButton from './MenuButton';

type Props = {
  routeName: string,
} & MenuButtonProps;

type InjectedProps = {|
  navigation: Navigation,
|};

@withNavigation
class MenuNavigationButton extends InjectedComponent<InjectedProps, Props> {
  _onPress = () => this.injectedProps.navigation.navigate(this.props.routeName);

  render() {
    return <MenuButton {...this.props} onPress={this._onPress} />;
  }
}

export default MenuNavigationButton;
