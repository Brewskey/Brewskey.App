// @flow

import type { Pour, QueryOptions } from 'brewskey.js-api';
import type { Row } from '../stores/DAOListStore';

import * as React from 'react';
import moment from 'moment';
import { observer } from 'mobx-react';
import DAOListStore from '../stores/DAOListStore';
import { PourStore } from '../stores/DAOStores';
import FlatList from '../common/FlatList';
import UserAvatar from '../common/avatars/UserAvatar';
import LoaderRow from '../common/LoaderRow';
import ListItem from '../common/ListItem';
import LoadingListFooter from '../common/LoadingListFooter';
import { NULL_STRING_PLACEHOLDER } from '../constants';

type Props = {|
  queryOptions?: QueryOptions,
|};

// todo add navigate to userAccount on click
@observer
class PoursList extends React.Component<Props> {
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
    <LoaderRow loader={item.loader} renderListItem={this._renderListItem} />
  );

  // todo add pour amount rendering
  _renderListItem = (pour: Pour): React.Node => {
    const pourOwnerUserName = pour.owner
      ? pour.owner.userName
      : NULL_STRING_PLACEHOLDER;

    return (
      <ListItem
        avatar={<UserAvatar userName={pourOwnerUserName} />}
        hideChevron
        item={pour}
        title={`${pourOwnerUserName} – ${pour.ounces.toFixed(1)} oz`}
        subtitle={moment(pour.pourDate).fromNow()}
      />
    );
  };

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

export default PoursList;
