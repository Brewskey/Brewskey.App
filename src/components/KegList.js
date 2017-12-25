// @flow

import type { Keg, QueryOptions } from 'brewskey.js-api';
import type { Row } from '../stores/DAOListStore';

import * as React from 'react';
import { observer } from 'mobx-react';
import DAOListStore from '../stores/DAOListStore';
import { KegStore } from '../stores/DAOStores';
import FlatList from '../common/FlatList';
import BeverageAvatar from '../common/avatars/BeverageAvatar';
import LoaderRow from '../common/LoaderRow';
import ListItem from '../common/ListItem';
import LoadingListFooter from '../common/LoadingListFooter';

type Props = {|
  queryOptions?: QueryOptions,
|};

@observer
class KegList extends React.Component<Props> {
  static defaultProps = {
    queryOptions: {},
  };

  _listStore: DAOListStore<Keg> = new DAOListStore(KegStore);

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

  _keyExtractor = (row: Row<Keg>): number => row.key;

  _renderRow = ({ item }: { item: Row<Keg> }): React.Node => (
    <LoaderRow loader={item.loader} renderListItem={this._renderListItem} />
  );

  _renderListItem = (keg: Keg): React.Node => (
    <ListItem
      avatar={<BeverageAvatar beverageId={keg.beverage.id} />}
      hideChevron
      item={keg}
      title={keg.beverage.name}
    />
  );

  render() {
    return (
      <FlatList
        onEndReached={this._listStore.fetchNextPage}
        data={this._listStore.rows}
        keyExtractor={this._keyExtractor}
        renderItem={this._renderRow}
        ListFooterComponent={
          <LoadingListFooter
            isLoading={!this._listStore.isFetchingRemoteCount}
          />
        }
      />
    );
  }
}

export default KegList;
