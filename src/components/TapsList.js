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
import { TapStore } from '../stores/DAOStores';
import DAOApi from 'brewskey.js-api';
import DAOListStore from '../stores/DAOListStore';
import LoaderRow from '../common/LoaderRow';
import ListEmptyComponent from '../common/ListEmptyComponent';
import LoadingListFooter from '../common/LoadingListFooter';
import QuickActions from '../common/QuickActions';
import SwipeableList from '../common/SwipeableList';
import SwipeableRow from '../common/SwipeableRow';
import TapListItem from './TapListItem';

type Props = {|
  ListHeaderComponent?: ?(React.ComponentType<any> | React.Element<any>),
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

  _keyExtractor = (row: Row<Tap>): string => row.key;

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
          !isLoading ? <ListEmptyComponent message="No taps" /> : null
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

const SwipeableRowItem = ({
  index,
  item,
  onItemPress,
}: RowItemProps<Tap, *>) => (
  <TapListItem index={index} onPress={onItemPress} tap={item} />
);

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
