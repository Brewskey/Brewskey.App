import type { Friend } from '@brewskey/js-api';

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
  item: Friend;
  onFriendAcceptPress: (friend: Friend) => void;
  onFriendDeclinePress: (friend: Friend) => void;
  onPress: (friend: Friend) => void;
};

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
      leftAvatar={<UserAvatar userName={friend.friendAccount.userName} />}
      item={friend}
      onPress={onPress}
      rightIcon={
        <View style={styles.iconsContainer}>
          <IconButton
            onPress={handleFriendAcceptPress}
            name="check"
          />
          <IconButton
            onPress={handleFriendDeclinePress}
            name="close"
          />
        </View>
      }
      title={friend.friendAccount.userName}
    />
  );
};

export default React.memo(FriendPendingRequestListItem);
