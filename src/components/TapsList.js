// @flow

import type { QueryOptions, Tap } from 'brewskey.js-api';
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
import withComponentStores from '../common/withComponentStores';
import ListItem from '../common/ListItem';
import SwipeableLoaderRow from '../common/SwipeableLoaderRow';
import { NULL_STRING_PLACEHOLDER } from '../constants';

type Props = {|
  queryOptions?: QueryOptions,
|};

type InjectedProps = {
  listStore: DAOEntityListStore<Tap>,
  navigation: Navigation,
};

@withNavigation
@withComponentStores({ listStore: new DAOEntityListStore(DAOApi.TapDAO) })
@observer
class TapsList extends InjectedComponent<InjectedProps, Props> {
  static defaultProps = {
    queryOptions: {},
  };

  _swipeableFlatListRef: ?SwipeableFlatList<Tap>;

  componentWillMount() {
    const { listStore } = this.injectedProps;
    listStore.setQueryOptions({
      orderBy: [
        {
          column: 'id',
          direction: 'desc',
        },
      ],
      ...this.props.queryOptions,
    });

    listStore.fetchFirstPage();
  }

  _getSwipeableFlatListRef = ref => {
    this._swipeableFlatListRef = ref;
  };

  _keyExtractor = (row: Row<Tap>): number => row.key;

  _onDeleteItemPress = (item: Tap): void => DAOApi.TapDAO.deleteByID(item.id);

  _onEditItemPress = ({ id }: Tap) => {
    this.injectedProps.navigation.navigate('editTap', { id });
    nullthrows(this._swipeableFlatListRef).resetOpenRow();
  };

  _onItemPress = (item: Tap): void =>
    this.injectedProps.navigation.navigate('tapDetails', {
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

  _renderListItem = (item: Tap): React.Node => (
    <ListItem
      hideChevron
      item={item}
      onPress={this._onItemPress}
      subtitle={item.description || NULL_STRING_PLACEHOLDER}
      title={item.name}
    />
  );

  _renderSlideoutView = (item: Tap): React.Node => (
    <QuickActions
      deleteModalMessage={`Are you sure you want to delete ${item.name}?`}
      item={item}
      onDeleteItemPress={this._onDeleteItemPress}
      onEditItemPress={this._onEditItemPress}
    />
  );

  render() {
    const { listStore } = this.injectedProps;
    return (
      <SwipeableFlatList
        data={listStore.rows}
        keyExtractor={this._keyExtractor}
        onEndReached={listStore.fetchNextPage}
        onRefresh={listStore.reload}
        ref={this._getSwipeableFlatListRef}
        refreshing={false}
        removeClippedSubviews
        renderItem={this._renderRow}
        ListFooterComponent={
          <LoadingListFooter isLoading={!listStore.isFetchingRemoteCount} />
        }
      />
    );
  }
}

export default TapsList;
