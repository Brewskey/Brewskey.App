// @flow

import type { Beverage, QueryOptions } from 'brewskey.js-api';
import type { Navigation } from '../types';
import type { Row } from '../stores/DAOListStore';
import type { RowItemProps } from '../common/SwipeableRow';
import type { RenderProps } from '../common/SwipeableList';

import * as React from 'react';
import nullthrows from 'nullthrows';
import InjectedComponent from '../common/InjectedComponent';
import { observer } from 'mobx-react';
import { withNavigation } from 'react-navigation';
import BeverageAvatar from '../common/avatars/BeverageAvatar';
import QuickActions from '../common/QuickActions';
import DAOApi from 'brewskey.js-api';
import DAOListStore from '../stores/DAOListStore';
import SwipeableList from '../common/SwipeableList';
import LoaderRow from '../common/LoaderRow';
import SwipeableRow from '../common/SwipeableRow';
import SnackBarStore from '../stores/SnackBarStore';
import { BeverageStore } from '../stores/DAOStores';
import ListEmpty from '../common/ListEmpty';
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
  static defaultProps: {| queryOptions: QueryOptions |} = {
    queryOptions: {},
  };

  _listStore: DAOListStore<Beverage> = new DAOListStore(BeverageStore);
  _swipeableListRef = React.createRef<SwipeableList<Row<Beverage>>>();

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

  _keyExtractor = (row: Row<Beverage>): string => row.key;

  _onDeleteItemPress = async (item: Beverage): Promise<void> => {
    const clientID = DAOApi.BeverageDAO.deleteByID(item.id);
    await DAOApi.BeverageDAO.waitForLoadedNullable((dao) =>
      dao.fetchByID(clientID),
    );
    SnackBarStore.showMessage({ text: 'The beverage was deleted' });
  };

  _onEditItemPress = ({ id }: Beverage) => {
    this.injectedProps.navigation.navigate('editBeverage', { id });
    nullthrows(this._swipeableListRef.current).resetOpenRow();
  };

  _onItemPress = (item: Beverage): void =>
    this.injectedProps.navigation.navigate('beverageDetails', {
      id: item.id,
    });

  _renderRow = ({
    info: { item: row, index, separators },
    ...swipeableStateProps
  }: RenderProps<Row<Beverage>>): React.Node => (
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

  render(): React.Node {
    const isLoading = this._listStore.isFetchingRemoteCount;
    return (
      <SwipeableList
        data={this._listStore.rows}
        keyExtractor={this._keyExtractor}
        ListEmptyComponent={
          !isLoading ? <ListEmpty message="No beverages" /> : null
        }
        ListFooterComponent={<LoadingListFooter isLoading={isLoading} />}
        ListHeaderComponent={this.props.ListHeaderComponent}
        onEndReached={this._listStore.fetchNextPage}
        onRefresh={this._listStore.reload}
        ref={this._swipeableListRef}
        renderItem={this._renderRow}
      />
    );
  }
}

const SwipeableRowItem = ({
  item,
  onItemPress,
}: RowItemProps<Beverage>): React.Node => (
  <ListItem
    leftAvatar={<BeverageAvatar beverageId={item.id} />}
    chevron={false}
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
}: RowItemProps<Beverage>): React.Node => (
  <QuickActions
    deleteModalMessage={`Are you sure you want to delete ${item.name}?`}
    deleteModalTitle="Delete beverage"
    item={item}
    onDeleteItemPress={onDeleteItemPress}
    onEditItemPress={onEditItemPress}
  />
);

export default BeveragesList;
