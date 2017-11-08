// @flow

import type { Beverage, QueryOptions } from 'brewskey.js-api';
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

type InjectedProps = {|
  beverageStore: DAOEntityStore<Beverage, Beverage>,
  navigation: Navigation,
|};

@withNavigation
@inject('beverageStore')
@observer
class BeveragesList extends InjectedComponent<InjectedProps, Props> {
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

  get _items(): Array<Beverage> {
    return this.injectedProps.beverageStore.getByQueryOptions(
      this._getBaseQueryOptions(),
    );
  }

  _swipeableFlatListRef: ?SwipeableFlatList<Beverage>;

  _fetchNextData = (): Promise<*> =>
    this.injectedProps.beverageStore.fetchMany({
      ...this._getBaseQueryOptions(),
      skip: this._items.length,
      take: 20,
    });

  _keyExtractor = (item: Beverage): string => item.id;

  _onDeleteItemPress = (item: Beverage): Promise<void> =>
    this.injectedProps.beverageStore.deleteByID(item.id);

  _onEditItemPress = (item: Beverage) => {
    this.injectedProps.navigation.navigate('editBeverage', { id: item.id });
    nullthrows(this._swipeableFlatListRef).resetOpenRow();
  };

  _onItemPress = (item: Beverage): void =>
    this.injectedProps.navigation.navigate('beverageDetails', {
      id: item.id,
    });

  _renderItem = ({ item }: { item: Beverage }): React.Node => (
    <ListItem
      hideChevron
      item={item}
      onPress={this._onItemPress}
      subtitle={item.summary || '-'}
      title={item.name}
    />
  );

  _renderQuickActions = ({ item }: { item: Beverage }): React.Node => (
    <QuickActions
      deleteModalMessage={`Are you sure you want to delete ${item.name}?`}
      item={item}
      onDeleteItemPress={this._onDeleteItemPress}
      onEditItemPress={this._onEditItemPress}
    />
  );

  _onRefresh = (): Promise<Array<Beverage>> =>
    this.injectedProps.beverageStore.fetchMany({
      ...this._getBaseQueryOptions(),
      skip: 0,
      take: 20,
    });

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

export default BeveragesList;
