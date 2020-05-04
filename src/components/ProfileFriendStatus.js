// @flow

import type { Account, Friend } from 'brewskey.js-api';

import * as React from 'react';
import nullthrows from 'nullthrows';
import { action, observable } from 'mobx';
import { observer } from 'mobx-react';
import DAOApi, { FRIEND_STATUSES } from 'brewskey.js-api';
import Fragment from '../common/Fragment';
import HeaderIconButton from '../common/Header/HeaderIconButton';
import AuthStore from '../stores/AuthStore';
import { FriendStore } from '../stores/DAOStores';
import FriendApprovedModal from './modals/FriendApprovedModal';
import FriendAddModal from './modals/FriendAddModal';
import FriendPendingModal from './modals/FriendPendingModal';
import ToggleStore from '../stores/ToggleStore';
import FriendAddStore from '../stores/ApiRequestStores/FriendAddStore';
import SnackBarStore from '../stores/SnackBarStore';

type Props = {
  account: Account,
  friend: ?Friend,
};

@observer
class ProfileFriendStatus extends React.Component<Props> {
  _modalToggleStore = new ToggleStore();

  @observable
  _friendAddCacheKey: ?string = null;

  @action
  _onFriendAddPress = async () => {
    const {
      account: { userName },
    } = this.props;

    this._modalToggleStore.toggleOff();
    this._friendAddCacheKey = FriendAddStore.fetch(userName);

    const friendAddResultLoader = FriendAddStore.getFromCache(
      nullthrows(this._friendAddCacheKey),
    );

    if (friendAddResultLoader.hasError()) {
      SnackBarStore.showMessage({
        style: 'danger',
        text: friendAddResultLoader.getErrorEnforcing().toString(),
      });
      FriendAddStore.flushCache();
      return;
    }

    FriendStore.flushCache();
    SnackBarStore.showMessage({
      text: `You requested a  friendship with ${userName}`,
    });
  };

  _onFriendDeletePress = async () => {
    const {
      account: { userName },
      friend,
    } = this.props;

    this._modalToggleStore.toggleOff();
    const clientID = DAOApi.FriendDAO.deleteByID(nullthrows(friend).id);
    await DAOApi.FriendDAO.waitForLoadedNullable((dao) =>
      dao.fetchByID(clientID),
    );
    SnackBarStore.showMessage({
      text: `You removed ${userName} from friends.`,
    });
  };

  render(): React.Node {
    const { account, friend } = this.props;

    if (AuthStore.userID === this.props.account.id) {
      return null;
    }

    if (!friend) {
      return (
        <Fragment>
          <HeaderIconButton
            name="person-add"
            onPress={this._modalToggleStore.toggleOn}
            type="material-icons"
          />
          <FriendAddModal
            account={account}
            isVisible={this._modalToggleStore.isToggled}
            onFriendAddPress={this._onFriendAddPress}
            onHideModal={this._modalToggleStore.toggleOff}
          />
        </Fragment>
      );
    }

    if (friend.friendStatus === FRIEND_STATUSES.APPROVED) {
      return (
        <Fragment>
          <HeaderIconButton
            name="handshake-o"
            onPress={this._modalToggleStore.toggleOn}
            type="font-awesome"
          />
          <FriendApprovedModal
            account={account}
            isVisible={this._modalToggleStore.isToggled}
            onFriendDeletePress={this._onFriendDeletePress}
            onHideModal={this._modalToggleStore.toggleOff}
          />
        </Fragment>
      );
    }

    if (friend.friendStatus === FRIEND_STATUSES.PENDING) {
      return (
        <Fragment>
          <HeaderIconButton
            name="person-outline"
            onPress={this._modalToggleStore.toggleOn}
          />
          <FriendPendingModal
            account={account}
            isVisible={this._modalToggleStore.isToggled}
            onHideModal={this._modalToggleStore.toggleOff}
          />
        </Fragment>
      );
    }

    return null;
  }
}

export default ProfileFriendStatus;
