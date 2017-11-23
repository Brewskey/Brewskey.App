// @flow

import type { Beverage, QueryOptions } from 'brewskey.js-api';
import type { Navigation } from '../types';
import type { Row } from '../stores/DAOEntityListStore';

import * as React from 'react';
import nullthrows from 'nullthrows';
import InjectedComponent from '../common/InjectedComponent';
import { observer } from 'mobx-react';
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
  navigation: Navigation,
};

@withNavigation
@observer
class BeveragesList extends InjectedComponent<InjectedProps, Props> {
  static defaultProps = {
    queryOptions: {},
  };

  _swipeableFlatListRef: ?SwipeableFlatList<Beverage>;
  _listStore: DAOEntityListStore<Beverage>;

  constructor(props: Props, context: any) {
    super(props, context);

    this._listStore = new DAOEntityListStore(DAOApi.BeverageDAO, {
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

  _keyExtractor = (row: Row<Beverage>): number => row.key;

  _onDeleteItemPress = (item: Beverage): void =>
    DAOApi.BeverageDAO.deleteByID(item.id);

  _onEditItemPress = ({ id }: Beverage) => {
    this.injectedProps.navigation.navigate('editBeverage', { id });
    nullthrows(this._swipeableFlatListRef).resetOpenRow();
  };

  _onItemPress = (item: Beverage): void =>
    this.injectedProps.navigation.navigate('beverageDetails', {
      id: item.id,
    });

  _renderRow = ({
    info: { item: row },
    ...swipeableStateProps
  }): React.Node => (
    <SwipeableLoaderRow
      {...swipeableStateProps}
      loader={row.loader}
      renderListItem={this._renderListItem}
      renderSlideoutView={this._renderSlideoutView}
    />
  );

  _renderListItem = (item: Beverage): React.Node => (
    <ListItem
      hideChevron
      item={item}
      onPress={this._onItemPress}
      subtitle={item.beverageType}
      title={item.name}
    />
  );

  _renderSlideoutView = (item: Beverage): React.Node => (
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
      />
    );
  }
}

export default BeveragesList;
