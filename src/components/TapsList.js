// @flow

import type { QueryOptions, Tap } from 'brewskey.js-api';
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
import SwipeableList from '../common/SwipeableList';
import LoaderRow from '../common/LoaderRow';
import SwipeableRow from '../common/SwipeableRow';
import { TapStore } from '../stores/DAOStores';
import LoadingListFooter from '../common/LoadingListFooter';
import ListItem from '../common/ListItem';
import BeverageAvatar from '../common/avatars/BeverageAvatar';

type Props = {|
  ListHeaderComponent?: React.Node,
  queryOptions?: QueryOptions,
|};

type InjectedProps = {
  navigation: Navigation,
};

@withNavigation
@observer
class TapsList extends InjectedComponent<InjectedProps, Props> {
  static defaultProps = {
    queryOptions: {},
  };

  _listStore: DAOListStore<Tap> = new DAOListStore(TapStore);
  _swipeableListRef: ?SwipeableList<Tap>;

  componentWillMount() {
    this._listStore.setQueryOptions({
      orderBy: [
        {
          column: 'id',
          direction: 'asc',
        },
      ],
      ...this.props.queryOptions,
    });

    this._listStore.fetchFirstPage();
  }

  _getSwipeableListRef = ref => {
    this._swipeableListRef = ref;
  };

  _keyExtractor = (row: Row<Tap>): number => row.key;

  _onDeleteItemPress = (item: Tap): void => DAOApi.TapDAO.deleteByID(item.id);

  _onEditItemPress = ({ id }: Tap) => {
    this.injectedProps.navigation.navigate('editTap', { id });
    nullthrows(this._swipeableListRef).resetOpenRow();
  };

  _onItemPress = (item: Tap): void =>
    this.injectedProps.navigation.navigate('tapDetails', {
      id: item.id,
    });

  _renderRow = ({
    info: { item: row, index, separators },
    ...swipeableStateProps
  }): React.Node => (
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

const SwipeableRowItem = ({
  index,
  item,
  onItemPress,
}: RowItemProps<Tap, *>) => {
  const beverage = item.currentKeg ? item.currentKeg.beverage : null;
  const beverageName = beverage ? beverage.name : 'No Beer on Tap';

  return (
    <ListItem
      avatar={<BeverageAvatar beverageId={beverage ? beverage.id : ''} />}
      hideChevron
      item={item}
      onPress={onItemPress}
      title={`${index + 1} - ${beverageName}`}
    />
  );
};
const Slideout = ({
  item,
  onDeleteItemPress,
  onEditItemPress,
}: RowItemProps<Tap, *>) => (
  <QuickActions
    deleteModalMessage="Are you sure you want to delete the Tap?"
    item={item}
    onDeleteItemPress={onDeleteItemPress}
    onEditItemPress={onEditItemPress}
  />
);

export default TapsList;
