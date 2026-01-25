import type { QueryOptions, Tap } from '@brewskey/js-api';

import type { RowItemProps } from '../common/SwipeableRow';
import type { RenderProps } from '../common/SwipeableList';

import * as React from 'react';
import { useMemo } from 'react';
import nullthrows from 'nullthrows';
import { useRouter } from 'expo-router';

import { TapDAO } from '@brewskey/js-api';
import LoadingListFooter from '../common/LoadingListFooter';
import QuickActions from '../common/QuickActions';
import { SwipeableList, type SwipeableListRef } from '../common/SwipeableList';
import SwipeableRow from '../common/SwipeableRow';
import TapListItem from './TapListItem';
import DeviceTapListEmpty from './DeviceTapListEmpty';
import { useGetTaps, useDeleteTap } from '../hooks/queries/TapQueries';
import { useQueryClient } from '@tanstack/react-query';

type Props = {
  ListHeaderComponent?: React.ReactNode;
  onAddTapPress: () => void;
  onRefresh?: () => void;
  queryOptions?: QueryOptions;
};

const TapsList: React.FC<Props> = ({
  ListHeaderComponent,
  onAddTapPress,
  onRefresh,
  queryOptions = {},
}) => {
  const router = useRouter();
  const queryClient = useQueryClient();
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

  const onDeleteItemPress = async (item: Tap): Promise<void> => {
    await deleteTapMutation.mutateAsync(item.id);
  };

  const onEditItemPress = ({ id }: Tap) => {
    router.navigate({ pathname: '/(tabs)/taps/[tapId]/edit/feed', params: { tapId: String(id) } });
    nullthrows(swipeableListRef.current).resetOpenRow();
  };

  const onItemPress = (item: Tap): void => {
    router.navigate({ pathname: '/(tabs)/taps/[tapId]/on_tap', params: { tapId: String(item.id) } });
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
      onDeleteItemPress={onDeleteItemPress}
      onEditItemPress={onEditItemPress}
      onItemPress={onItemPress}
      rowItemComponent={SwipeableRowItem}
      separators={separators}
      slideoutComponent={Slideout}
      {...swipeableStateProps}
    />
  );

  return (
    <SwipeableList
      data={tapsData}
      keyExtractor={keyExtractor}
      listType="flatList"
      ListEmptyComponent={!isLoading ? <DeviceTapListEmpty onAddTapPress={onAddTapPress} /> : undefined}
      ListFooterComponent={<LoadingListFooter isLoading={isFetchingNextPage} />}
       
      ListHeaderComponent={ListHeaderComponent as React.ComponentType<any> | React.ReactElement | null | undefined}
      onEndReached={() => {
        if (hasNextPage) {
          fetchNextPage();
        }
      }}
      onRefresh={onRefreshList}
      ref={swipeableListRef}
      renderItem={renderRow}
      testID="taps-list"
    />
  );
};

export default TapsList;
