import * as React from 'react';
import { useState } from 'react';

import { FRIEND_STATUSES } from '@brewskey/js-api';
import nullthrows from 'nullthrows';

import { Fragment } from 'common/Fragment';
import { FriendAddModal } from 'components/modals/FriendAddModal';
import { FriendApprovedModal } from 'components/modals/FriendApprovedModal';
import { FriendPendingModal } from 'components/modals/FriendPendingModal';
import { HeaderIconButton } from 'common/Header/HeaderIconButton';
import { useAuthSession } from 'hooks/context/AuthContext';
import { useAddSnackBarMessage } from 'hooks/context/SnackBarContext';
import { useAddFriend, useDeleteFriend } from 'hooks/queries/FriendQueries';

import type { Account, Friend } from '@brewskey/js-api';

interface Props {
  account: Account;
  friend: Friend | null | undefined;
}

const ProfileFriendStatus: React.FC<Props> = ({ account, friend }) => {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const addFriendMutation = useAddFriend();
  const deleteFriendMutation = useDeleteFriend();
  const addSnackBarMessage = useAddSnackBarMessage();
  const { data: authResponse } = useAuthSession();

  const onFriendAddPress = async () => {
    const { userName } = account;

    setIsModalVisible(false);

    try {
      await addFriendMutation.mutateAsync(userName);
      addSnackBarMessage({
        content: `You requested a friendship with ${userName}`,
      });
    } catch (error) {
      addSnackBarMessage({
        content:
          error instanceof Error ? error.message : 'Failed to add friend',
        style: 'danger',
      });
    }
  };

  const onFriendDeletePress = async () => {
    const { userName } = account;

    setIsModalVisible(false);

    try {
      await deleteFriendMutation.mutateAsync(nullthrows(friend).id);
      addSnackBarMessage({
        content: `You removed ${userName} from friends.`,
      });
    } catch (error) {
      addSnackBarMessage({
        content:
          error instanceof Error ? error.message : 'Failed to remove friend',
        style: 'danger',
      });
    }
  };

  if (authResponse?.id === account.id) {
    return null;
  }

  if (!friend) {
    return (
      <Fragment>
        <HeaderIconButton
          name="person-add"
          onPress={() => setIsModalVisible(true)}
          testID="button-add-friend"
          type="material-icons"
        />
        <FriendAddModal
          account={account}
          isVisible={isModalVisible}
          onFriendAddPress={onFriendAddPress}
          onHideModal={() => setIsModalVisible(false)}
        />
      </Fragment>
    );
  }

  if (friend.friendStatus === FRIEND_STATUSES.APPROVED) {
    return (
      <Fragment>
        <HeaderIconButton
          name="handshake-o"
          onPress={() => setIsModalVisible(true)}
          type="font-awesome"
        />
        <FriendApprovedModal
          account={account}
          isVisible={isModalVisible}
          onFriendDeletePress={onFriendDeletePress}
          onHideModal={() => setIsModalVisible(false)}
        />
      </Fragment>
    );
  }

  if (friend.friendStatus === FRIEND_STATUSES.PENDING) {
    return (
      <Fragment>
        <HeaderIconButton
          name="person-outline"
          onPress={() => setIsModalVisible(true)}
        />
        <FriendPendingModal
          account={account}
          isVisible={isModalVisible}
          onHideModal={() => setIsModalVisible(false)}
        />
      </Fragment>
    );
  }

  return null;
};

export { ProfileFriendStatus };
