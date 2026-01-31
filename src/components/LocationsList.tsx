import * as React from 'react';
import { useMemo } from 'react';

import { useRouter } from 'expo-router';
import nullthrows from 'nullthrows';
import { View } from 'react-native';

import { ListEmpty } from 'common/ListEmpty';
import { ListItem } from 'common/ListItem';
import { LoadingListFooter } from 'common/LoadingListFooter';
import { QuickActions } from 'common/QuickActions';
import { SwipeableList } from 'common/SwipeableList';
import { SwipeableRow } from 'common/SwipeableRow';
import { NULL_STRING_PLACEHOLDER } from '@/constants';
import { useAddSnackBarMessage } from 'hooks/context/SnackBarContext';
import {
  useDeleteLocation,
  useGetLocations,
} from 'hooks/queries/LocationQueries';

import type { Location, QueryOptions } from '@brewskey/js-api';

import type { ListComponentTypes } from 'common/List';
import type { RenderProps, SwipeableListRef } from 'common/SwipeableList';
import type { RowItemProps } from 'common/SwipeableRow';

interface Props {
  ListEmptyComponent?: ListComponentTypes;
  ListHeaderComponent?: ListComponentTypes;
  queryOptions?: QueryOptions;
}

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

  const deleteLocationMutation = useDeleteLocation();

  const handleDeleteItemPress = async (item: Location): Promise<void> => {
    await deleteLocationMutation.mutateAsync(item.id);
    addSnackBarMessage({ content: 'The location was deleted' });
  };

  const handleEditItemPress = ({ id }: Location) => {
    router.navigate({
      pathname: '/(tabs)/locations/[id]/edit',
      params: { id: String(id) },
    });
    nullthrows(swipeableListRef.current).resetOpenRow();
  };

  const handleItemPress = (item: Location): void => {
    router.navigate({
      pathname: '/(tabs)/locations/[id]',
      params: { id: String(item.id) },
    });
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
      testID={`location-item-${item.id}`}
      title={item.name}
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
      onDeleteItemPress={handleDeleteItemPress}
      onEditItemPress={handleEditItemPress}
      onItemPress={handleItemPress}
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
    <View style={{ flex: 1 }} testID="locations-list">
      <SwipeableList
        ref={swipeableListRef}
        data={flatData}
        keyExtractor={keyExtractor}
        ListEmptyComponent={!isLoading ? ListEmptyComponent : undefined}
        ListHeaderComponent={ListHeaderComponent}
        listType="flatList"
        onRefresh={onRefreshList}
        renderItem={renderRow}
        ListFooterComponent={
          <LoadingListFooter isLoading={isFetchingNextPage} />
        }
        onEndReached={() => {
          if (hasNextPage) {
            fetchNextPage();
          }
        }}
      />
    </View>
  );
};

export { LocationsList };
