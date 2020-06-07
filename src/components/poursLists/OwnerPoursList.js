// @flow

import type { QueryOptions, Pour } from 'brewskey.js-api';
import type { Navigation } from '../../types';
import type { RowItemProps } from '../../common/SwipeableRow';

import * as React from 'react';
import moment from 'moment';
import { observer } from 'mobx-react';
import { withNavigation } from 'react-navigation';
import DAOApi from 'brewskey.js-api';
import InjectedComponent from '../../common/InjectedComponent';
import ListEmpty from '../../common/ListEmpty';
import ListItem from '../../common/ListItem';
import QuickActions from '../../common/QuickActions';
import SwipeableRow from '../../common/SwipeableRow';
import UserAvatar from '../../common/avatars/UserAvatar';
import BasePoursList from './BasePoursList';
import SnackBarStore from '../../stores/SnackBarStore';
import { NULL_STRING_PLACEHOLDER } from '../../constants';

type Props = {|
  canDeletePours: boolean,
  ListHeaderComponent?: ?(React.ComponentType<any> | React.Node),
  onRefresh?: () => void,
  queryOptions?: QueryOptions,
|};

type InjectedProps = {|
  navigation: Navigation,
|};

@withNavigation
@observer
class OwnerPoursList extends InjectedComponent<InjectedProps, Props> {
  _onItemPress = (pour: Pour) => {
    if (!pour.owner) {
      return;
    }

    this.injectedProps.navigation.navigate('profile', {
      id: pour.owner.id,
    });
  };

  _onDeleteItemPress = async (item: Pour): Promise<void> => {
    const clientID = DAOApi.PourDAO.deleteByID(item.id);
    await DAOApi.PourDAO.waitForLoadedNullable((dao) =>
      dao.fetchByID(clientID),
    );
    SnackBarStore.showMessage({ text: 'The pour was deleted' });
  };

  render(): React.Node {
    const {
      canDeletePours,
      ListHeaderComponent,
      onRefresh,
      queryOptions,
    } = this.props;

    if (!canDeletePours) {
      return (
        <BasePoursList
          ListEmptyComponent={<ListEmpty message="No pours" />}
          ListHeaderComponent={ListHeaderComponent}
          loadedRow={LoadedRow}
          onRefresh={onRefresh}
          queryOptions={queryOptions}
        />
      );
    }

    return (
      <BasePoursList
        ListEmptyComponent={<ListEmpty message="No pours" />}
        ListHeaderComponent={ListHeaderComponent}
        loadedRow={SwipeableRow}
        onDeleteItemPress={this._onDeleteItemPress}
        onRefresh={onRefresh}
        queryOptions={queryOptions}
        rowItemComponent={LoadedRow}
        slideoutComponent={Slideout}
      />
    );
  }
}

// todo add pour amount rendering
const LoadedRow = ({ item: pour, onItemPress }: RowItemProps<Pour>) => {
  const pourOwnerUserName = pour.owner
    ? pour.owner.userName
    : NULL_STRING_PLACEHOLDER;
  const title = pour.owner
    ? `${pourOwnerUserName} – ${pour.ounces.toFixed(1)} oz`
    : `${pour.ounces.toFixed(1)} oz`;

  return (
    <ListItem
      chevron={false}
      leftAvatar={<UserAvatar userName={pourOwnerUserName} />}
      onPress={onItemPress}
      item={pour}
      title={title}
      subtitle={moment(pour.pourDate).fromNow()}
    />
  );
};

const Slideout = ({
  item,
  onDeleteItemPress,
}: RowItemProps<Pour>): React.Node => (
  <QuickActions
    deleteModalMessage="Are you sure you want to delete this pour?"
    deleteModalTitle="Delete Pour"
    item={item}
    onDeleteItemPress={onDeleteItemPress}
  />
);

export default OwnerPoursList;
