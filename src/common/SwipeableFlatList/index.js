// The component is temporary stolen from
// https://github.com/facebook/react-native/blob/master/Libraries/Experimental/SwipeableRow/SwipeableFlatList.js
// it exists on master branch, but not in release yet.
// I modified it in some places and made it actually works as expected
// (open only one row at a time, close rows on scroll, these don't work in
// original )
/* eslint-disable */

// @flow

import type RNFlatList, { Props as FlatListProps } from 'FlatList';
import type { renderItemType } from 'VirtualizedList';

import * as React from 'react';
import { View } from 'react-native';
import FlatList from '../FlatList';

type SwipeableListProps = {
  bounceFirstRowOnMount: boolean,
};

type Props<TEntity> = SwipeableListProps & FlatListProps<TEntity>;

type State = {|
  openRowKey: ?string,
|};

class SwipeableFlatList<TEntity> extends React.PureComponent<
  Props<TEntity>,
  State,
> {
  static defaultProps = {
    ...FlatList.defaultProps,
    bounceFirstRowOnMount: true,
  };

  state = {
    openRowKey: null,
  };

  _flatListRef: ?RNFlatList<TEntity> = null;

  resetOpenRow = (): void => this.setState(() => ({ openRowKey: null }));

  _setListViewScrollableTo(value: boolean) {
    if (!this._flatListRef) {
      return;
    }
    this._flatListRef.setNativeProps({
      scrollEnabled: value,
    });
  }

  _setListViewScrollable = (): void => this._setListViewScrollableTo(true);

  _setListViewNotScrollable = (): void => this._setListViewScrollableTo(false);

  _onOpen = (key: string): void => this.setState(() => ({ openRowKey: key }));

  _onClose = (): void => this.resetOpenRow();

  _onScroll = (event: SyntheticEvent<*>): void => {
    this.resetOpenRow();
    this.props.onScroll && this.props.onScroll(event);
  };

  _setFlatListRef = ref => {
    this._flatListRef = ref;
  };

  _renderItem = (info: { item: TEntity, index: number }): React.Node => {
    const key = this.props.keyExtractor(info.item, info.index);
    return this.props.renderItem({
      info,
      isOpen: key === this.state.openRowKey,
      onClose: this._onClose,
      onOpen: this._onOpen,
      onSwipeEnd: this._setListViewScrollable,
      onSwipeStart: this._setListViewNotScrollable,
      preventSwipeRight: this.props.preventSwipeRight,
      rowKey: key,
      shouldBounceOnMount: this.props.bounceFirstRowOnMount && info.index === 0,
    });
  };

  render() {
    return (
      <FlatList
        {...this.props}
        extraData={this.state}
        innerRef={this._setFlatListRef}
        onScroll={this._onScroll}
        renderItem={this._renderItem}
      />
    );
  }
}

export default SwipeableFlatList;
