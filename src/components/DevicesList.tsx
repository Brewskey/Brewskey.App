import * as React from 'react';
import { useMemo } from 'react';

import { useRouter } from 'expo-router';
import nullthrows from 'nullthrows';
import { StyleSheet, View } from 'react-native';

import { ListEmpty } from 'common/ListEmpty';
import { ListItem } from 'common/ListItem';
import { LoadingListFooter } from 'common/LoadingListFooter';
import { QuickActions } from 'common/QuickActions';
import { SwipeableList } from 'common/SwipeableList';
import { SwipeableRow } from 'common/SwipeableRow';
import { DeviceOnlineIndicator } from 'components/DeviceOnlineIndicator';
import { useAddSnackBarMessage } from 'hooks/context/SnackBarContext';
import { useDeleteDevice, useGetDevices } from 'hooks/queries/DeviceQueries';

import type { Device, QueryOptions } from '@brewskey/js-api';

import type { ListComponentTypes } from 'common/List';
import type { RenderProps, SwipeableListRef } from 'common/SwipeableList';
import type { RowItemProps } from 'common/SwipeableRow';

const styles = StyleSheet.create({
  onlineIndicatorWrapper: {
    height: 45,
    justifyContent: 'center',
  },
});

interface Props {
  renderListHeader?: (arg1: {
    isEmpty: boolean;
    isLoading: boolean;
  }) => React.ReactElement;
  ListEmptyComponent?: ListComponentTypes;
  ListHeaderComponent?: ListComponentTypes;
  queryOptions?: QueryOptions;
}

const DevicesList: React.FC<Props> = ({
  renderListHeader,
  ListEmptyComponent = <ListEmpty message="No Brewskey boxes" />,
  ListHeaderComponent,
  queryOptions = {},
}) => {
  const router = useRouter();
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

  const handleDeleteItemPress = async (item: Device): Promise<void> => {
    await deleteDeviceMutation.mutateAsync(item.id);
    addSnackBarMessage({ content: 'The Brewskey box was deleted' });
  };

  const handleEditItemPress = ({ id }: Device) => {
    router.navigate({
      pathname: '/devices/[id]/edit',
      params: { id: String(id) },
    });
    nullthrows(swipeableListRef.current).resetOpenRow();
  };

  const handleItemPress = (item: Device): void => {
    router.navigate({
      pathname: '/devices/[id]',
      params: { id: String(item.id) },
    });
  };

  const keyExtractor = (item: Device): string => item.id.toString();

  const SwipeableRowItem = ({
    item,
    onItemPress,
  }: RowItemProps<Device>): React.ReactElement => (
    <ListItem
      item={item}
      onPress={onItemPress}
      testID={`device-item-${item.id}`}
      title={item.name}
      rightIcon={
        <View style={styles.onlineIndicatorWrapper}>
          <DeviceOnlineIndicator particleID={item.particleId} />
        </View>
      }
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
  }: RenderProps<Device>): React.ReactElement => (
    // Since we already have the device from the list query, we can render directly
    // If individual device loading is needed, we can add useGetDeviceById here
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
  const headerComponent = React.useMemo((): ListComponentTypes => {
    if (ListHeaderComponent) {
      // Ensure ListHeaderComponent is a valid ListComponentTypes
      if (
        typeof ListHeaderComponent === 'string' ||
        typeof ListHeaderComponent === 'number' ||
        typeof ListHeaderComponent === 'boolean'
      ) {
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
      if (
        typeof rendered === 'string' ||
        typeof rendered === 'number' ||
        typeof rendered === 'boolean'
      ) {
        return null;
      }
      return rendered as ListComponentTypes;
    }
    return null;
  }, [ListHeaderComponent, renderListHeader, devicesDataFormatted, isLoading]);

  return (
    <SwipeableList
      ref={swipeableListRef}
      data={devicesDataFormatted}
      keyExtractor={keyExtractor}
      ListEmptyComponent={!isLoading ? ListEmptyComponent : undefined}
      ListFooterComponent={<LoadingListFooter isLoading={isFetchingNextPage} />}
      ListHeaderComponent={headerComponent}
      listType="flatList"
      onRefresh={() => {
        void refetch();
      }}
      renderItem={renderRow}
      testID="devices-list"
      onEndReached={() => {
        if (hasNextPage) {
          fetchNextPage();
        }
      }}
    />
  );
};

export { DevicesList };
