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
import SwipeableFlatList from '../common/SwipeableFlatList';
import QuickActions from '../common/QuickActions';
import DAOApi from 'brewskey.js-api';
import DAOEntityListStore from '../stores/DAOEntityListStore';
import LoadingListFooter from '../common/LoadingListFooter';
import ListItem from '../common/ListItem';
import SwipeableLoaderRow from '../common/SwipeableLoaderRow';

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

  _getSwipeableFlatListRef = ref => {
    this._swipeableFlatListRef = ref;
  };

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

  _renderRow = ({ info, ...swipeableStateProps }): React.Node => (
    <SwipeableLoaderRow
      {...swipeableStateProps}
      loader={info.item.value}
      maxSwipeDistance={150}
      preventSwipeRight
      renderListItem={this._renderListItem}
      renderSlideoutView={this._renderSlideoutView}
    />
  );

  _renderListItem = (item: Location): React.Node => (
    <ListItem
      hideChevron
      item={item}
      onPress={this._onItemPress}
      subtitle={item.summary || '-'}
      title={item.name}
    />
  );

  _renderSlideoutView = (item: Location): React.Node => (
    <QuickActions
      deleteModalMessage={`Are you sure you want to delete ${item.name}?`}
      item={item}
      onDeleteItemPress={this._onDeleteItemPress}
      onEditItemPress={this._onEditItemPress}
    />
  );

  render() {
    return (
      <SwipeableFlatList
        data={this._listStore.rows}
        keyExtractor={this._keyExtractor}
        onEndReached={this._listStore.fetchNextPage}
        onRefresh={this._listStore.reset}
        ref={this._getSwipeableFlatListRef}
        refreshing={false}
        removeClippedSubviews
        renderItem={this._renderRow}
        ListFooterComponent={
          <LoadingListFooter isLoading={!this._listStore.isInitialized} />
        }
        renderQuickActions={this._renderQuickActions}
      />
    );
  }
}

export default LocationsList;
