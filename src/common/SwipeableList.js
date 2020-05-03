// @flow

import type { Props as ListProps } from './List';
import type { FlatList, SectionList } from 'react-native';
import type { Section } from '../types';

import * as React from 'react';
import List from './List';
import VirtualizedList from 'react-native/Libraries/Lists/VirtualizedList';

type Props<TEntity> = {|
  ...ListProps<TEntity>,
  bounceFirstRowOnMount: boolean,
  preventSwipeRight?: boolean,
|};

type State = {|
  openRowKey: ?string,
|};

class SwipeableSectionList<TEntity> extends React.PureComponent<
  Props<TEntity>,
  State,
> {
  static defaultProps = {
    ...VirtualizedList.defaultProps,
    bounceFirstRowOnMount: true,
  };

  state = {
    openRowKey: null,
  };

  _innerListRef: ?FlatList<TEntity> | ?SectionList<Section<TEntity>> = null;

  resetOpenRow = (): void => this.setState(() => ({ openRowKey: null }));

  _setListViewScrollableTo(value: boolean) {
    if (!this._innerListRef) {
      return;
    }
    this._innerListRef.setNativeProps({
      scrollEnabled: value,
    });
  }

  _setListViewScrollable = (): void => this._setListViewScrollableTo(true);

  _setListViewNotScrollable = (): void => this._setListViewScrollableTo(false);

  _onOpen = (key: string): void => this.setState(() => ({ openRowKey: key }));

  _onClose = (): void => this.resetOpenRow();

  _onScroll = (event: SyntheticEvent<*>): void => {
    this.resetOpenRow();
    const { onScroll } = this.props;
    if (onScroll) {
      onScroll(event);
    }
  };

  _setInnerListRef = (ref) => {
    this._innerListRef = ref;
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
      <List
        {...this.props}
        extraData={this.state}
        innerRef={this._setInnerListRef}
        onScroll={this._onScroll}
        renderItem={this._renderItem}
      />
    );
  }
}

export default SwipeableSectionList;
