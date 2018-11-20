// @flow

import type { Device, QueryOptions } from 'brewskey.js-api';
import type { Navigation } from '../types';
import type { Row } from '../stores/DAOListStore';
import type { RowItemProps } from '../common/SwipeableRow';

import * as React from 'react';
import { StyleSheet, View } from 'react-native';
import nullthrows from 'nullthrows';
import InjectedComponent from '../common/InjectedComponent';
import { observer } from 'mobx-react/native';
import { withNavigation } from 'react-navigation';
import SwipeableList from '../common/SwipeableList';
import QuickActions from '../common/QuickActions';
import DAOApi from 'brewskey.js-api';
import DAOListStore from '../stores/DAOListStore';
import LoaderRow from '../common/LoaderRow';
import ListEmpty from '../common/ListEmpty';
import SwipeableRow from '../common/SwipeableRow';
import SnackBarStore from '../stores/SnackBarStore';
import { DeviceStore, waitForLoaded } from '../stores/DAOStores';
import LoadingListFooter from '../common/LoadingListFooter';
import ListItem from '../common/ListItem';
import DeviceOnlineIndicator from './DeviceOnlineIndicator';

const styles = StyleSheet.create({
  onlineIndicatorWrapper: {
    height: 45,
    justifyContent: 'center',
  },
});

type Props = {|
  renderListHeader?: ({
    isEmpty: boolean,
    isLoading: boolean,
  }) => ?React.Element<any>,
  ListEmptyComponent?: ?(React.ComponentType<any> | React.Element<any>),
  ListHeaderComponent?: ?(React.ComponentType<any> | React.Element<any>),
  queryOptions?: QueryOptions,
|};

type InjectedProps = {|
  navigation: Navigation,
|};

@withNavigation
@observer
class DevicesList extends InjectedComponent<InjectedProps, Props> {
  static defaultProps = {
    ListEmptyComponent: <ListEmpty message="No Brewskey boxes" />,
    queryOptions: {},
  };

  _listStore: DAOListStore<Device> = new DAOListStore(DeviceStore);
  _swipeableListRef: ?SwipeableList<Device>;

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

  _keyExtractor = (row: Row<Device>): string => row.key;

  _onDeleteItemPress = async (item: Device): Promise<void> => {
    const clientID = DAOApi.DeviceDAO.deleteByID(item.id);
    await waitForLoaded(() => DAOApi.DeviceDAO.fetchByID(clientID));
    SnackBarStore.showMessage({ text: 'The Brewskey box was deleted' });
  };

  _onEditItemPress = ({ id }: Device) => {
    this.injectedProps.navigation.navigate('editDevice', { id });
    nullthrows(this._swipeableListRef).resetOpenRow();
  };

  _onItemPress = (item: Device): void =>
    this.injectedProps.navigation.navigate('deviceDetails', {
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
    const { ListEmptyComponent, renderListHeader } = this.props;
    const isLoading = this._listStore.isFetchingRemoteCount;

    return (
      <SwipeableList
        data={this._listStore.rows}
        keyExtractor={this._keyExtractor}
        ListEmptyComponent={!isLoading ? ListEmptyComponent : null}
        ListFooterComponent={<LoadingListFooter isLoading={isLoading} />}
        ListHeaderComponent={
          renderListHeader &&
          renderListHeader({
            isEmpty: this._listStore.rows.length === 0,
            isLoading,
          })
        }
        onEndReached={this._listStore.fetchNextPage}
        onRefresh={this._listStore.reload}
        ref={this._getSwipeableListRef}
        renderItem={this._renderRow}
      />
    );
  }
}

const SwipeableRowItem = ({ item, onItemPress }: RowItemProps<Device, *>) => (
  <ListItem
    item={item}
    onPress={onItemPress}
    rightIcon={
      <View style={styles.onlineIndicatorWrapper}>
        <DeviceOnlineIndicator deviceID={item.id} />
      </View>
    }
    title={item.name}
  />
);

const Slideout = ({
  item,
  onDeleteItemPress,
  onEditItemPress,
}: RowItemProps<Device, *>) => (
  <QuickActions
    deleteModalMessage={`Are you sure you want to delete ${item.name}?`}
    deleteModalTitle="Delete Brewskey box"
    item={item}
    onDeleteItemPress={onDeleteItemPress}
    onEditItemPress={onEditItemPress}
  />
);

export default DevicesList;
