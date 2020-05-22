// @flow

import type { Navigation } from '../../types';

import * as React from 'react';
import InjectedComponent from '../InjectedComponent';
import { withNavigation } from 'react-navigation';
import HeaderIconButton from './HeaderIconButton';

type InjectedProps = {|
  navigation: Navigation,
|};

type Props = {|
  ...React.ElementProps<typeof HeaderIconButton>,
  params?: Object,
  toRoute: string,
|};

@withNavigation
class HeaderNavigationButton extends InjectedComponent<InjectedProps, Props> {
  _onButtonPress = () => {
    const { params, toRoute } = this.props;
    this.injectedProps.navigation.navigate(toRoute, params);
  };

  render(): React.Node {
    const { params: _1, toRoute: _2, ...otherProps } = this.props;
    return <HeaderIconButton {...otherProps} onPress={this._onButtonPress} />;
  }
}

export default HeaderNavigationButton;
