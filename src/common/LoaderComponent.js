// @flow

import type { LoadObject } from 'brewskey.js-api';

import * as React from 'react';
import LoadingIndicator from './LoadingIndicator';

type Props<TValue> = {|
  loader: LoadObject<TValue>,
  renderDeleting: () => React.Node,
  renderError: (error: Error) => React.Node,
  renderLoaded: (value: TValue) => React.Node,
  renderLoading: () => React.Node,
  renderUpdating: () => React.Node,
|};

class LoaderComponent<TValue> extends React.Component<Props<TValue>> {
  static defaultProps = {
    renderDeleting: () => null,
    renderError: () => null,
    renderLoaded: () => null,
    renderLoading: () => <LoadingIndicator />,
    renderUpdating: () => null,
  };

  render() {
    const {
      loader,
      renderDeleting,
      renderError,
      renderLoaded,
      renderLoading,
      renderUpdating,
    } = this.props;

    if (loader.isLoading()) {
      return renderLoading();
    }

    if (loader.isUpdating()) {
      return renderUpdating();
    }

    if (loader.isDeleting()) {
      return renderDeleting();
    }

    if (loader.hasError()) {
      return renderError(loader.getErrorEnforcing());
    }

    return renderLoaded(loader.getValueEnforcing());
  }
}

export default LoaderComponent;
