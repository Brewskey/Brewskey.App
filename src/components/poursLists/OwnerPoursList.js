// @flow

import type { QueryOptions, Pour } from 'brewskey.js-api';
import type { Navigation } from '../../types';

import * as React from 'react';
import moment from 'moment';
import { observer } from 'mobx-react';
import InjectedComponent from '../../common/InjectedComponent';
import ListItem from '../../common/ListItem';
import UserAvatar from '../../common/avatars/UserAvatar';
import BasePoursList from './BasePoursList';
import { NULL_STRING_PLACEHOLDER } from '../../constants';
import NavigationService from '../../NavigationService';

type Props = {|
  ListHeaderComponent?: React.Node,
  queryOptions?: QueryOptions,
|};

type InjectedProps = {|
  navigation: Navigation,
|};

@observer
class OwnerPoursList extends InjectedComponent<InjectedProps, Props> {
  _onListItemPress = (pour: Pour) => {
    if (!pour.owner) {
      return;
    }

    // todo for some reason navigation.navigate() from withNavigation HOC
    // doesn't do anything in the current component level
    // with the current react-navigation version lib
    // https://github.com/react-navigation/react-navigation/issues/3143
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
