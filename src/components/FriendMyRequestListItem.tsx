import * as React from 'react';

import { UserAvatar } from 'common/avatars/UserAvatar';
import { IconButton } from 'common/buttons/IconButton';
import { ListItem } from 'common/ListItem';

import type { Friend } from '@brewskey/js-api';

interface Props {
  item: Friend;
  onPress: (friend: Friend) => void;
  onFriendCancelMyRequestPress: (friend: Friend) => Promise<void>;
}

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
      item={friend}
      leftAvatar={<UserAvatar userName={friend.friendAccount.userName} />}
      onPress={onPress}
      title={friend.friendAccount.userName}
      rightIcon={
        <IconButton name="close" onPress={handleFriendCancelMyRequestPress} />
      }
    />
  );
};

export { FriendMyRequestListItem };
