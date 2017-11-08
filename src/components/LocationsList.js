// @flow

import type { QueryOptions, Location } from 'brewskey.js-api';
import type { Navigation } from '../types';
import type DAOEntityStore from '../stores/DAOEntityStore';
import type { InfiniteLoaderChildProps } from '../common/InfiniteLoader';

import * as React from 'react';
import nullthrows from 'nullthrows';
import InjectedComponent from '../common/InjectedComponent';
import { inject, observer } from 'mobx-react';
import { withNavigation } from 'react-navigation';
import SwipeableFlatList from '../common/SwipeableFlatList';
import ListItem from '../common/ListItem';
import QuickActions from '../common/QuickActions';
import InfiniteLoader from '../common/InfiniteLoader';

type Props = {|
  queryOptions?: QueryOptions,
|};

type InjectedProps = {
  locationStore: DAOEntityStore<Location, Location>,
  navigation: Navigation,
};

@withNavigation
@inject('locationStore')
@observer
class LocationsList extends InjectedComponent<InjectedProps, Props> {
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

  get _items(): Array<Location> {
    return this.injectedProps.locationStore.getByQueryOptions(
      this._getBaseQueryOptions(),
    );
  }

  _swipeableFlatListRef: ?SwipeableFlatList<Location>;

  _fetchNextData = (): Promise<*> =>
    this.injectedProps.locationStore.fetchMany({
      ...this._getBaseQueryOptions(),
      skip: this._items.length,
      take: 20,
    });

  _keyExtractor = (item: Location): string => item.id;

  _onDeleteItemPress = (item: Location): Promise<void> =>
    this.injectedProps.locationStore.deleteByID(item.id);

  _onEditItemPress = (item: Location) => {
    this.injectedProps.navigation.navigate('editLocation', { id: item.id });
    nullthrows(this._swipeableFlatListRef).resetOpenRow();
  };

  _onItemPress = (item: Location): void =>
    this.injectedProps.navigation.navigate('locationDetails', {
      id: item.id,
    });

  _onRefresh = (): Promise<*> =>
    this.injectedProps.locationStore.fetchMany({
      ...this._getBaseQueryOptions(),
      skip: 0,
      take: 20,
    });

  _renderItem = ({ item }: { item: Location }): React.Node => (
    <ListItem
      hideChevron
      item={item}
      onPress={this._onItemPress}
      subtitle={item.summary || '-'}
      title={item.name}
    />
  );

  _renderQuickActions = ({ item }: { item: Location }): React.Node => (
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

export default LocationsList;
