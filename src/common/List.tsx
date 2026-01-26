import * as React from 'react';

import {
  FlatList,
  FlatListProps,
  RefreshControl,
  SectionList,
  StyleSheet,
} from 'react-native';

import { ON_END_REACHED_THRESHOLD } from '../constants';

import type { InfiniteData } from '@tanstack/react-query';
import type {
  ListRenderItemInfo,
  NativeScrollEvent,
  NativeSyntheticEvent,
  SectionListData,
} from 'react-native';

import type { Section } from '../types';

const styles = StyleSheet.create({
  contentContainerStyle: {
    flexGrow: 1,
  },
});

export type ListComponentTypes =
  | React.ComponentType<any>
  | React.ReactElement
  | null
  | undefined;

export type ListProps<TEntity> = {
  ListEmptyComponent?: ListComponentTypes;
  ListFooterComponent?: ListComponentTypes;
  ListHeaderComponent?: ListComponentTypes;
  bounceFirstRowOnMount?: boolean;
  disableVirtualization?: boolean;
  extraData?: Record<string, unknown>;
  horizontal?: boolean;
  initialNumToRender?: number;
  keyExtractor: (arg1: TEntity, arg2: number) => string;
  maxToRenderPerBatch?: number;
  onEndReached?: () => void;
  onRefresh?: () => Promise<unknown> | unknown;
  onScroll?: (arg1: NativeSyntheticEvent<NativeScrollEvent>) => void;
  stickySectionHeadersEnabled?: boolean;
} & (
  | {
      innerRef?: React.LegacyRef<FlatList<TEntity>> | undefined;
      listType: 'flatList';
      data: InfiniteData<TEntity[]> | undefined;
    }
  | {
      innerRef?: React.LegacyRef<SectionList<TEntity>> | undefined;
      listType: 'sectionList';
      renderSectionHeader?: (info: {
        section: SectionListData<TEntity>;
      }) => React.ReactElement | null;
      renderSectionFooter?: (info: {
        section: SectionListData<TEntity>;
      }) => React.ReactElement | null;
      sections: readonly SectionListData<TEntity>[];
    }
);

type Props<TEntity> = ListProps<TEntity> & {
  renderItem?: (arg1: ListRenderItemInfo<TEntity>) => React.ReactElement;
  testID?: string;
};

function List<TEntity>(props: Props<TEntity>): React.ReactElement {
  const {
    bounceFirstRowOnMount,
    innerRef,
    onRefresh,
    renderItem: _,
    ListEmptyComponent,
    ListFooterComponent,
    ListHeaderComponent,
    testID,
    listType = 'flatList',
    renderItem,
    onScroll,
    ...rest
  } = props;

  // Extract conditional properties based on listType
  const renderSectionFooter =
    'renderSectionFooter' in props ? props.renderSectionFooter : undefined;
  const renderSectionHeader =
    'renderSectionHeader' in props ? props.renderSectionHeader : undefined;
  const sections = 'sections' in props ? props.sections : undefined;
  const data = 'data' in props ? props.data : undefined;

  const [isRefreshing, setIsRefreshing] = React.useState(false);

  const _onRefresh = React.useCallback(async (): Promise<void> => {
    if (!onRefresh) {
      return;
    }
    setIsRefreshing(true);
    await onRefresh();
    setIsRefreshing(false);
  }, [onRefresh]);

  const _renderFlatList = React.useCallback(
    (info: ListRenderItemInfo<TEntity>): React.ReactElement | null => {
      if (renderItem == null) {
        return null;
      }
      return renderItem(info);
    },
    [renderItem],
  );

  if (listType === 'sectionList' && sections) {
    return (
      <SectionList<TEntity>
        stickySectionHeadersEnabled
        contentContainerStyle={styles.contentContainerStyle}
        ListEmptyComponent={ListEmptyComponent}
        ListFooterComponent={ListFooterComponent}
        ListHeaderComponent={ListHeaderComponent}
        renderSectionFooter={renderSectionFooter}
        renderSectionHeader={renderSectionHeader}
        {...rest}
        // ref={innerRef}
        onEndReachedThreshold={ON_END_REACHED_THRESHOLD}
        onRefresh={onRefresh ? _onRefresh : null}
        refreshing={isRefreshing}
        renderItem={renderItem}
        sections={sections}
        testID={testID}
      />
    );
  }

  const flatData = data?.pages.flat() ?? [];
  return (
    <FlatList<TEntity>
      ListEmptyComponent={ListEmptyComponent}
      ListFooterComponent={ListFooterComponent}
      ListHeaderComponent={ListHeaderComponent}
      {...rest}
      bounces={bounceFirstRowOnMount}
      data={flatData}
      onScroll={onScroll}
      renderItem={_renderFlatList}
      testID={testID}
      refreshControl={
        <RefreshControl refreshing={isRefreshing} onRefresh={onRefresh} />
      }
      contentContainerStyle={styles.contentContainerStyle}
      //ref={innerRef}
      onEndReachedThreshold={ON_END_REACHED_THRESHOLD}
    />
  );
}

export default List;
