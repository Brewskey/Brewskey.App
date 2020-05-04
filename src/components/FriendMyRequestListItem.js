// @flow

import type { Friend } from 'brewskey.js-api';

import * as React from 'react';
import IconButton from '../common/buttons/IconButton';
import ListItem from '../common/ListItem';
import UserAvatar from '../common/avatars/UserAvatar';

type Props = {
  item: Friend,
  onPress: (friend: Friend) => void,
  onFriendCancelMyRequestPress: (friend: Friend) => Promise<void>,
};

class FriendMyRequestListItem extends React.Component<Props> {
  _onFriendCancelMyRequestPress = () =>
    this.props.onFriendCancelMyRequestPress(this.props.item);

  render(): React.Node {
    const { item: friend, onPress } = this.props;
    return (
      <ListItem
        avatar={<UserAvatar userName={friend.friendAccount.userName} />}
        item={friend}
        onPress={onPress}
        rightIcon={
          <IconButton
            onPress={this._onFriendCancelMyRequestPress}
            name="md-close"
            type="ionicon"
          />
        }
        title={friend.friendAccount.userName}
      />
    );
  }
}

export default FriendMyRequestListItem;
