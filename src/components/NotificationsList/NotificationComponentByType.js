// @flow

import type { Props as NotificationListItemProps } from './NotificationListItem';

import * as React from 'react';
import {Text} from 'react-native';
import LowKegLevelListItem from './LowKegLevelListItem';
import AchievementListItem from './AchievementListItem';
import FriendRequestListItem from './FriendRequestListItem';
import TextListItem from './TextListItem';

const NotificationComponentByType = (
  props: NotificationListItemProps,
): React.Node => {
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

export default NotificationComponentByType;
