// @flow

import * as React from 'react';
import { getElementFromComponentProp } from '../utils';
import hoistNonReactStatic from 'hoist-non-react-statics';

type Props = {
  children: React.Node,
  fallbackComponent: ?React.Element<any> | React.ComponentType<any>,
};

type State = {
  error: ?Error,
};

class ErrorBoundary extends React.PureComponent<Props, State> {
  state = {
    error: null,
  };

  componentDidCatch(error: Error) {
    this.setState(() => ({ error }));
  }

  render(): React.Node {
    const { fallbackComponent } = this.props;

    if (this.state.error) {
      return getElementFromComponentProp(fallbackComponent) ?? null;
    }
    return this.props.children;
  }
}

export const errorBoundary = <TProps: {}>(
  fallbackComponent: ?React.Element<any> | React.ComponentType<any>,
) => (
  Component: React.ComponentType<TProps>,
): Class<React.PureComponent<TProps>> => {
  class WithErrorBoundary extends React.PureComponent<TProps> {
    render() {
      return (
        <ErrorBoundary fallbackComponent={fallbackComponent}>
          <Component {...this.props} />
        </ErrorBoundary>
      );
    }
  }

  hoistNonReactStatic(WithErrorBoundary, Component);
  return WithErrorBoundary;
};

export default ErrorBoundary;
