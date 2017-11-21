// @flow

import type { LoadingObject } from 'brewskey.js-api';

import * as React from 'react';
import ErrorListItem from './ErrorListItem';
import LoadingListItem from './LoadingListItem';

type Props<TEntity> = {|
  errorListItem: React.ComponentType,
  listItem: React.ComponentType,
  loader: LoadingObject<TEntity>,
  loadingListItem: React.ComponentType,
|};

class LoaderRow<TEntity> extends React.PureComponent<Props<TEntity>> {
  static defaultProps = {
    renderErrorListItem: () => <ErrorListItem />,
    renderLoadingListItem: () => <LoadingListItem />,
  };

  render() {
    const {
      loader,
      renderErrorListItem,
      renderListItem,
      renderLoadingListItem,
    } = this.props;

    if (loader.isLoading()) {
      return renderLoadingListItem();
    }

    if (loader.hasError()) {
      return renderErrorListItem(loader.getErrorEnforcing());
    }

    return renderListItem(loader.getValueEnforcing());
  }
}

export default LoaderRow;
