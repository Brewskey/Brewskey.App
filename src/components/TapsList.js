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
import LoadingListFooter from '../common/LoadingListFooter';
import QuickActions from '../common/QuickActions';
import SwipeableList from '../common/SwipeableList';
import SwipeableRow from '../common/SwipeableRow';
import TapListItem from './TapListItem';
import DeviceTapListEmpty from './DeviceTapListEmpty';

type Props = {|
  ListHeaderComponent?: ?(React.ComponentType<any> | React.Node),
  onAddTapPress: () => void,
  onRefresh?: () => void,
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

  componentDidMount() {
    this._listStore.initialize(this.props.queryOptions);
  }

  _getSwipeableListRef = (ref) => {
    this._swipeableListRef = ref;
  };

  _keyExtractor = (row: Row<Tap>): string => row.key;

  _onDeleteItemPress = async (item: Tap): Promise<void> => {
    DAOApi.TapDAO.flushQueryCaches();
    const clientID = DAOApi.TapDAO.deleteByID(item.id);
    await DAOApi.TapDAO.waitForLoadedNullable((dao) => dao.fetchByID(clientID));
  };

  _onEditItemPress = ({ id }: Tap) => {
    this.injectedProps.navigation.navigate('editTap', { id });
    nullthrows(this._swipeableListRef).resetOpenRow();
  };

  _onItemPress = (item: Tap): void =>
    this.injectedProps.navigation.navigate('tapDetails', {
      id: item.id,
    });

  _onRefresh = () => {
    this._listStore.reload();
    const { onRefresh } = this.props;
    if (onRefresh != null) {
      onRefresh();
    }
  };
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

  render(): React.Node {
    const { ListHeaderComponent, onAddTapPress } = this.props;

    const isLoading = this._listStore.isFetchingRemoteCount;
    return (
      <SwipeableList
        data={this._listStore.rows}
        keyExtractor={this._keyExtractor}
        ListEmptyComponent={
          !isLoading ? (
            <DeviceTapListEmpty onAddTapPress={onAddTapPress} />
          ) : null
        }
        ListFooterComponent={<LoadingListFooter isLoading={isLoading} />}
        ListHeaderComponent={ListHeaderComponent}
        onEndReached={this._listStore.fetchNextPage}
        onRefresh={this._onRefresh}
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
}: RowItemProps<Tap, *>): React.Node => (
  <TapListItem index={index} onPress={onItemPress} tap={item} />
);

const Slideout = ({
  item,
  onDeleteItemPress,
  onEditItemPress,
}: RowItemProps<Tap, *>): React.Node => (
  <QuickActions
    deleteModalMessage="Are you sure you want to delete the Tap?"
    deleteModalTitle="Delete tap"
    item={item}
    onDeleteItemPress={onDeleteItemPress}
    onEditItemPress={onEditItemPress}
  />
);

export default TapsList;
