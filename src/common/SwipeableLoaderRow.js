// @flow

import * as React from 'react';
// imported from experimental sources
// eslint-disable-next-line
import SwipeableRow from 'SwipeableRow';
import LoaderRow from './LoaderRow';

type Props<TEntity> = {
  renderErrorListItem: React.ComponentType,
  isOpen: boolean,
  renderListItem: React.ComponentType,
  loader: LoadObject<TEntity>,
  renderLoadingListItem: React.ComponentType,
  onClose: () => void,
  onOpen: (rowKey: string) => void,
};

class SwipeableLoaderRow<TEntity> extends React.PureComponent<Props<TEntity>> {
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

    if (!loader.hasValue()) {
      return (
        <LoaderRow
          loader={loader}
          renderErrorListItem={renderErrorListItem}
          renderListItem={renderListItem}
          renderLoadingListItem={renderLoadingListItem}
        />
      );
    }

    const slideoutView = renderSlideoutView(loader.getValueEnforcing());

    return (
      <SwipeableRow
        {...swipeableProps}
        onOpen={this._onOpen}
        slideoutView={slideoutView}
      >
        <LoaderRow
          loader={loader}
          renderErrorListItem={renderErrorListItem}
          renderListItem={renderListItem}
          renderLoadingListItem={renderLoadingListItem}
        />
      </SwipeableRow>
    );
  }
}

export default SwipeableLoaderRow;
