// @flow

import type { QueryOptions, Location } from 'brewskey.js-api';
import type { Navigation } from '../types';
import type { Row } from '../stores/DAOListStore';
import type { RowItemProps } from '../common/SwipeableRow';

import * as React from 'react';
import nullthrows from 'nullthrows';
import InjectedComponent from '../common/InjectedComponent';
import { observer } from 'mobx-react';
import { withNavigation } from 'react-navigation';
import QuickActions from '../common/QuickActions';
import DAOApi from 'brewskey.js-api';
import DAOListStore from '../stores/DAOListStore';
import { LocationStore } from '../stores/DAOStores';
import LoadingListFooter from '../common/LoadingListFooter';
import SwipeableList from '../common/SwipeableList';
import LoaderRow from '../common/LoaderRow';
import SwipeableRow from '../common/SwipeableRow';
import ListItem from '../common/ListItem';
import { NULL_STRING_PLACEHOLDER } from '../constants';

type Props = {|
  ListHeaderComponent?: ?(React.ComponentType<any> | React.Element<any>),
  queryOptions?: QueryOptions,
|};

type InjectedProps = {|
  navigation: Navigation,
|};

@withNavigation
@observer
class LocationsList extends InjectedComponent<InjectedProps, Props> {
  static defaultProps = {
    queryOptions: {},
  };

  _listStore: DAOListStore<Location> = new DAOListStore(LocationStore);
  _swipeableListRef: ?SwipeableList<Location>;

  componentWillMount() {
    this._listStore.setQueryOptions({
      orderBy: [
        {
          column: 'id',
          direction: 'desc',
        },
      ],
      ...this.props.queryOptions,
    });

    this._listStore.fetchFirstPage();
  }

  _getSwipeableListRef = ref => {
    this._swipeableListRef = ref;
  };

  _keyExtractor = (row: Row<Location>): string => row.key;

  _onDeleteItemPress = (item: Location): void =>
    DAOApi.LocationDAO.deleteByID(item.id);

  _onEditItemPress = ({ id }: Location) => {
    this.injectedProps.navigation.navigate('editLocation', { id });
    nullthrows(this._swipeableListRef).resetOpenRow();
  };

  _onItemPress = (item: Location): void =>
    this.injectedProps.navigation.navigate('locationDetails', {
      id: item.id,
    });

  _renderRow = ({
    info: { item: row, index, separators },
    ...swipeableStateProps
  }): React.Element<any> => (
    <LoaderRow
      index={index}
      loadedRow={SwipeableRow}
      loader={row.loader}
      onDeleteItemPress={this._onDeleteItemPress}
      onEditItemPress={this._onEditItemPress}
      onItemPress={this._onItemPress}
      rowItemComponent={SwipeableRowItem}
      separators={separators}
      slideoutComponent={Slideout}
      {...swipeableStateProps}
    />
  );

  render() {
    return (
      <SwipeableList
        data={this._listStore.rows}
        keyExtractor={this._keyExtractor}
        ListFooterComponent={
          <LoadingListFooter
            isLoading={this._listStore.isFetchingRemoteCount}
          />
        }
        ListHeaderComponent={this.props.ListHeaderComponent}
        onEndReached={this._listStore.fetchNextPage}
        onRefresh={this._listStore.reload}
        ref={this._getSwipeableListRef}
        renderItem={this._renderRow}
      />
    );
  }
}

const SwipeableRowItem = ({ item, onItemPress }: RowItemProps<Location, *>) => (
  <ListItem
    hideChevron
    item={item}
    onPress={onItemPress}
    subtitle={item.summary || NULL_STRING_PLACEHOLDER}
    title={item.name}
  />
);

const Slideout = ({
  item,
  onDeleteItemPress,
  onEditItemPress,
}: RowItemProps<Location, *>) => (
  <QuickActions
    deleteModalMessage={`Are you sure you want to delete ${item.name}?`}
    item={item}
    onDeleteItemPress={onDeleteItemPress}
    onEditItemPress={onEditItemPress}
  />
);

export default LocationsList;
