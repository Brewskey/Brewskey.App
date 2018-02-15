// @flow

import type { QueryOptions, Pour } from 'brewskey.js-api';
import type { Navigation } from '../../types';
import type { RowItemProps } from '../../common/SwipeableRow';

import * as React from 'react';
import moment from 'moment';
import { observer } from 'mobx-react';
import { withNavigation } from 'react-navigation';
import InjectedComponent from '../../common/InjectedComponent';
import ListItem from '../../common/ListItem';
import UserAvatar from '../../common/avatars/UserAvatar';
import BasePoursList from './BasePoursList';
import { NULL_STRING_PLACEHOLDER } from '../../constants';

type Props = {|
  ListHeaderComponent?: ?(React.ComponentType<any> | React.Element<any>),
  queryOptions?: QueryOptions,
|};

type InjectedProps = {|
  navigation: Navigation,
|};

@withNavigation
@observer
class OwnerPoursList extends InjectedComponent<InjectedProps, Props> {
  _onListItemPress = (pour: Pour) => {
    if (!pour.owner) {
      return;
    }

    this.injectedProps.navigation.navigate('profile', {
      id: pour.owner.id,
    });
  };

  render() {
    const { ListHeaderComponent, queryOptions } = this.props;
    return (
      <BasePoursList
        ListHeaderComponent={ListHeaderComponent}
        loadedRow={LoadedRow}
        queryOptions={queryOptions}
      />
    );
  }
}

// todo add pour amount rendering
const LoadedRow = ({ item: pour, onListItemPress }: RowItemProps<Pour, *>) => {
  const pourOwnerUserName = pour.owner
    ? pour.owner.userName
    : NULL_STRING_PLACEHOLDER;

  return (
    <ListItem
      avatar={<UserAvatar userName={pourOwnerUserName} />}
      onPress={onListItemPress}
      hideChevron
      item={pour}
      title={`${pourOwnerUserName} – ${pour.ounces.toFixed(1)} oz`}
      subtitle={moment(pour.pourDate).fromNow()}
    />
  );
};

export default OwnerPoursList;
