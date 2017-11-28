// @flow

import type { LoadObject } from 'brewskey.js-api';

import * as React from 'react';
// imported from experimental sources
// eslint-disable-next-line
import SwipeableRow from 'SwipeableRow';
import LoaderRow from './LoaderRow';

type Props<TEntity> = {
  isOpen: boolean,
  loader: LoadObject<TEntity>,
  maxSwipeDistance: number,
  onClose: () => void,
  onOpen: (rowKey: string) => void,
  onSwipeEnd?: () => void,
  onSwipeStart?: () => void,
  preventSwipeRight?: boolean,
  renderErrorListItem: (error: Error) => React.Node,
  renderListItem: (item: TEntity) => React.Node,
  renderLoadingListItem: () => React.Node,
  renderSlideoutView: (item: TEntity) => React.Node,
  rowKey: string,
  shouldBounceOnMount: boolean,
  swipeThreshold?: number,
};

class SwipeableLoaderRow<TEntity> extends React.PureComponent<Props<TEntity>> {
  static defaultProps = {
    maxSwipeDistance: 150,
    preventSwipeRight: true,
  };

  _onOpen = (): void => this.props.onOpen(this.props.rowKey);

  render() {
    const {
      renderErrorListItem,
      renderListItem,
      loader,
      renderLoadingListItem,
      renderSlideoutView,
      ...swipeableProps
    } = this.props;

    const loaderRow = (
      <LoaderRow
        loader={loader}
        renderErrorListItem={renderErrorListItem}
        renderListItem={renderListItem}
        renderLoadingListItem={renderLoadingListItem}
      />
    );

    if (!loader.hasValue()) {
      return loaderRow;
    }

    const slideoutView = renderSlideoutView(loader.getValueEnforcing());

    return (
      <SwipeableRow
        {...swipeableProps}
        onOpen={this._onOpen}
        slideoutView={slideoutView}
      >
        {loaderRow}
      </SwipeableRow>
    );
  }
}

export default SwipeableLoaderRow;
