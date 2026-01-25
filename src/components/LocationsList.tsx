import type { QueryOptions, Location } from '@brewskey/js-api';

import type { RowItemProps } from '../common/SwipeableRow';
import type { RenderProps } from '../common/SwipeableList';
import type { ListComponentTypes } from '../common/List';

import * as React from 'react';
import { View } from 'react-native';
import { useMemo } from 'react';
import nullthrows from 'nullthrows';
import { useRouter } from 'expo-router';

import ListEmpty from '../common/ListEmpty';
import ListItem from '../common/ListItem';
import LoadingListFooter from '../common/LoadingListFooter';
import QuickActions from '../common/QuickActions';
import { SwipeableList, type SwipeableListRef } from '../common/SwipeableList';
import SwipeableRow from '../common/SwipeableRow';
import { NULL_STRING_PLACEHOLDER } from '../constants';
import { useGetLocations, useDeleteLocation } from '../hooks/queries/LocationQueries';
import { useAddSnackBarMessage } from '../hooks/context/SnackBarContext';

type Props = {
  ListEmptyComponent?: ListComponentTypes;
  ListHeaderComponent?: ListComponentTypes;
  queryOptions?: QueryOptions;
};

const LocationsList: React.FC<Props> = ({
  ListEmptyComponent = <ListEmpty message="No locations" />,
  ListHeaderComponent,
  queryOptions = {},
}) => {
  const router = useRouter();
  const swipeableListRef = React.useRef<SwipeableListRef>(null);
  const addSnackBarMessage = useAddSnackBarMessage();

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
    data: locationsData,
    isLoading,
    isFetchingNextPage,
    hasNextPage,
    fetchNextPage,
    refetch,
  } = useGetLocations(mergedQueryOptions);

  const locations = useMemo(() => {
    if (!locationsData?.pages) return [];
    return locationsData.pages.flatMap((page) => page);
  }, [locationsData]);

  const deleteLocationMutation = useDeleteLocation();

  const onDeleteItemPress = async (item: Location): Promise<void> => {
    await deleteLocationMutation.mutateAsync(item.id);
    addSnackBarMessage({ content: 'The location was deleted' });
  };

  const onEditItemPress = ({ id }: Location) => {
    router.navigate({ pathname: '/(tabs)/locations/[id]/edit', params: { id: String(id) } });
    nullthrows(swipeableListRef.current).resetOpenRow();
  };

  const onItemPress = (item: Location): void => {
    router.navigate({ pathname: '/(tabs)/locations/[id]', params: { id: String(item.id) } });
  };

  const onRefreshList = async () => {
    await refetch();
  };

  const keyExtractor = (item: Location): string => item.id.toString();

  const SwipeableRowItem = ({
    item,
    onItemPress,
  }: RowItemProps<Location>): React.ReactElement => (
    <ListItem
      chevron={false}
      item={item}
      onPress={onItemPress}
      subtitle={item.description || NULL_STRING_PLACEHOLDER}
      title={item.name}
      testID={`location-item-${item.id}`}
    />
  );

  const Slideout = ({
    item,
    onDeleteItemPress,
    onEditItemPress,
  }: RowItemProps<Location>): React.ReactElement => (
    <QuickActions
      deleteModalMessage={`Are you sure you want to delete ${item.name}?`}
      deleteModalTitle="Delete location"
      item={item}
      onDeleteItemPress={onDeleteItemPress}
      onEditItemPress={onEditItemPress}
    />
  );

  const renderRow = ({
    info: { item, index, separators },
    ...swipeableStateProps
  }: RenderProps<Location>): React.ReactElement => (
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

  // Flatten the InfiniteData pages into a single array for SwipeableList
  const flatData = useMemo(() => {
    if (!locationsData?.pages) return undefined;
    return locationsData;
  }, [locationsData]);

  return (
    <View testID="locations-list" style={{ flex: 1 }}>
      <SwipeableList
        data={flatData}
        keyExtractor={keyExtractor}
        listType="flatList"
        ListEmptyComponent={!isLoading ? ListEmptyComponent : undefined}
        ListFooterComponent={<LoadingListFooter isLoading={isFetchingNextPage} />}
        ListHeaderComponent={ListHeaderComponent as ListComponentTypes}
        onEndReached={() => {
          if (hasNextPage) {
            fetchNextPage();
          }
        }}
        onRefresh={onRefreshList}
        ref={swipeableListRef}
        renderItem={renderRow}
      />
    </View>
  );
};

export default LocationsList;
