import * as React from 'react';
import hoistNonReactStatic from 'hoist-non-react-statics';
import TabBarStore from '../../stores/TabBarStore';

export default function hideTabHOC<Config>(
  Component: React.ComponentType<Config>,
): React.ComponentType<Config> {
  class HideTabHOC extends React.Component<Config> {
    componentWillMount() {
      TabBarStore.isTabBarVisible = false;
    }

    componentWillUnmount() {
      TabBarStore.isTabBarVisible = true;
    }

    render(): React.ReactElement {
      return <Component {...this.props} />;
    }
  }

  hoistNonReactStatic(HideTabHOC, Component);
  return HideTabHOC;
}
