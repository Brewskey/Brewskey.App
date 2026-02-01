import * as React from 'react';

import { ListItem } from '@rneui/base';
import { Icon } from '@rneui/themed';
import moment from 'moment';
import { Animated, StyleSheet, Text, View } from 'react-native';

import { TouchableItem } from 'common/buttons/TouchableItem';
import { COLORS, TYPOGRAPHY } from 'theme';

import type { Notification } from 'stores/NotificationTypes';

const READ_TIMEOUT = 2000;

const styles = StyleSheet.create({
  container: {
    borderBottomColor: COLORS.secondary3,
    borderBottomWidth: 1,
    display: 'flex',
    flexDirection: 'row',
    paddingHorizontal: 12,
    paddingVertical: 8,
    width: '100%',
  },
  contentContainer: {
    flex: 1,
  },
  dateText: {
    color: COLORS.textFaded,
  },
  mainContainer: {
    flex: 1,
    justifyContent: 'flex-start',
    paddingLeft: 12,
  },
  slideoutContainer: {
    backgroundColor: COLORS.secondary2,
    borderBottomWidth: 1,
    borderColor: COLORS.secondary3,
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'flex-end',
    paddingRight: 20,
  },
  titleText: {
    ...TYPOGRAPHY.secondary,
    color: COLORS.text,
    fontWeight: 'bold',
  },
});

export interface Props {
  contentComponent?: React.ReactNode;
  isSwipeable: boolean;
  leftComponent?: React.ReactNode;
  notification: Notification;
  onOpen: (notification: Notification) => void;
  onPress: (notification: Notification) => void | Promise<void>;
  onReadEnd: (notification: Notification) => void;
}

const SlideoutView = () => (
  <View style={styles.slideoutContainer}>
    <Icon
      color={COLORS.danger}
      containerStyle={{ alignSelf: 'center' }}
      name="delete"
      size={32}
    />
  </View>
);

const NotificationListItemComponent: React.FC<Props> = ({
  contentComponent: ContentComponent,
  isSwipeable = true,
  leftComponent: LeftComponent,
  notification,
  onOpen,
  onPress,
  onReadEnd,
}) => {
  const readAnimationValue = React.useRef(new Animated.Value(0)).current;
  const readAnimationRef = React.useRef<Animated.CompositeAnimation | null>(
    null,
  );

  React.useEffect(() => {
    const animation = Animated.timing(readAnimationValue, {
      duration: READ_TIMEOUT,
      toValue: 1,
      useNativeDriver: false,
    });
    readAnimationRef.current = animation;

    if (!notification.isRead) {
      animation.start(() => {
        onReadEnd(notification);
      });
    }

    return () => {
      animation.stop();
    };
  }, [notification.isRead, notification, onReadEnd, readAnimationValue]);

  const handleReadEnd = React.useCallback(() => {
    onReadEnd(notification);
  }, [notification, onReadEnd]);

  const handlePress = React.useCallback(() => {
    handleReadEnd();
    readAnimationRef.current?.stop();
    onPress(notification);
  }, [notification, onPress, handleReadEnd]);

  const handleOpen = React.useCallback(() => {
    onOpen(notification);
  }, [notification, onOpen]);

  const backgroundColor = notification.isRead
    ? COLORS.secondary
    : readAnimationValue.interpolate({
        inputRange: [0, 1],
        outputRange: [COLORS.primary4, COLORS.secondary],
      });

  const contentElement =
    ContentComponent == null ? null : (
      <View>
        <Text>{notification.body}</Text>
      </View>
    );

  const content = (
    <TouchableItem onPress={handlePress}>
      <Animated.View style={[styles.container, { backgroundColor }]}>
        {LeftComponent}
        <View style={styles.mainContainer}>
          <Text style={styles.titleText}>{notification.title}</Text>
          <Text style={styles.dateText}>
            {moment(notification.date).fromNow()}
          </Text>
          <View style={styles.contentContainer}>{contentElement}</View>
        </View>
      </Animated.View>
    </TouchableItem>
  );

  if (!isSwipeable) {
    return content;
  }

  return (
    <ListItem.Swipeable
      // maxSwipeDistance={250}
      onSwipeBegin={handleOpen}
      // preventSwipeRight
      rightContent={<SlideoutView />}
      // swipeThreshold={250}
    >
      {content}
    </ListItem.Swipeable>
  );
};

export const NotificationListItem = React.memo(NotificationListItemComponent);
