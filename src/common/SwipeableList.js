// @flow

import type { Props as ListProps } from './List';
import type { FlatList, SectionList } from 'react-native';
import type { Section } from '../types';
import type { SwipeableProps } from './SwipeableRow';

import * as React from 'react';
import List from './List';
import VirtualizedList from 'react-native/Libraries/Lists/VirtualizedList';

type InfoType<TEntity> = {| item: TEntity, index: number |};

type Props<TEntity, TOtherProps> = {|
  ...ListProps<TEntity, TOtherProps>,
  keyExtractor: (TEntity, number) => string,
  bounceFirstRowOnMount: boolean,
  onScroll?: (SyntheticEvent<>) => void,
  preventSwipeRight?: boolean,
  renderItem: ({| item: InfoType<TEntity>, ...SwipeableProps |}) => React.Node,
|};

type State = {|
  openRowKey: ?string,
|};

class SwipeableSectionList<TEntity, TOtherProps> extends React.PureComponent<
  Props<TEntity, TOtherProps>,
  State,
> {
  static defaultProps: {
    ...typeof VirtualizedList.defaultProps,
    bounceFirstRowOnMount: boolean,
  } = {
    ...VirtualizedList.defaultProps,
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

  _onScroll = (event: SyntheticEvent<>): void => {
    this.resetOpenRow();
    const { onScroll } = this.props;
    if (onScroll) {
      onScroll(event);
    }
  };

  _renderItem = (info: InfoType): React.Node => {
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

  render(): React.Node {
    return (
      <List
        {...this.props}
        extraData={this.state}
        innerRef={this._innerListRef}
        onScroll={this._onScroll}
        renderItem={this._renderItem}
      />
    );
  }
}

export default SwipeableSectionList;
