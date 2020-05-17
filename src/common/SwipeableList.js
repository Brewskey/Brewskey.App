// @flow

import type { ListProps } from './List';
import type { RenderItemProps } from 'react-native/Libraries/Lists/VirtualizedList';
import type { FlatList, SectionList } from 'react-native';
import type { Section } from '../types';
import type { SwipeableProps } from './SwipeableRow';
import type { ScrollEvent } from 'react-native/Libraries/Types/CoreEventTypes';

import * as React from 'react';
import List from './List';
import VirtualizedList from 'react-native/Libraries/Lists/VirtualizedList';

export type RenderProps<TEntity> = {|
  info: RenderItemProps<TEntity>,
  isOpen: boolean,
  onClose: () => void,
  onOpen: (rowKey: string) => void,
  onSwipeEnd?: () => void,
  onSwipeStart?: () => void,
  onDeleteItemPress?: (TEntity) => Promise<void>,
  preventSwipeRight?: boolean,
  rowKey: string,
  shouldBounceOnMount: boolean,
  swipeThreshold?: number,
|};

type Props<TEntity> = {|
  ...ListProps<TEntity>,
  renderItem: (RenderProps<TEntity>) => React.Node,
|};

type State = {|
  openRowKey: ?string,
|};

class SwipeableSectionList<TEntity> extends React.Component<
  Props<TEntity>,
  State,
> {
  static defaultProps = {
    bounceFirstRowOnMount: true,
  };

  state: State = {
    openRowKey: null,
  };

  _innerListRef = React.createRef<{|
    setNativeProps: ({| scrollEnabled: boolean |}) => void,
  |}>();

  resetOpenRow: () => void = (): void =>
    this.setState(() => ({ openRowKey: null }));

  _setListViewScrollableTo(value: boolean) {
    if (!this._innerListRef.current) {
      return;
    }
    this._innerListRef.current.setNativeProps({
      scrollEnabled: value,
    });
  }

  _setListViewScrollable = (): void => this._setListViewScrollableTo(true);

  _setListViewNotScrollable = (): void => this._setListViewScrollableTo(false);

  _onOpen = (key: string): void => this.setState(() => ({ openRowKey: key }));

  _onClose = (): void => this.resetOpenRow();

  _onScroll = (event: ScrollEvent): void => {
    this.resetOpenRow();
    const { onScroll } = this.props;
    if (onScroll) {
      onScroll(event);
    }
  };

  _renderItem(info: RenderItemProps<TEntity>): React.Node {
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
      shouldBounceOnMount:
        this.props.bounceFirstRowOnMount === true && info.index === 0,
    });
  }

  render(): React.Node {
    const { renderItem: _, ...otherProps } = this.props;
    return (
      <List
        {...otherProps}
        extraData={this.state}
        innerRef={this._innerListRef}
        onScroll={this._onScroll}
        renderItem={this._renderItem}
      />
    );
  }
}

export default SwipeableSectionList;
