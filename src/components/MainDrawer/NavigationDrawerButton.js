// @flow

import type { Navigation } from '../../types';

import * as React from 'react';
import InjectedComponent from '../../common/InjectedComponent';
import DrawerButton from './DrawerButton';
import { withNavigation } from 'react-navigation';

type InjectedProps = {|
  navigation: Navigation,
|};

type Props = {
  icon: { name: string, type?: string },
  isActive: boolean,
  routeKey: string,
  // other RNEButton Props
};

@withNavigation
class NavigationDrawerButton extends InjectedComponent<InjectedProps, Props> {
  _onPress = () => this.injectedProps.navigation.navigate(this.props.routeKey);

  render() {
    return <DrawerButton {...this.props} onPress={this._onPress} />;
  }
}

export default NavigationDrawerButton;
