// @flow

import * as React from 'react';
import hoistNonReactStatic from 'hoist-non-react-statics';

// todo fix following eslint error
/* eslint-disable react/display-name */
const flatNavigationParamsAndScreenProps = <
  TProps: { navigation: Object },
  TParams,
>(
  Component: React.ComponentType<TProps>,
): React.ComponentType<TProps & TParams> => {
  class FlatNavigationParamsAndScreenProps extends React.Component<
    TProps & TParams,
  > {
    render(): React.Element<*> {
      return (
        <Component
          {...this.props.navigation.state.params || {}}
          {...this.props.screenProps || {}}
          {...this.props}
        />
      );
    }
  }

  hoistNonReactStatic(FlatNavigationParamsAndScreenProps, Component);
  return FlatNavigationParamsAndScreenProps;
};

export default flatNavigationParamsAndScreenProps;
