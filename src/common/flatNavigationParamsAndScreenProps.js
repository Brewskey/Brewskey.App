// @flow

import type { Navigation } from '../types';

import * as React from 'react';
import hoistNonReactStatic from 'hoist-non-react-statics';

// todo fix following eslint error
/* eslint-disable react/display-name */
const flatNavigationParamsAndScreenProps = <
  TProps: {| navigation: Navigation, screenProps?: Object |},
  TParams,
>(
  Component: React.ComponentType<TProps>,
): React.ComponentType<TProps & TParams> => {
  class FlatNavigationParamsAndScreenProps extends React.Component<
    TProps & TParams,
  > {
    render(): React.Node {
      const { navigation, screenProps } = this.props;
      const params = (navigation && navigation.state.params) || {};
      return <Component {...params} {...(screenProps || {})} {...this.props} />;
    }
  }

  hoistNonReactStatic(FlatNavigationParamsAndScreenProps, Component);
  return FlatNavigationParamsAndScreenProps;
};

export default flatNavigationParamsAndScreenProps;
