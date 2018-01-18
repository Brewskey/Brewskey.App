// @flow

import type { QueryOptions, Pour } from 'brewskey.js-api';

import * as React from 'react';
import moment from 'moment';
import { observer } from 'mobx-react';
import ListItem from '../../common/ListItem';
import UserAvatar from '../../common/avatars/UserAvatar';
import BasePoursList from './BasePoursList';
import { NULL_STRING_PLACEHOLDER } from '../../constants';
import NavigationService from '../../NavigationService';

type Props = {|
  ListHeaderComponent?: React.Node,
  queryOptions?: QueryOptions,
|};

@observer
class OwnerPoursList extends React.Component<Props> {
  _onListItemPress = (pour: Pour) => {
    if (!pour.owner) {
      return;
    }

    // todo https://github.com/Brewskey/Brewskey.App/issues/111
    NavigationService.navigate('profile', {
      id: pour.owner.id,
    });
  };

  // todo add pour amount rendering
  _renderListItem = (pour: Pour): React.Node => {
    const pourOwnerUserName = pour.owner
      ? pour.owner.userName
      : NULL_STRING_PLACEHOLDER;

    return (
      <ListItem
        avatar={<UserAvatar userName={pourOwnerUserName} />}
        onPress={this._onListItemPress}
        hideChevron
        item={pour}
        title={`${pourOwnerUserName} – ${pour.ounces.toFixed(1)} oz`}
        subtitle={moment(pour.pourDate).fromNow()}
      />
    );
  };

  render() {
    const { ListHeaderComponent, queryOptions } = this.props;
    return (
      <BasePoursList
        ListHeaderComponent={ListHeaderComponent}
        queryOptions={queryOptions}
        renderListItem={this._renderListItem}
      />
    );
  }
}

export default OwnerPoursList;
