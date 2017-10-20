// @flow

import type { Tap, TapMutator } from 'brewskey.js-api';
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
import SwipeableQuickActions from 'SwipeableQuickActions';
import InfiniteLoader from './InfiniteLoader';

type Props = {|
  tapStore: DAOEntityStore<Tap, TapMutator>,
  // todo add better typing
  navigation: Object,
|};

// todo add pullToRefresh
@withNavigation
@inject('tapStore')
@observer
class TapsList extends React.Component<Props> {
  _swipeableFlatListRef: ?SwipeableFlatList;

  _fetchNextData = async (): Promise<void> => {
    await this.props.tapStore.fetchMany({
      orderBy: [
        {
          column: 'id',
          direction: 'desc',
        },
      ],
      skip: this.props.tapStore.all.length,
      take: 20,
    });
  };

  _keyExtractor = (item: Tap): string => item.id;

  _onDeleteItemPress = (item: Tap): Promise<void> =>
    this.props.tapStore.deleteByID(item.id);

  _onEditItemPress = (item: Tap) => {
    this.props.navigation.navigate('editTap', { id: item.id });
    this._swipeableFlatListRef.resetOpenRow();
  };

  _onItemPress = (item: Tap): void =>
    this.props.navigation.navigate('tapDetails', {
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

  _renderQuickActions = ({ item }: { item: Location }): React.Node => (
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
            data={this.props.tapStore.all}
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

export default TapsList;
