// @flow

import type { Navigation } from '../../types';

import * as React from 'react';
import InjectedComponent from '../InjectedComponent';
import { withNavigation } from 'react-navigation';
import { COLORS } from '../../theme';
import IconButton from '../buttons/IconButton';

type InjectedProps = {|
  navigation: Navigation,
|};

type Props = {
  toRoute: string,
  // react-native-element icon props
};

@withNavigation
class HeaderNavigationButton extends InjectedComponent<InjectedProps, Props> {
  _onButtonPress = () =>
    this.injectedProps.navigation.navigate(this.props.toRoute);

  render() {
    return (
      <IconButton
        color={COLORS.textInverse}
        {...this.props}
        onPress={this._onButtonPress}
      />
    );
  }
}

export default HeaderNavigationButton;
