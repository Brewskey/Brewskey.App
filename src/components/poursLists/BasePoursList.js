// @flow

import type { Pour, QueryOptions } from 'brewskey.js-api';
import type { Row } from '../../stores/DAOListStore';

import * as React from 'react';
import { withNavigation } from 'react-navigation';
import { observer } from 'mobx-react';
import DAOListStore from '../../stores/DAOListStore';
import { PourStore } from '../../stores/DAOStores';
import FlatList from '../../common/FlatList';
import LoaderRow from '../../common/LoaderRow';
import LoadingListFooter from '../../common/LoadingListFooter';

type Props = {|
  queryOptions?: QueryOptions,
  renderListItem: (pour: Pour) => React.Node,
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

  _keyExtractor = (row: Row<Pour>): number => row.key;

  _renderRow = ({ item }: { item: Row<Pour> }): React.Node => (
    <LoaderRow
      loader={item.loader}
      renderListItem={this.props.renderListItem}
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
            isLoading={this._listStore.isFetchingRemoteCount}
          />
        }
      />
    );
  }
}

export default BasePoursList;
