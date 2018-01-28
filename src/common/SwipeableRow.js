// @flow

import * as React from 'react';
// imported from experimental sources
// eslint-disable-next-line
import RNSwipeableRow from 'SwipeableRow';

type SectionListInfo<TEntity> = {|
  index: number,
  item: TEntity,
  section: Object,
  separators: Object,
|};

type Props<TEntity> = {
  info: SectionListInfo<TEntity>,
  isOpen: boolean,
  maxSwipeDistance: number,
  onClose: () => void,
  onOpen: (rowKey: string) => void,
  onSwipeEnd?: () => void,
  onSwipeStart?: () => void,
  preventSwipeRight?: boolean,
  renderErrorListItem: (error: Error) => React.Node,
  renderListItem: (info: SectionListInfo<TEntity>) => React.Node,
  renderLoadingListItem: () => React.Node,
  renderSlideoutView: (SectionListInfo<TEntity>) => React.Node,
  rowKey: string,
  shouldBounceOnMount: boolean,
  swipeThreshold?: number,
};

class SwipeableRow<TEntity> extends React.Component<Props<TEntity>> {
  static defaultProps = {
    maxSwipeDistance: 150,
    preventSwipeRight: true,
  };

  _onOpen = (): void => this.props.onOpen(this.props.rowKey);

  render() {
    const {
      info,
      renderListItem,
      renderSlideoutView,
      ...swipeableProps
    } = this.props;
    const slideoutView = renderSlideoutView(info);

    return (
      <RNSwipeableRow
        {...swipeableProps}
        onOpen={this._onOpen}
        slideoutView={slideoutView}
      >
        {renderListItem(info)}
      </RNSwipeableRow>
    );
  }
}

export default SwipeableRow;
