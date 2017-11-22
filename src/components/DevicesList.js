// @flow

import type { Device, DeviceMutator, QueryOptions } from 'brewskey.js-api';
import type { Navigation } from '../types';
import type DAOEntityStore from '../stores/DAOEntityStore';
import type { InfiniteLoaderChildProps } from '../common/InfiniteLoader';

import * as React from 'react';
import InjectedComponent from '../common/InjectedComponent';
import nullthrows from 'nullthrows';
import { inject, observer } from 'mobx-react';
import { withNavigation } from 'react-navigation';
import SwipeableFlatList from '../common/SwipeableFlatList';
import ListItem from '../common/ListItem';
import QuickActions from '../common/QuickActions';
// imported from experimental react-native
// eslint-disable-next-line
import InfiniteLoader from '../common/InfiniteLoader';

type Props = {|
  queryOptions?: QueryOptions,
|};

type InjectedProps = {
  deviceStore: DAOEntityStore<Device, DeviceMutator>,
  navigation: Navigation,
};

@withNavigation
@inject('deviceStore')
@observer
class DevicesList extends InjectedComponent<InjectedProps, Props> {
  static defaultProps = {
    queryOptions: {},
  };

  _getBaseQueryOptions = (): QueryOptions => ({
    ...this.props.queryOptions,
    orderBy: [
      {
        column: 'id',
        direction: 'desc',
      },
    ],
  });

  get _items(): Array<Device> {
    return this.injectedProps.deviceStore.getByQueryOptions(
      this._getBaseQueryOptions(),
    );
  }

  _swipeableFlatListRef: ?SwipeableFlatList<Device>;

  _fetchNextData = (): Promise<*> =>
    this.injectedProps.deviceStore.fetchMany({
      ...this._getBaseQueryOptions(),
      skip: this._items.length,
      take: 20,
    });

  _keyExtractor = (item: Device): string => item.id.toString();

  _onDeleteItemPress = (item: Device): Promise<void> =>
    this.injectedProps.deviceStore.deleteByID(item.id);

  _onEditItemPress = (item: Device) => {
    this.injectedProps.navigation.navigate('editDevice', { id: item.id });
    nullthrows(this._swipeableFlatListRef).resetOpenRow();
  };

  _onItemPress = (item: Device): void =>
    this.injectedProps.navigation.navigate('deviceDetails', {
      id: item.id,
    });

  _onRefresh = (): Promise<*> =>
    this.injectedProps.deviceStore.fetchMany({
      ...this._getBaseQueryOptions(),
      skip: 0,
      take: 20,
    });

  _renderItem = ({ item }: { item: Device }): React.Node => (
    <ListItem
      hideChevron
      item={item}
      onPress={this._onItemPress}
      subtitle={item.particleId}
      title={item.name}
    />
  );

  _renderQuickActions = ({ item }: { item: Device }): React.Node => (
    <QuickActions
      deleteModalMessage={`Are you sure you want to delete ${item.name}?`}
      item={item}
      onDeleteItemPress={this._onDeleteItemPress}
      onEditItemPress={this._onEditItemPress}
    />
  );

  render() {
    return (
      <InfiniteLoader fetchNextData={this._fetchNextData}>
        {({
          loadingIndicator,
          onEndReached,
          onEndReachedThreshold,
        }: InfiniteLoaderChildProps) => (
          <SwipeableFlatList
            data={this._items}
            keyExtractor={this._keyExtractor}
            ListFooterComponent={loadingIndicator}
            maxSwipeDistance={150}
            onEndReached={onEndReached}
            onEndReachedThreshold={onEndReachedThreshold}
            onRefresh={this._onRefresh}
            preventSwipeRight
            ref={ref => (this._swipeableFlatListRef = ref)}
            renderItem={this._renderItem}
            renderQuickActions={this._renderQuickActions}
          />
        )}
      </InfiniteLoader>
    );
  }
}

export default DevicesList;
