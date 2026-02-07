import * as React from 'react';

import { Icon } from '@rneui/themed';
import { Animated, StyleSheet, View } from 'react-native';

import { ListItem } from 'common/ListItem';
import { getNotificationListItemContent } from 'components/NotificationsList/notificationListItemContent';
import { COLORS } from 'theme';

import type { Notification } from 'stores/NotificationTypes';

const READ_TIMEOUT_MS = 2000;

const styles = StyleSheet.create({
  slideoutContainer: {
    alignItems: 'center',
    backgroundColor: COLORS.secondary2,
    flex: 1,
    justifyContent: 'center',
    paddingRight: 20,
  },
});

export interface Props {
  isSwipeable?: boolean;
  notification: Notification;
  onOpen: (notification: Notification) => void;
  onPress: (notification: Notification) => void | Promise<void>;
  onReadEnd: (notification: Notification) => void;
  testID?: string;
}

const SlideoutView = (): React.ReactElement => (
  <View style={styles.slideoutContainer}>
    <Icon color={COLORS.danger} name="delete" size={32} />
  </View>
);

const NotificationListItemComponent: React.FC<Props> = ({
  isSwipeable = true,
  notification,
  onOpen,
  onPress,
  onReadEnd,
  testID,
}) => {
  const readAnimationValue = React.useRef(new Animated.Value(0)).current;
  const readAnimationRef = React.useRef<Animated.CompositeAnimation | null>(
    null,
  );

  React.useEffect(() => {
    const animation = Animated.timing(readAnimationValue, {
      duration: READ_TIMEOUT_MS,
      toValue: 1,
      useNativeDriver: false,
    });
    readAnimationRef.current = animation;
    if (!notification.isRead) {
      animation.start(() => onReadEnd(notification));
    }
    return () => animation.stop();
  }, [notification.isRead, notification, onReadEnd, readAnimationValue]);

  const handlePress = React.useCallback(() => {
    readAnimationRef.current?.stop();
    onReadEnd(notification);
    onPress(notification);
  }, [notification, onPress, onReadEnd]);

  const handleSwipeBegin = React.useCallback(() => {
    onOpen(notification);
  }, [notification, onOpen]);

  const content = getNotificationListItemContent(notification);
  const backgroundColor = notification.isRead
    ? COLORS.secondary
    : readAnimationValue.interpolate({
        inputRange: [0, 1],
        outputRange: [COLORS.primary4, COLORS.secondary],
      });

  const listItem = isSwipeable ? (
    <ListItem<Notification>
      chevron={false}
      item={notification}
      leftAvatar={content.leftAvatar}
      onPress={handlePress}
      slideoutComponent={<SlideoutView />}
      subtitle={content.subtitle}
      swipeable
      title={content.title}
      containerStyle={{ backgroundColor: 'transparent' }}
      onSwipeBegin={handleSwipeBegin}
    />
  ) : (
    <ListItem<Notification>
      chevron={false}
      item={notification}
      leftAvatar={content.leftAvatar}
      onPress={handlePress}
      subtitle={content.subtitle}
      title={content.title}
      containerStyle={{ backgroundColor: 'transparent' }}
    />
  );

  return (
    <Animated.View style={[{ backgroundColor }]} testID={testID}>
      {listItem}
    </Animated.View>
  );
};

export const NotificationListItem = React.memo(NotificationListItemComponent);
