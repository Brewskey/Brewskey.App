// @flow

import type { Navigation } from '../../types';

import * as React from 'react';
import InjectedComponent from '../InjectedComponent';
import { withNavigation } from 'react-navigation';
import HeaderIconButton from './HeaderIconButton';

type InjectedProps = {
  navigation: Navigation,
};

@withNavigation
class HeaderBackButton extends InjectedComponent<InjectedProps> {
  _onButtonPress = () => this.injectedProps.navigation.goBack(null);

  render() {
    return <HeaderIconButton name="arrow-back" onPress={this._onButtonPress} />;
  }
}

export default HeaderBackButton;
