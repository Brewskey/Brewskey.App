// @flow

import * as React from 'react';
import { getElementFromComponentProp } from '../utils';

type Props = {
  children?: React.Node,
  fallbackComponent: ?React.Element<any> | React.ComponentType<any>,
};

type State = {
  error: ?Error,
};

class ErrorBoundary extends React.PureComponent<Props, State> {
  state = {
    error: null,
  };

  componentDidCatch(error) {
    this.setState(() => ({ error }));
  }

  render() {
    const { fallbackComponent } = this.props;

    if (this.state.error) {
      return getElementFromComponentProp(fallbackComponent);
    }
    return this.props.children;
  }
}

export default ErrorBoundary;
