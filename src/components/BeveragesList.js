// @flow

import type { Beverage, QueryOptions } from 'brewskey.js-api';
import type { Navigation } from '../types';
import type { Row } from '../stores/DAOListStore';
import type { RowItemProps } from '../common/SwipeableRow';

import * as React from 'react';
import nullthrows from 'nullthrows';
import InjectedComponent from '../common/InjectedComponent';
import { observer } from 'mobx-react/native';
import { withNavigation } from 'react-navigation';
import BeverageAvatar from '../common/avatars/BeverageAvatar';
import QuickActions from '../common/QuickActions';
import DAOApi from 'brewskey.js-api';
import DAOListStore from '../stores/DAOListStore';
import SwipeableList from '../common/SwipeableList';
import LoaderRow from '../common/LoaderRow';
import SwipeableRow from '../common/SwipeableRow';
import { BeverageStore } from '../stores/DAOStores';
import ListEmptyComponent from '../common/ListEmptyComponent';
import LoadingListFooter from '../common/LoadingListFooter';
import ListItem from '../common/ListItem';

type Props = {|
  ListHeaderComponent?: ?(React.ComponentType<any> | React.Element<any>),
  queryOptions?: QueryOptions,
|};

type InjectedProps = {
  navigation: Navigation,
};

@withNavigation
@observer
class BeveragesList extends InjectedComponent<InjectedProps, Props> {
  static defaultProps = {
    queryOptions: {},
  };

  _listStore: DAOListStore<Beverage> = new DAOListStore(BeverageStore);
  _swipeableListRef: ?SwipeableList<Beverage>;

  componentDidMount() {
    this._listStore.initialize({
      orderBy: [
        {
          column: 'id',
          direction: 'desc',
        },
      ],
      ...this.props.queryOptions,
    });
  }

  _getSwipeableListRef = ref => {
    this._swipeableListRef = ref;
  };

  _keyExtractor = (row: Row<Beverage>): string => row.key;

  _onDeleteItemPress = (item: Beverage): void =>
    DAOApi.BeverageDAO.deleteByID(item.id);

  _onEditItemPress = ({ id }: Beverage) => {
    this.injectedProps.navigation.navigate('editBeverage', { id });
    nullthrows(this._swipeableListRef).resetOpenRow();
  };

  _onItemPress = (item: Beverage): void =>
    this.injectedProps.navigation.navigate('beverageDetails', {
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
    const isLoading = this._listStore.isFetchingRemoteCount;
    return (
      <SwipeableList
        data={this._listStore.rows}
        keyExtractor={this._keyExtractor}
        ListEmptyComponent={
          !isLoading ? <ListEmptyComponent message="No beverages" /> : null
        }
        ListFooterComponent={<LoadingListFooter isLoading={isLoading} />}
        ListHeaderComponent={this.props.ListHeaderComponent}
        onEndReached={this._listStore.fetchNextPage}
        onRefresh={this._listStore.reload}
        ref={this._getSwipeableListRef}
        renderItem={this._renderRow}
      />
    );
  }
}

const SwipeableRowItem = ({ item, onItemPress }: RowItemProps<Beverage, *>) => (
  <ListItem
    avatar={<BeverageAvatar beverageId={item.id} />}
    hideChevron
    item={item}
    onPress={onItemPress}
    subtitle={item.beverageType}
    title={item.name}
  />
);

const Slideout = ({
  item,
  onDeleteItemPress,
  onEditItemPress,
}: RowItemProps<Beverage, *>) => (
  <QuickActions
    deleteModalMessage={`Are you sure you want to delete ${item.name}?`}
    deleteModalTitle="Delete beverage"
    item={item}
    onDeleteItemPress={onDeleteItemPress}
    onEditItemPress={onEditItemPress}
  />
);

export default BeveragesList;
