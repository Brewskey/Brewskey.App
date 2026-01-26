import * as React from 'react';

import { StyleSheet, View } from 'react-native';

import UserAvatar from '../common/avatars/UserAvatar';
import IconButton from '../common/buttons/IconButton';
import ListItem from '../common/ListItem';

import type { Friend } from '@brewskey/js-api';

const styles = StyleSheet.create({
  iconsContainer: {
    flexDirection: 'row',
  },
});

interface Props {
  item: Friend;
  onFriendAcceptPress: (friend: Friend) => void;
  onFriendDeclinePress: (friend: Friend) => void;
  onPress: (friend: Friend) => void;
}

const FriendPendingRequestListItem: React.FC<Props> = ({
  item: friend,
  onFriendAcceptPress,
  onFriendDeclinePress,
  onPress,
}) => {
  const handleFriendDeclinePress = () => onFriendDeclinePress(friend);
  const handleFriendAcceptPress = () => onFriendAcceptPress(friend);

  return (
    <ListItem
      item={friend}
      leftAvatar={<UserAvatar userName={friend.friendAccount.userName} />}
      onPress={onPress}
      title={friend.friendAccount.userName}
      rightIcon={
        <View style={styles.iconsContainer}>
          <IconButton name="check" onPress={handleFriendAcceptPress} />
          <IconButton name="close" onPress={handleFriendDeclinePress} />
        </View>
      }
    />
  );
};

export default React.memo(FriendPendingRequestListItem);
