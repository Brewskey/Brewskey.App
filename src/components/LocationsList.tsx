import type { QueryOptions, Location } from '@brewskey/js-api';

import type { RowItemProps } from '../common/SwipeableRow';
import type { RenderProps } from '../common/SwipeableList';
import type { ListComponentTypes } from '../common/List';

import * as React from 'react';
import { useMemo } from 'react';
import nullthrows from 'nullthrows';
import { useNavigation, NavigationProp } from '@react-navigation/native';

import ListEmpty from '../common/ListEmpty';
import ListItem from '../common/ListItem';
import LoadingListFooter from '../common/LoadingListFooter';
import QuickActions from '../common/QuickActions';
import { SwipeableList } from '../common/SwipeableList';
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
  const navigation = useNavigation<NavigationProp<ReactNavigation.RootParamList>>();
  const swipeableListRef = React.useRef<SwipeableList<Location>>(null);
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
    navigation.navigate('LoggedInStack', {
      screen: 'menu',
      params: {
        screen: 'locations',
        params: {
          screen: 'editLocation',
          params: { id },
        },
      },
    });
    nullthrows(swipeableListRef.current).resetOpenRow();
  };

  const onItemPress = (item: Location): void => {
    navigation.navigate('LoggedInStack', {
      screen: 'menu',
      params: {
        screen: 'locations',
        params: {
          screen: 'locationDetails',
          params: {
            id: item.id,
          },
        },
      },
    });
  };

  const onRefreshList = () => {
    refetch();
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
      data={locationsData}
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
  );
};

export default LocationsList;
