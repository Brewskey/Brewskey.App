// @flow

import type { Navigation } from '../../types';

import * as React from 'react';
import IconButton from '../buttons/IconButton';
import InjectedComponent from '../InjectedComponent';
import { withNavigation } from 'react-navigation';
import { COLORS } from '../../theme';

type InjectedProps = {
  navigation: Navigation,
};

@withNavigation
class HeaderBackButton extends InjectedComponent<InjectedProps> {
  _onButtonPress = () => this.injectedProps.navigation.goBack(null);

  render() {
    return (
      <IconButton
        color={COLORS.textInverse}
        name="arrow-back"
        onPress={this._onButtonPress}
      />
    );
  }
}

export default HeaderBackButton;
