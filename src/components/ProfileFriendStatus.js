// @flow

import type { Account, Friend } from 'brewskey.js-api';

import * as React from 'react';
import nullthrows from 'nullthrows';
import { StyleSheet } from 'react-native';
import { action, computed, observable, when } from 'mobx';
import { observer } from 'mobx-react/native';
import DAOApi, { FRIEND_STATUSES, LoadObject } from 'brewskey.js-api';
import Fragment from '../common/Fragment';
import HeaderIconButton from '../common/Header/HeaderIconButton';
import LoadingIndicator from '../common/LoadingIndicator';
import { COLORS } from '../theme';
import AuthStore from '../stores/AuthStore';
import { FriendStore } from '../stores/DAOStores';
import FriendApprovedModal from './modals/FriendApprovedModal';
import FriendAddModal from './modals/FriendAddModal';
import FriendPendingModal from './modals/FriendPendingModal';
import ToggleStore from '../stores/ToggleStore';
import FriendAddStore from '../stores/ApiRequestStores/FriendAddStore';
import SnackBarStore from '../stores/SnackBarStore';

const styles = StyleSheet.create({
  loadingIndicator: {
    paddingHorizontal: 12,
  },
});

type Props = {
  account: Account,
};

@observer
class ProfileFriendStatus extends React.Component<Props> {
  _modalToggleStore = new ToggleStore();

  @observable _friendAddCacheKey: ?string = null;

  @computed
  get _isLoading(): boolean {
    return (
      this._friendLoader.isLoading() ||
      (!!this._friendAddCacheKey &&
        FriendAddStore.getFromCache(
          nullthrows(this._friendAddCacheKey),
        ).isLoading())
    );
  }

  @computed
  get _friendLoader(): LoadObject<Friend> {
    return FriendStore.getMany({
      filters: [
        DAOApi.createFilter('owningAccount/id').equals(AuthStore.userID),
        DAOApi.createFilter('friendAccount/id').equals(this.props.account.id),
      ],
      limit: 1,
    }).map(
      (loaders: Array<LoadObject<Friend>>): LoadObject<Friend> =>
        loaders[0] || LoadObject.empty(),
    );
  }

  @action
  _onFriendAddPress = async () => {
    const {
      account: { userName },
    } = this.props;

    this._modalToggleStore.toggleOff();
    this._friendAddCacheKey = FriendAddStore.fetch(userName);
    await when(() => !this._isLoading);

    const friendAddResultLoader = FriendAddStore.getFromCache(
      nullthrows(this._friendAddCacheKey),
    );

    if (friendAddResultLoader.hasError()) {
      SnackBarStore.showMessage({
        style: 'danger',
        text: (friendAddResultLoader.getErrorEnforcing(): any),
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
    } = this.props;
    const friendId = this._friendLoader.getValueEnforcing().id;

    this._modalToggleStore.toggleOff();
    await DAOApi.FriendDAO.deleteByID(friendId);
    SnackBarStore.showMessage({
      text: `You removed ${userName} from friends.`,
    });
  };

  render() {
    const { account } = this.props;

    if (
      AuthStore.userID === this.props.account.id ||
      this._friendLoader.hasError()
    ) {
      return null;
    }

    if (this._isLoading) {
      return (
        <LoadingIndicator
          activitySize="small"
          color={COLORS.secondary}
          style={styles.loadingIndicator}
        />
      );
    }

    if (!this._friendLoader.hasValue()) {
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

    if (
      this._friendLoader.getValueEnforcing().friendStatus ===
      FRIEND_STATUSES.APPROVED
    ) {
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

    if (
      this._friendLoader.getValueEnforcing().friendStatus ===
      FRIEND_STATUSES.PENDING
    ) {
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
