import type { ListProps } from './List';

import * as React from 'react';
import List from './List';
import {
  ListRenderItemInfo,
  NativeScrollEvent,
  NativeSyntheticEvent,
} from 'react-native';
import { InfiniteData } from '@tanstack/react-query';

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
  listType?: 'flatList' | 'sectionList';
  renderItem: (arg1: RenderProps<TEntity>) => React.ReactElement;
  renderSectionHeader?: (info: {
    section: import('react-native').SectionListData<TEntity>;
  }) => React.ReactElement | null;
  sections?: readonly import('react-native').SectionListData<TEntity>[];
  data?: InfiniteData<TEntity[]> | undefined;
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
    const { renderItem: _, listType = 'flatList', renderSectionHeader, sections, data, ...otherProps } = this.props;
    if (listType === 'sectionList' && sections) {
      return (
        <List
          {...otherProps}
          extraData={{ openRowKey: this.state.openRowKey }}
          listType="sectionList"
          renderSectionHeader={renderSectionHeader}
          sections={sections}
          onScroll={this._onScroll}
          renderItem={this._renderItem}
          innerRef={undefined}
        />
      );
    }
    return (
      <List
        {...otherProps}
        data={data}
        extraData={{ openRowKey: this.state.openRowKey }}
        listType="flatList"
        onScroll={this._onScroll}
        renderItem={this._renderItem}
        innerRef={undefined}
      />
    );
  }
}
