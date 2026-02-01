import { useCallback, useState } from 'react';

import {
  FlatList,
  RefreshControl,
  SectionList,
  StyleSheet,
} from 'react-native';

import { ON_END_REACHED_THRESHOLD } from '@/constants';

import type { InfiniteData } from '@tanstack/react-query';
import type { LegacyRef, ReactElement } from 'react';
import type {
  ListRenderItemInfo,
  NativeScrollEvent,
  NativeSyntheticEvent,
  SectionListData,
} from 'react-native';

const styles = StyleSheet.create({
  contentContainerStyle: {
    flexGrow: 1,
  },
});

export type ListComponentTypes =
  | React.ComponentType<Record<string, unknown>>
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
  onRefresh?: () => void | Promise<void>;
  onScroll?: (arg1: NativeSyntheticEvent<NativeScrollEvent>) => void;
  stickySectionHeadersEnabled?: boolean;
} & (
  | {
      innerRef?: LegacyRef<FlatList<TEntity>> | undefined;
      listType: 'flatList';
      data: InfiniteData<TEntity[]> | undefined;
    }
  | {
      innerRef?: LegacyRef<SectionList<TEntity>> | undefined;
      listType: 'sectionList';
      renderSectionHeader?: (info: {
        section: SectionListData<TEntity>;
      }) => ReactElement | null;
      renderSectionFooter?: (info: {
        section: SectionListData<TEntity>;
      }) => ReactElement | null;
      sections: readonly SectionListData<TEntity>[];
    }
);

type Props<TEntity> = ListProps<TEntity> & {
  renderItem?: (arg1: ListRenderItemInfo<TEntity>) => ReactElement;
  testID?: string;
};

const List = <TEntity,>(props: Props<TEntity>): ReactElement => {
  const {
    bounceFirstRowOnMount,
    innerRef: _innerRef,
    onRefresh,
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

  const [isRefreshing, setIsRefreshing] = useState(false);

  const onRefreshHandler = useCallback(async (): Promise<void> => {
    if (!onRefresh) {
      return;
    }
    setIsRefreshing(true);
    await onRefresh();
    setIsRefreshing(false);
  }, [onRefresh]);

  const renderFlatList = useCallback(
    (info: ListRenderItemInfo<TEntity>): ReactElement | null => {
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
        onRefresh={onRefresh ? onRefreshHandler : null}
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
      contentContainerStyle={styles.contentContainerStyle}
      data={flatData}
      onEndReachedThreshold={ON_END_REACHED_THRESHOLD}
      onScroll={onScroll}
      renderItem={renderFlatList}
      refreshControl={
        <RefreshControl refreshing={isRefreshing} onRefresh={onRefresh} />
      }
      testID={testID}

      // ref={innerRef}
    />
  );
};

export { List };
