// @flow

import type { Location } from 'brewskey.js-api';
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
  locationStore: DAOEntityStore<Location, Location>,
  // todo add better typing
  navigation: Object,
|};

// todo add pullToRefresh
@withNavigation
@inject('locationStore')
@observer
class LocationsList extends React.Component<Props> {
  _swipeableFlatListRef: ?SwipeableFlatList;

  _fetchNextData = async (): Promise<void> => {
    await this.props.locationStore.fetchMany({
      orderBy: [
        {
          column: 'id',
          direction: 'desc',
        },
      ],
      skip: this.props.locationStore.all.length,
      take: 20,
    });
  };

  _keyExtractor = (item: Location): string => item.id;

  _onDeleteItemPress = (item: Location): Promise<void> =>
    this.props.locationStore.deleteByID(item.id);

  _onEditItemPress = (item: Location) => {
    this.props.navigation.navigate('editLocation', { id: item.id });
    this._swipeableFlatListRef.resetOpenRow();
  };

  _onItemPress = (item: Location): void =>
    this.props.navigation.navigate('locationDetails', {
      id: item.id,
    });

  _renderItem = ({ item }: { item: Location }): React.Element<*> => (
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
            data={this.props.locationStore.all}
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

export default LocationsList;
