import * as React from 'react';

import List from './List';

import type { InfiniteData } from '@tanstack/react-query';
import type {
  ListRenderItemInfo,
  NativeScrollEvent,
  NativeSyntheticEvent,
} from 'react-native';

import type { ListProps } from './List';

export interface RenderProps<TEntity> {
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
}

type Props<TEntity> = ListProps<TEntity> & {
  listType?: 'flatList' | 'sectionList';
  renderItem: (arg1: RenderProps<TEntity>) => React.ReactElement;
  renderSectionHeader?: (info: {
    section: import('react-native').SectionListData<TEntity>;
  }) => React.ReactElement | null;
  sections?: readonly import('react-native').SectionListData<TEntity>[];
  data?: InfiniteData<TEntity[]> | undefined;
  testID?: string;
};

export interface SwipeableListRef {
  resetOpenRow: () => void;
}

export const SwipeableList = React.forwardRef<SwipeableListRef, Props<any>>(
  (
    props: Props<TEntity>,
    ref: React.Ref<SwipeableListRef>,
  ): React.ReactElement => {
    const {
      renderItem: _,
      listType = 'flatList',
      renderSectionHeader,
      sections,
      data,
      testID,
      bounceFirstRowOnMount = true,
      keyExtractor,
      renderItem,
      onScroll,
      ...otherProps
    } = props;

    const [openRowKey, setOpenRowKey] = React.useState<
      string | null | undefined
    >(null);

    const _innerListRef = React.useRef<{
      setNativeProps: (arg1: { scrollEnabled: boolean }) => void;
    }>(null);

    const resetOpenRow = React.useCallback((): void => {
      setOpenRowKey(null);
    }, []);

    React.useImperativeHandle(
      ref,
      () => ({
        resetOpenRow,
      }),
      [resetOpenRow],
    );

    const _setListViewScrollableTo = React.useCallback((value: boolean) => {
      if (!_innerListRef.current) {
        return;
      }
      _innerListRef.current.setNativeProps({
        scrollEnabled: value,
      });
    }, []);

    const _setListViewScrollable = React.useCallback((): void => {
      _setListViewScrollableTo(true);
    }, [_setListViewScrollableTo]);

    const _setListViewNotScrollable = React.useCallback((): void => {
      _setListViewScrollableTo(false);
    }, [_setListViewScrollableTo]);

    const _onOpen = React.useCallback((key: string): void => {
      setOpenRowKey(key);
    }, []);

    const _onClose = React.useCallback((): void => {
      resetOpenRow();
    }, [resetOpenRow]);

    const _onScroll = React.useCallback(
      (event: NativeSyntheticEvent<NativeScrollEvent>): void => {
        resetOpenRow();
        if (onScroll) {
          onScroll(event);
        }
      },
      [resetOpenRow, onScroll],
    );

    const _renderItem = React.useCallback(
      (info: ListRenderItemInfo<TEntity>): React.ReactElement => {
        const key = keyExtractor(info.item, info.index);
        return renderItem({
          info,
          isOpen: key === openRowKey,
          onClose: _onClose,
          onOpen: _onOpen,
          onSwipeEnd: _setListViewScrollable,
          onSwipeStart: _setListViewNotScrollable,
          rowKey: key,
          shouldBounceOnMount: bounceFirstRowOnMount && info.index === 0,
        });
      },
      [
        keyExtractor,
        renderItem,
        openRowKey,
        _onClose,
        _onOpen,
        _setListViewScrollable,
        _setListViewNotScrollable,
        bounceFirstRowOnMount,
      ],
    );

    if (listType === 'sectionList' && sections) {
      return (
        <List
          {...otherProps}
          extraData={{ openRowKey }}
          innerRef={undefined}
          keyExtractor={keyExtractor}
          listType="sectionList"
          onScroll={_onScroll}
          renderItem={_renderItem}
          renderSectionHeader={renderSectionHeader}
          sections={sections}
          testID={testID}
        />
      );
    }
    return (
      <List
        {...otherProps}
        data={data}
        extraData={{ openRowKey }}
        innerRef={undefined}
        keyExtractor={keyExtractor}
        listType="flatList"
        onScroll={_onScroll}
        renderItem={_renderItem}
        testID={testID}
      />
    );
  },
) as <TEntity>(
  props: Props<TEntity> & { ref?: React.Ref<SwipeableListRef> },
) => React.ReactElement;
