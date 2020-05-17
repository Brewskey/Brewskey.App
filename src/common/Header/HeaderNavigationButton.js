// @flow

import type { Navigation } from '../../types';

import * as React from 'react';
import InjectedComponent from '../InjectedComponent';
import { withNavigation } from 'react-navigation';
import HeaderIconButton from './HeaderIconButton';

type InjectedProps = {|
  navigation: Navigation,
|};

type Props<TExtra> = {|
  ...TExtra,
  params?: Object,
  toRoute: string,
|};

@withNavigation
class HeaderNavigationButton<TExtra> extends InjectedComponent<
  InjectedProps,
  Props<TExtra>,
> {
  _onButtonPress = () => {
    const { params, toRoute } = this.props;
    this.injectedProps.navigation.navigate(toRoute, params);
  };

  render(): React.Node {
    return <HeaderIconButton {...this.props} onPress={this._onButtonPress} />;
  }
}

export default HeaderNavigationButton;
