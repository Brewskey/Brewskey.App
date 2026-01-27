import * as React from 'react';
import { useMemo } from 'react';

import { useRouter } from 'expo-router';
import nullthrows from 'nullthrows';

import { DeviceTapListEmpty } from './DeviceTapListEmpty';
import { TapListItem } from './TapListItem';
import { LoadingListFooter } from '../common/LoadingListFooter';
import { QuickActions } from '../common/QuickActions';
import { SwipeableList } from '../common/SwipeableList';
import { SwipeableRow } from '../common/SwipeableRow';
import { useDeleteTap, useGetTaps } from '../hooks/queries/TapQueries';

import type { QueryOptions, Tap } from '@brewskey/js-api';

import type { RenderProps, SwipeableListRef } from '../common/SwipeableList';
import type { RowItemProps } from '../common/SwipeableRow';

interface Props {
  ListHeaderComponent?: React.ReactNode;
  onAddTapPress: () => void;
  onRefresh?: () => void;
  queryOptions?: QueryOptions;
}

const TapsList: React.FC<Props> = ({
  ListHeaderComponent,
  onAddTapPress,
  onRefresh,
  queryOptions = {},
}) => {
  const router = useRouter();
  const swipeableListRef = React.useRef<SwipeableListRef>(null);

  const mergedQueryOptions = useMemo(
    () => ({
      orderBy: [
        {
          column: 'id',
          direction: 'desc' as const,
        },
      ],
      ...queryOptions,
    }),
    [queryOptions],
  );

  const {
    data: tapsData,
    isLoading,
    isFetchingNextPage,
    hasNextPage,
    fetchNextPage,
    refetch,
  } = useGetTaps(mergedQueryOptions);

  const deleteTapMutation = useDeleteTap();

  const handleDeleteItemPress = async (item: Tap): Promise<void> => {
    await deleteTapMutation.mutateAsync(item.id);
  };

  const handleEditItemPress = ({ id }: Tap) => {
    router.navigate({
      pathname: '/(tabs)/taps/[tapId]/edit/feed',
      params: { tapId: String(id) },
    });
    nullthrows(swipeableListRef.current).resetOpenRow();
  };

  const handleItemPress = (item: Tap): void => {
    router.navigate({
      pathname: '/(tabs)/taps/[tapId]/on_tap',
      params: { tapId: String(item.id) },
    });
  };

  const onRefreshList = async () => {
    await refetch();
    onRefresh?.();
  };

  const keyExtractor = (item: Tap): string => item.id.toString();

  const SwipeableRowItem = ({
    index,
    item,
    onItemPress,
  }: RowItemProps<Tap>): React.ReactElement => (
    <TapListItem index={index} onPress={onItemPress} tap={item} />
  );

  const Slideout = ({
    item,
    onDeleteItemPress,
    onEditItemPress,
  }: RowItemProps<Tap>): React.ReactElement => (
    <QuickActions
      deleteModalMessage="Are you sure you want to delete the Tap?"
      deleteModalTitle="Delete tap"
      item={item}
      onDeleteItemPress={onDeleteItemPress}
      onEditItemPress={onEditItemPress}
    />
  );

  const renderRow = ({
    info: { item, index, separators },
    ...swipeableStateProps
  }: RenderProps<Tap>): React.ReactElement => (
    <SwipeableRow
      index={index}
      item={item}
      maxSwipeDistance={150}
      onDeleteItemPress={handleDeleteItemPress}
      onEditItemPress={handleEditItemPress}
      onItemPress={handleItemPress}
      rowItemComponent={SwipeableRowItem}
      separators={separators}
      slideoutComponent={Slideout}
      {...swipeableStateProps}
    />
  );

  return (
    <SwipeableList
      ref={swipeableListRef}
      data={tapsData}
      keyExtractor={keyExtractor}
      ListFooterComponent={<LoadingListFooter isLoading={isFetchingNextPage} />}
      listType="flatList"
      onRefresh={onRefreshList}
      renderItem={renderRow}
      testID="taps-list"
      ListEmptyComponent={
        !isLoading ? (
          <DeviceTapListEmpty onAddTapPress={onAddTapPress} />
        ) : undefined
      }
      ListHeaderComponent={
        ListHeaderComponent as
          | React.ComponentType<any>
          | React.ReactElement
          | null
          | undefined
      }
      onEndReached={() => {
        if (hasNextPage) {
          fetchNextPage();
        }
      }}
    />
  );
};

export { TapsList };
