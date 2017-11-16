// @flow

import type { QueryOptions, Location } from 'brewskey.js-api';
import type { Navigation } from '../types';
import type DAOEntityStore from '../stores/DAOEntityStore';
import type { Row } from '../stores/DAOEntityListStore';

import * as React from 'react';
import nullthrows from 'nullthrows';
import InjectedComponent from '../common/InjectedComponent';
import { inject, observer } from 'mobx-react';
import { withNavigation } from 'react-navigation';
import { NULL_STRING_PLACEHOLDER } from '../constants';
import SwipeableFlatList from '../common/SwipeableFlatList';
import ListItem from '../common/ListItem';
import QuickActions from '../common/QuickActions';
import DAOApi from 'brewskey.js-api';
import DAOEntityListStore from '../stores/DAOEntityListStore';
import LoadingListItem from '../common/LoadingListItem';
import LoadingListFooter from '../common/LoadingListFooter';
import ErrorListItem from '../common/ErrorListItem';

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

  _swipeableFlatListRef: ?SwipeableFlatList<Location>;
  _listStore: DAOEntityListStore<Location>;

  constructor(props: Props, context: any) {
    super(props, context);

    this._listStore = new DAOEntityListStore(DAOApi.LocationDAO, {
      orderBy: [
        {
          column: 'id',
          direction: 'desc',
        },
      ],
      ...this.props.queryOptions,
    });
  }

  _keyExtractor = (row: Row<Location>): number => row.key;

  _onDeleteItemPress = (item: Location): Promise<void> =>
    DAOApi.LocationDAO.deleteByID(item.id);

  _onEditItemPress = ({ id }: Location) => {
    this.injectedProps.navigation.navigate('editLocation', { id });
    nullthrows(this._swipeableFlatListRef).resetOpenRow();
  };

  _onItemPress = (item: Location): void =>
    this.injectedProps.navigation.navigate('locationDetails', {
      id: item.id,
    });

  _renderItem = ({ item }: { item: Row<Location> }): React.Node => {
    if (item.value.isLoading()) {
      return <LoadingListItem />;
    }

    if (item.value.hasError()) {
      return <ErrorListItem />;
    }

    const location = item.value.getValue();

    return (
      <ListItem
        hideChevron
        item={location}
        onPress={this._onItemPress}
        subtitle={location.summary || NULL_STRING_PLACEHOLDER}
        title={location.name}
      />
    );
  };

  _renderQuickActions = ({ item }: { item: Row<Location> }): React.Node => (
    <QuickActions
      deleteModalMessage={`Are you sure you want to delete ${item.value.name}?`}
      item={item.value}
      onDeleteItemPress={this._onDeleteItemPress}
      onEditItemPress={this._onEditItemPress}
    />
  );

  render() {
    return (
      <SwipeableFlatList
        data={this._listStore.rows}
        keyExtractor={this._keyExtractor}
        maxSwipeDistance={150}
        onEndReached={this._listStore.fetchNextPage}
        refreshing={false}
        onRefresh={this._listStore.reset}
        preventSwipeRight
        ref={ref => (this._swipeableFlatListRef = ref)}
        renderItem={this._renderItem}
        ListFooterComponent={
          <LoadingListFooter isLoading={!this._listStore.isInitialized} />
        }
        renderQuickActions={this._renderQuickActions}
      />
    );
  }
}

export default LocationsList;
