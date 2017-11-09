// @flow

import type { QueryOptions, Tap, TapMutator } from 'brewskey.js-api';
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
import InfiniteLoader from '../common/InfiniteLoader';

type Props = {|
  queryOptions?: QueryOptions,
|};

type InjectedProps = {|
  tapStore: DAOEntityStore<Tap, TapMutator>,
  navigation: Navigation,
|};

@withNavigation
@inject('tapStore')
@observer
class TapsList extends InjectedComponent<InjectedProps, Props> {
  static defaultProps = {
    queryOptions: {},
  };

  _swipeableFlatListRef: ?SwipeableFlatList<Tap>;

  _getBaseQueryOptions = (): QueryOptions => ({
    ...this.props.queryOptions,
    orderBy: [
      {
        column: 'id',
        direction: 'desc',
      },
    ],
  });

  get _items(): Array<Tap> {
    return this.injectedProps.tapStore.getByQueryOptions(
      this._getBaseQueryOptions(),
    );
  }

  _fetchNextData = (): Promise<*> =>
    this.injectedProps.tapStore.fetchMany({
      ...this.props.queryOptions,
      skip: this._items.length,
      take: 20,
    });

  _keyExtractor = (item: Tap): string => item.id;

  _onDeleteItemPress = (item: Tap): Promise<void> =>
    this.injectedProps.tapStore.deleteByID(item.id);

  _onEditItemPress = (item: Tap) => {
    this.injectedProps.navigation.navigate('editTap', { id: item.id });
    nullthrows(this._swipeableFlatListRef).resetOpenRow();
  };

  _onItemPress = (item: Tap): void =>
    this.injectedProps.navigation.navigate('tapDetails', {
      id: item.id,
    });

  _onRefresh = (): Promise<*> =>
    this.injectedProps.tapStore.fetchMany({
      ...this._getBaseQueryOptions(),
      skip: 0,
      take: 20,
    });

  _renderItem = ({ item }: { item: Tap }): React.Node => (
    <ListItem
      hideChevron
      item={item}
      onPress={this._onItemPress}
      subtitle={item.description || '-'}
      title={item.name}
    />
  );

  _renderQuickActions = ({ item }: { item: Tap }): React.Node => (
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

export default TapsList;
