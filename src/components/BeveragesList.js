// @flow

import type { Beverage, QueryOptions } from 'brewskey.js-api';
import type DAOEntityStore from '../stores/DAOEntityStore';
import type { InfiniteLoaderChildProps } from './InfiniteLoader';

import * as React from 'react';
import { inject, observer } from 'mobx-react';
import { withNavigation } from 'react-navigation';
import SwipeableFlatList from '../common/SwipeableFlatList';
import ListItem from '../common/ListItem';
import QuickActions from '../common/QuickActions';
// imported from experimental react-native
// eslint-disable-next-line
import InfiniteLoader from './InfiniteLoader';

type Props = {|
  beverageStore: DAOEntityStore<Beverage, Beverage>,
  // todo add better typing
  navigation: Object,
  queryOptions: QueryOptions,
|};

// todo add pullToRefresh
@withNavigation
@inject('beverageStore')
@observer
class BeveragesList extends React.Component<Props> {
  static defaultProps = {
    queryOptions: {},
  };

  _swipeableFlatListRef: ?SwipeableFlatList;

  _fetchNextData = async (): Promise<void> => {
    await this.props.beverageStore.fetchMany({
      ...this.props.queryOptions,
      orderBy: [
        {
          column: 'id',
          direction: 'desc',
        },
      ],
      // todo add selector instead all
      skip: this.props.beverageStore.all.length,
      take: 20,
    });
  };

  _keyExtractor = (item: Beverage): string => item.id;

  _onDeleteItemPress = (item: Beverage): Promise<void> =>
    this.props.beverageStore.deleteByID(item.id);

  _onEditItemPress = (item: Beverage) => {
    this.props.navigation.navigate('editBeverage', { id: item.id });
    this._swipeableFlatListRef.resetOpenRow();
  };

  _onItemPress = (item: Beverage): void =>
    this.props.navigation.navigate('beverageDetails', {
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
            data={this.props.beverageStore.all}
            keyExtractor={this._keyExtractor}
            ListFooterComponent={loadingIndicator}
            maxSwipeDistance={150}
            onEndReached={onEndReached}
            onEndReachedThreshold={onEndReachedThreshold}
            preventSwipeRight
            ref={(ref: SwipeableFlatList) => {
              this._swipeableFlatListRef = ref;
            }}
            renderItem={this._renderItem}
            renderQuickActions={this._renderQuickActions}
          />
        )}
      </InfiniteLoader>
    );
  }
}

export default BeveragesList;
