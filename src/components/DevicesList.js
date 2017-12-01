// @flow

import type { Device, QueryOptions } from 'brewskey.js-api';
import type { Navigation } from '../types';
import type { Row } from '../stores/DAOEntityListStore';

import * as React from 'react';
import nullthrows from 'nullthrows';
import InjectedComponent from '../common/InjectedComponent';
import { observer } from 'mobx-react';
import { withNavigation } from 'react-navigation';
import withComponentStores from '../common/withComponentStores';
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

type InjectedProps = {|
  listStore: DAOEntityListStore<Device>,
  navigation: Navigation,
|};

@withNavigation
@withComponentStores({ listStore: new DAOEntityListStore(DAOApi.DeviceDAO) })
@observer
class DevicesList extends InjectedComponent<InjectedProps, Props> {
  static defaultProps = {
    queryOptions: {},
  };

  _swipeableFlatListRef: ?SwipeableFlatList<Device>;

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

  _keyExtractor = (row: Row<Device>): number => row.key;

  _onDeleteItemPress = (item: Device): void =>
    DAOApi.DeviceDAO.deleteByID(item.id);

  _onEditItemPress = ({ id }: Device) => {
    this.injectedProps.navigation.navigate('editDevice', { id });
    nullthrows(this._swipeableFlatListRef).resetOpenRow();
  };

  _onItemPress = (item: Device): void =>
    this.injectedProps.navigation.navigate('deviceDetails', {
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

  _renderListItem = (item: Device): React.Node => (
    <ListItem
      hideChevron
      item={item}
      onPress={this._onItemPress}
      subtitle={item.particleId}
      title={item.name}
    />
  );

  _renderSlideoutView = (item: Device): React.Node => (
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

export default DevicesList;
