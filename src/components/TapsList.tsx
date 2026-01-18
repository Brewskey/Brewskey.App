import type { QueryOptions, Tap } from '@brewskey/js-api';

import type { RowItemProps } from '../common/SwipeableRow';
import type { RenderProps } from '../common/SwipeableList';

import * as React from 'react';
import { useMemo } from 'react';
import nullthrows from 'nullthrows';
import { useNavigation, NavigationProp } from '@react-navigation/native';

import { TapDAO } from '@brewskey/js-api';
import LoadingListFooter from '../common/LoadingListFooter';
import QuickActions from '../common/QuickActions';
import { SwipeableList } from '../common/SwipeableList';
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
  const navigation = useNavigation<NavigationProp<ReactNavigation.RootParamList>>();
  const queryClient = useQueryClient();
  const swipeableListRef = React.useRef<SwipeableList<Tap>>(null);

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
    navigation.navigate('LoggedInStack', {
      screen: 'home',
      params: {
        screen: 'editTap',
        params: { tapId: id },
      },
    });
    nullthrows(swipeableListRef.current).resetOpenRow();
  };

  const onItemPress = (item: Tap): void => {
    navigation.navigate('LoggedInStack', {
      screen: 'home',
      params: {
        screen: 'tapDetails',
        params: {
          tapId: item.id,
        },
      },
    });
  };

  const onRefreshList = () => {
    refetch();
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
    />
  );
};

export default TapsList;
