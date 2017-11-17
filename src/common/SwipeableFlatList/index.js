// The component is temporary stolen from
// https://github.com/facebook/react-native/blob/master/Libraries/Experimental/SwipeableRow/SwipeableFlatList.js
// it exists on master branch, but not in release yet.
// I modified it in some places and made it actually works as expected
// (open only one row at a time, close rows on scroll, these don't work in
// original )
/* eslint-disable */

// @flow

import type { Props as FlatListProps } from 'FlatList';
import type { renderItemType } from 'VirtualizedList';

import * as React from 'react';
import { FlatList, Platform, View } from 'react-native';
import PureSwipeableRow from './PureSwipeableRow';

type SwipeableListProps = {
  bounceFirstRowOnMount: boolean,
  maxSwipeDistance: number | (Object => number),
  preventSwipeRight?: boolean,
  renderQuickActions: renderItemType,
};

type Props<TEntity> = SwipeableListProps & FlatListProps<TEntity>;

type State = {
  openRowKey: ?string,
  refreshing: boolean,
};

class SwipeableFlatList<TEntity> extends React.PureComponent<
  Props<TEntity>,
  State,
> {
  state = {
    openRowKey: null,
    refreshing: false,
  };

  _flatListRef: ?FlatList<TEntity> = null;
  _shouldBounceFirstRowOnMount: boolean = false;

  static defaultProps = {
    ...FlatList.defaultProps,
    bounceFirstRowOnMount: true,
    renderQuickActions: () => null,
  };

  constructor(props: Props<TEntity>, context: any) {
    super(props, context);

    this._shouldBounceFirstRowOnMount = this.props.bounceFirstRowOnMount;
  }

  resetOpenRow = (): void => this.setState(() => ({ openRowKey: null }));

  _onScroll = (event: SyntheticEvent<*>): void => {
    if (this.state.openRowKey) {
      this.setState(() => ({ openRowKey: null }));
    }

    this.props.onScroll && this.props.onScroll(event);
  };

  _renderItem = (info: { item: TEntity, index: number }): React.Node => {
    const slideoutView = this.props.renderQuickActions(info);
    const key = this.props.keyExtractor(info.item, info.index);

    if (!slideoutView) {
      return this.props.renderItem(info);
    }

    let shouldBounceOnMount = false;
    if (this._shouldBounceFirstRowOnMount) {
      this._shouldBounceFirstRowOnMount = false;
      shouldBounceOnMount = true;
    }

    return (
      <PureSwipeableRow
        extraData={info.item}
        isOpen={key === this.state.openRowKey}
        maxSwipeDistance={this._getMaxSwipeDistance(info)}
        onClose={() => this._onClose(key)}
        onOpen={() => this._onOpen(key)}
        onSwipeEnd={this._setListViewScrollable}
        onSwipeStart={this._setListViewNotScrollable}
        preventSwipeRight={this.props.preventSwipeRight}
        shouldBounceOnMount={shouldBounceOnMount}
        slideoutView={slideoutView}
      >
        {this.props.renderItem(info)}
      </PureSwipeableRow>
    );
  };

  // This enables rows having variable width slideoutView.
  _getMaxSwipeDistance(info: Object): number {
    if (typeof this.props.maxSwipeDistance === 'function') {
      return this.props.maxSwipeDistance(info);
    }

    return this.props.maxSwipeDistance;
  }

  _setListViewScrollableTo(value: boolean) {
    if (this._flatListRef) {
      this._flatListRef.setNativeProps({
        scrollEnabled: value,
      });
    }
  }

  _setListViewScrollable = () => {
    this._setListViewScrollableTo(true);
  };

  _setListViewNotScrollable = () => {
    this._setListViewScrollableTo(false);
  };

  _onOpen(key: any): void {
    this.setState(() => ({ openRowKey: key }));
  }

  _onClose(key: any): void {
    this.setState(() => ({ openRowKey: null }));
  }

  _onRefresh = async () => {
    if (!this.props.onRefresh) {
      return;
    }
    this.setState(() => ({ refreshing: true }));
    await this.props.onRefresh();
    this.setState(() => ({ refreshing: false }));
  };

  render() {
    return (
      <FlatList
        {...this.props}
        extraData={this.state}
        onEndReachedThreshold={Platform.OS === 'ios' ? 0 : 0.5}
        onRefresh={this.props.onRefresh ? this._onRefresh : null}
        onScroll={this._onScroll}
        ref={ref => {
          this._flatListRef = ref;
        }}
        refreshing={this.state.refreshing}
        removeClippedSubviews
        renderItem={this._renderItem}
      />
    );
  }
}

export default SwipeableFlatList;
