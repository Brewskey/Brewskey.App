import type { Device, EntityID, QueryOptions } from '@brewskey/js-api';

import type { RowItemProps } from '../common/SwipeableRow';
import type { RenderProps } from '../common/SwipeableList';
import type { ListComponentTypes } from '../common/List';

import * as React from 'react';
import { StyleSheet, View } from 'react-native';
import nullthrows from 'nullthrows';
import { useRouter } from 'expo-router';
import { useMemo } from 'react';
import { useQueryClient } from '@tanstack/react-query';

import { SwipeableList, type SwipeableListRef } from '../common/SwipeableList';
import QuickActions from '../common/QuickActions';
import SwipeableRow from '../common/SwipeableRow';
import { useAddSnackBarMessage } from '../hooks/context/SnackBarContext';
import LoadingListFooter from '../common/LoadingListFooter';
import ListItem from '../common/ListItem';
import DeviceOnlineIndicator from './DeviceOnlineIndicator';
import { useGetDevices, useDeleteDevice } from '../hooks/queries/DeviceQueries';
import ListEmpty from '../common/ListEmpty';

const styles = StyleSheet.create({
  onlineIndicatorWrapper: {
    height: 45,
    justifyContent: 'center',
  },
});

type Props = {
  renderListHeader?: (arg1: {
    isEmpty: boolean;
    isLoading: boolean;
  }) => React.ReactElement;
  ListEmptyComponent?: ListComponentTypes;
  ListHeaderComponent?: ListComponentTypes;
  queryOptions?: QueryOptions;
};

const DevicesList: React.FC<Props> = ({
  renderListHeader,
  ListEmptyComponent = <ListEmpty message="No Brewskey boxes" />,
  ListHeaderComponent,
  queryOptions = {},
}) => {
  const router = useRouter();
  const queryClient = useQueryClient();
  const addSnackBarMessage = useAddSnackBarMessage();
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
    data: devicesData,
    isLoading,
    isFetchingNextPage,
    hasNextPage,
    fetchNextPage,
    refetch,
  } = useGetDevices(mergedQueryOptions);

  const devicesDataFormatted = useMemo(() => {
    if (!devicesData) return undefined;
    return devicesData;
  }, [devicesData]);

  const deleteDeviceMutation = useDeleteDevice();

  const onDeleteItemPress = async (item: Device): Promise<void> => {
    await deleteDeviceMutation.mutateAsync(item.id);
    addSnackBarMessage({ content: 'The Brewskey box was deleted' });
  };

  const onEditItemPress = ({ id }: Device) => {
    router.navigate({ pathname: '/(tabs)/devices/[id]/edit', params: { id: String(id) } });
    nullthrows(swipeableListRef.current).resetOpenRow();
  };

  const onItemPress = (item: Device): void => {
    router.navigate({ pathname: '/(tabs)/devices/[id]', params: { id: String(item.id) } });
  };

  const keyExtractor = (item: Device): string => item.id.toString();

  const SwipeableRowItem = ({
    item,
    onItemPress,
  }: RowItemProps<Device>): React.ReactElement => (
    <ListItem
      item={item}
      onPress={onItemPress}
      rightIcon={
        <View style={styles.onlineIndicatorWrapper}>
          <DeviceOnlineIndicator particleID={item.particleId} />
        </View>
      }
      title={item.name}
      testID={`device-item-${item.id}`}
    />
  );

  const Slideout = ({
    item,
    onDeleteItemPress,
    onEditItemPress,
  }: RowItemProps<Device>): React.ReactElement => (
    <QuickActions
      deleteModalMessage={`Are you sure you want to delete ${item.name}?`}
      deleteModalTitle="Delete Brewskey box"
      item={item}
      onDeleteItemPress={onDeleteItemPress}
      onEditItemPress={onEditItemPress}
    />
  );

  const renderRow = ({
    info: { item, index, separators },
    ...swipeableStateProps
  }: RenderProps<Device>): React.ReactElement => {
    // Since we already have the device from the list query, we can render directly
    // If individual device loading is needed, we can add useGetDeviceById here
    return (
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
  };

  const headerComponent = React.useMemo((): ListComponentTypes => {
    if (ListHeaderComponent) {
      // Ensure ListHeaderComponent is a valid ListComponentTypes
      if (typeof ListHeaderComponent === 'string' || typeof ListHeaderComponent === 'number' || typeof ListHeaderComponent === 'boolean') {
        return null;
      }
      return ListHeaderComponent as ListComponentTypes;
    }
    if (renderListHeader) {
      const rendered = renderListHeader({
        isEmpty: !devicesDataFormatted?.pages?.[0]?.length,
        isLoading,
      });
      // Ensure rendered is a valid ListComponentTypes
      if (typeof rendered === 'string' || typeof rendered === 'number' || typeof rendered === 'boolean') {
        return null;
      }
      return rendered as ListComponentTypes;
    }
    return null;
  }, [ListHeaderComponent, renderListHeader, devicesDataFormatted, isLoading]);

  return (
    <SwipeableList
      data={devicesDataFormatted}
      keyExtractor={keyExtractor}
      listType="flatList"
      ListEmptyComponent={!isLoading ? ListEmptyComponent : undefined}
      ListFooterComponent={<LoadingListFooter isLoading={isFetchingNextPage} />}
      ListHeaderComponent={headerComponent}
      onEndReached={() => {
        if (hasNextPage) {
          fetchNextPage();
        }
      }}
      onRefresh={async () => await refetch()}
      ref={swipeableListRef}
      renderItem={renderRow}
      testID="devices-list"
    />
  );
};

export default DevicesList;
