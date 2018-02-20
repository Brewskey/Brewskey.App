// @flow

import type { Navigation } from '../types';

import * as React from 'react';
import { action, observable } from 'mobx';
import { observer } from 'mobx-react';
import hoistNonReactStatic from 'hoist-non-react-statics';

const lazyLoad = <TProps: { navigation?: Navigation }>(
  Component: React.ComponentType<TProps>,
): React.ComponentType<TProps> => {
  @observer
  class LazyLoad extends React.Component<TProps> {
    _willFocusSubscription: ?Object;
    @observable _isFocused: boolean = false;

    @action
    _setIsFocused = (isFocused: boolean) => {
      this._isFocused = isFocused;
    };

    componentWillMount() {
      const { navigation } = this.props;
      if (!navigation) {
        return;
      }

      this._willFocusSubscription = navigation.addListener('willFocus', () =>
        this._setIsFocused(true),
      );
    }

    componentWillUnmount() {
      if (this._willFocusSubscription) {
        this._willFocusSubscription.remove();
      }
    }

    render() {
      return this._isFocused ? <Component {...this.props} /> : null;
    }
  }

  hoistNonReactStatic(LazyLoad, Component);
  return LazyLoad;
};

export default lazyLoad;
