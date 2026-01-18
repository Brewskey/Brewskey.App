import type { Friend } from '@brewskey/js-api';

import * as React from 'react';
import IconButton from '../common/buttons/IconButton';
import ListItem from '../common/ListItem';
import UserAvatar from '../common/avatars/UserAvatar';

type Props = {
  item: Friend;
  onPress: (friend: Friend) => void;
  onFriendCancelMyRequestPress: (friend: Friend) => Promise<void>;
};

const FriendMyRequestListItem: React.FC<Props> = ({
  item: friend,
  onFriendCancelMyRequestPress,
  onPress,
}) => {
  const handleFriendCancelMyRequestPress = React.useCallback(() => {
    onFriendCancelMyRequestPress(friend);
  }, [friend, onFriendCancelMyRequestPress]);

  return (
    <ListItem
      leftAvatar={<UserAvatar userName={friend.friendAccount.userName} />}
      item={friend}
      onPress={onPress}
      rightIcon={
        <IconButton
          onPress={handleFriendCancelMyRequestPress}
          name="close"
        />
      }
      title={friend.friendAccount.userName}
    />
  );
};

export default FriendMyRequestListItem;
