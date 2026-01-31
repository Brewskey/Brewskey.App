import * as React from 'react';

import { AchievementListItem } from 'components/NotificationsList/AchievementListItem';
import { FriendRequestListItem } from 'components/NotificationsList/FriendRequestListItem';
import { LowKegLevelListItem } from 'components/NotificationsList/LowKegLevelListItem';
import { TextListItem } from 'components/NotificationsList/TextListItem';

import type { Props as NotificationListItemProps } from 'components/NotificationsList/NotificationListItem';

const NotificationComponentByType = (
  props: NotificationListItemProps,
): React.ReactElement | null => {
  const {
    contentComponent,
    isSwipeable,
    leftComponent,
    notification,
    onOpen,
    onPress,
    onReadEnd,
  } = props;

  switch (notification.type) {
    case 'lowKegLevel': {
      return (
        <LowKegLevelListItem
          contentComponent={contentComponent}
          isSwipeable={isSwipeable}
          leftComponent={leftComponent}
          notification={notification}
          onOpen={onOpen}
          onPress={onPress}
          onReadEnd={onReadEnd}
        />
      );
    }

    case 'newAchievement': {
      return (
        <AchievementListItem
          contentComponent={contentComponent}
          isSwipeable={isSwipeable}
          leftComponent={leftComponent}
          notification={notification}
          onOpen={onOpen}
          onPress={onPress}
          onReadEnd={onReadEnd}
        />
      );
    }

    case 'newFriendRequest': {
      return (
        <FriendRequestListItem
          contentComponent={contentComponent}
          isSwipeable={isSwipeable}
          leftComponent={leftComponent}
          notification={notification}
          onOpen={onOpen}
          onPress={onPress}
          onReadEnd={onReadEnd}
        />
      );
    }

    case 'text': {
      return (
        <TextListItem
          contentComponent={contentComponent}
          isSwipeable={isSwipeable}
          leftComponent={leftComponent}
          notification={notification}
          onOpen={onOpen}
          onPress={onPress}
          onReadEnd={onReadEnd}
        />
      );
    }

    default: {
      return null;
    }
  }
};

export { NotificationComponentByType };
