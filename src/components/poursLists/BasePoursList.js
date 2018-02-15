// @flow

import type { Pour, QueryOptions } from 'brewskey.js-api';
import type { Row } from '../../stores/DAOListStore';
import type { RowItemProps } from '../../common/SwipeableRow';

import * as React from 'react';
import { withNavigation } from 'react-navigation';
import { observer } from 'mobx-react';
import DAOListStore from '../../stores/DAOListStore';
import { PourStore } from '../../stores/DAOStores';
import List from '../../common/List';
import LoaderRow from '../../common/LoaderRow';
import LoadingListFooter from '../../common/LoadingListFooter';

type Props = {|
  ListHeaderComponent?: ?(React.ComponentType<any> | React.Element<any>),
  loadedRow: React.ComponentType<RowItemProps<Pour, *>>,
  queryOptions?: QueryOptions,
|};

@withNavigation
@observer
class BasePoursList extends React.Component<Props> {
  static defaultProps = {
    queryOptions: {},
  };

  _listStore: DAOListStore<Pour> = new DAOListStore(PourStore);

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

  _keyExtractor = (row: Row<Pour>): string => row.key;

  _renderRow = ({ item }: { item: Row<Pour> }): React.Element<any> => (
    <LoaderRow loadedRow={this.props.loadedRow} loader={item.loader} />
  );

  render() {
    return (
      <List
        data={this._listStore.rows}
        keyExtractor={this._keyExtractor}
        ListFooterComponent={
          <LoadingListFooter
            isLoading={this._listStore.isFetchingRemoteCount}
          />
        }
        ListHeaderComponent={this.props.ListHeaderComponent}
        onEndReached={this._listStore.fetchNextPage}
        renderItem={this._renderRow}
      />
    );
  }
}

export default BasePoursList;
