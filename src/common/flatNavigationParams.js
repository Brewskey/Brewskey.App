// @flow

import * as React from 'react';
import hoistNonReactStatic from 'hoist-non-react-statics';

// todo fix following eslint error
/* eslint-disable react/display-name */
const flatNavigationParams = <TProps: { navigation: Object }, TParams>(
  Component: React.ComponentType<TProps>,
): React.ComponentType<TProps & TParams> => {
  class FlatNavigationParams extends React.Component<TProps & TParams> {
    render(): React.Element<*> {
      return (
        <Component
          {...this.props}
          {...this.props.navigation.state.params || {}}
        />
      );
    }
  }

  hoistNonReactStatic(FlatNavigationParams, Component);
  return FlatNavigationParams;
};

export default flatNavigationParams;
