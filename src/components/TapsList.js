// @flow

import type { Tap, TapMutator } from 'brewskey.js-api';
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

type InjectedProps = {|
  tapStore: DAOEntityStore<Tap, TapMutator>,
  navigation: Navigation,
|};

@withNavigation
@inject('tapStore')
@observer
class TapsList extends InjectedComponent<InjectedProps> {
  _swipeableFlatListRef: ?SwipeableFlatList<Tap>;

  _fetchNextData = async (): Promise<void> => {
    await this.injectedProps.tapStore.fetchMany({
      orderBy: [
        {
          column: 'id',
          direction: 'desc',
        },
      ],
      skip: this.injectedProps.tapStore.all.length,
      take: 20,
    });
  };

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
      item={item}
      onDeleteItemPress={this._onDeleteItemPress}
      onEditItemPress={this._onEditItemPress}
    />
  );

  render(): React.Node {
    return (
      <InfiniteLoader fetchNextData={this._fetchNextData}>
        {({
          loadingIndicator,
          onEndReached,
          onEndReachedThreshold,
        }: InfiniteLoaderChildProps): React.Node => (
          <SwipeableFlatList
            data={this.injectedProps.tapStore.all}
            keyExtractor={this._keyExtractor}
            ListFooterComponent={loadingIndicator}
            maxSwipeDistance={150}
            onEndReached={onEndReached}
            onEndReachedThreshold={onEndReachedThreshold}
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
