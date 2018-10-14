// @flow

import type { Friend } from 'brewskey.js-api';

import * as React from 'react';
import { StyleSheet, View } from 'react-native';
import IconButton from '../common/buttons/IconButton';
import ListItem from '../common/ListItem';
import UserAvatar from '../common/avatars/UserAvatar';

const styles = StyleSheet.create({
  iconsContainer: {
    flexDirection: 'row',
  },
});

type Props = {
  item: Friend,
  onFriendAcceptPress: (friend: Friend) => void,
  onFriendDeclinePress: (friend: Friend) => void,
  onPress: (friend: Friend) => void,
};

class FriendPendingRequestListItem extends React.PureComponent<Props> {
  _onFriendDeclinePress = () =>
    this.props.onFriendDeclinePress(this.props.item);

  _onFriendAcceptPress = () => this.props.onFriendAcceptPress(this.props.item);

  render() {
    const { item: friend, onPress } = this.props;

    return (
      <ListItem
        avatar={<UserAvatar userName={friend.friendAccount.userName} />}
        item={friend}
        onPress={onPress}
        rightIcon={
          <View style={styles.iconsContainer}>
            <IconButton
              onPress={this._onFriendAcceptPress}
              name="md-checkmark"
              type="ionicon"
            />
            <IconButton
              onPress={this._onFriendDeclinePress}
              name="md-close"
              type="ionicon"
            />
          </View>
        }
        title={friend.friendAccount.userName}
      />
    );
  }
}

export default FriendPendingRequestListItem;
