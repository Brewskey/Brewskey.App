// @flow

import type { Navigation } from '../../types';

import * as React from 'react';
import hoistNonReactStatic from 'hoist-non-react-statics';
import { runInAction } from 'mobx';
import TabBarStore from '../../stores/TabBarStore';

export default function hideTabHOC<Config: { navigation: Navigation }>(
  Component: React.AbstractComponent<Config>,
): React.AbstractComponent<Config> {
  class HideTabHOC extends React.Component<Config> {
    componentWillMount() {
      runInAction(() => {
        TabBarStore.isTabBarVisible = false;
      });
    }

    componentWillUnmount() {
      runInAction(() => {
        TabBarStore.isTabBarVisible = true;
      });
    }

    render() {
      return <Component {...this.props} />;
    }
  }

  hoistNonReactStatic(HideTabHOC, Component);
  return HideTabHOC;
}
