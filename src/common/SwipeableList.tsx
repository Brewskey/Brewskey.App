import type { ListProps } from './List';

import * as React from 'react';
import List from './List';
import {
  ListRenderItemInfo,
  NativeScrollEvent,
  NativeSyntheticEvent,
} from 'react-native';

export type RenderProps<TEntity> = {
  info: ListRenderItemInfo<TEntity>;
  isOpen: boolean;
  onClose: () => void;
  onOpen: (rowKey: string) => void;
  onSwipeEnd?: () => void;
  onSwipeStart?: () => void;
  onDeleteItemPress?: (arg1: TEntity) => Promise<void>;
  preventSwipeRight?: boolean;
  rowKey: string;
  shouldBounceOnMount: boolean;
  swipeThreshold?: number;
};

type Props<TEntity> = ListProps<TEntity> & {
  renderItem: (arg1: RenderProps<TEntity>) => React.ReactElement;
};

type State = {
  openRowKey: string | null | undefined;
};

export class SwipeableList<TEntity> extends React.Component<
  Props<TEntity>,
  State
> {
  static defaultProps = {
    bounceFirstRowOnMount: true,
  };

  state: State = {
    openRowKey: null,
  };

  _innerListRef = React.createRef<{
    setNativeProps: (arg1: { scrollEnabled: boolean }) => void;
  }>();

  resetOpenRow: () => void = (): void =>
    this.setState(() => ({ openRowKey: null }));

  _setListViewScrollableTo = (value: boolean) => {
    if (!this._innerListRef.current) {
      return;
    }
    this._innerListRef.current.setNativeProps({
      scrollEnabled: value,
    });
  };

  _setListViewScrollable = (): void => this._setListViewScrollableTo(true);

  _setListViewNotScrollable = (): void => this._setListViewScrollableTo(false);

  _onOpen = (key: string): void => this.setState(() => ({ openRowKey: key }));

  _onClose = (): void => this.resetOpenRow();

  _onScroll = (event: NativeSyntheticEvent<NativeScrollEvent>): void => {
    this.resetOpenRow();
    const { onScroll } = this.props;
    if (onScroll) {
      onScroll(event);
    }
  };

  _renderItem: (arg1: ListRenderItemInfo<TEntity>) => React.ReactElement = (
    info,
  ) => {
    const key = this.props.keyExtractor(info.item, info.index);
    return this.props.renderItem({
      info,
      isOpen: key === this.state.openRowKey,
      onClose: this._onClose,
      onOpen: this._onOpen,
      onSwipeEnd: this._setListViewScrollable,
      onSwipeStart: this._setListViewNotScrollable,
      rowKey: key,
      shouldBounceOnMount:
        this.props.bounceFirstRowOnMount === true && info.index === 0,
    });
  };

  render(): React.ReactElement {
    const { renderItem: _, ...otherProps } = this.props;
    return (
      <List
        {...otherProps}
        extraData={this.state}
        // innerRef={this._innerListRef}
        onScroll={this._onScroll}
        renderItem={this._renderItem}
      />
    );
  }
}
