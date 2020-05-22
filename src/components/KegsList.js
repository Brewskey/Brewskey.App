// @flow

import type { Keg, QueryOptions } from 'brewskey.js-api';
import type { Row } from '../stores/DAOListStore';
import type { RowItemProps } from '../common/SwipeableRow';

import * as React from 'react';
import { observer } from 'mobx-react';
import DAOListStore from '../stores/DAOListStore';
import { KegStore } from '../stores/DAOStores';
import List from '../common/List';
import BeverageAvatar from '../common/avatars/BeverageAvatar';
import LoaderRow from '../common/LoaderRow';
import ListItem from '../common/ListItem';
import ListEmpty from '../common/ListEmpty';
import LoadingListFooter from '../common/LoadingListFooter';

type Props = {|
  ListHeaderComponent?: ?(React.ComponentType<any> | React.Node),
  onRefresh?: () => void | Promise<any>,
  queryOptions?: QueryOptions,
|};

@observer
class KegsList extends React.Component<Props> {
  static defaultProps: {| queryOptions: QueryOptions |} = {
    queryOptions: {},
  };

  _listStore: DAOListStore<Keg> = new DAOListStore(KegStore);

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

  _keyExtractor = (row: Row<Keg>): string => row.key;

  _onRefresh = () => {
    const { onRefresh } = this.props;
    onRefresh && onRefresh();
    this._listStore.reload();
  };

  _renderRow = ({ item }: { item: Row<Keg> }): React.Node => {
    return <LoaderRow loader={item.loader} loadedRow={LoadedRow} />;
  };

  render(): React.Node {
    const isLoading = this._listStore.isFetchingRemoteCount;
    return (
      <List
        data={this._listStore.rows}
        keyExtractor={this._keyExtractor}
        ListEmptyComponent={!isLoading ? <ListEmpty message="No kegs" /> : null}
        ListFooterComponent={<LoadingListFooter isLoading={isLoading} />}
        ListHeaderComponent={this.props.ListHeaderComponent}
        onEndReached={this._listStore.fetchNextPage}
        onRefresh={this._onRefresh}
        renderItem={this._renderRow}
      />
    );
  }
}

const LoadedRow = ({ item: keg }): React.Node => (
  <ListItem
    leftAvatar={<BeverageAvatar beverageId={keg.beverage.id} />}
    chevron={false}
    item={keg}
    title={keg.beverage.name}
  />
);

export default KegsList;
