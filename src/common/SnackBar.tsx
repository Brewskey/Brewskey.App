import {
  useGetCurrentSnackBarMessage,
  useRemoveSnackBarMessage,
  type SnackBarMessage,
} from '../hooks/context/SnackBarContext';
import type { Notification } from '../stores/NotificationsStore';

import * as React from 'react';

import {
  Animated,
  LayoutChangeEvent,
  StyleSheet,
  Text,
  TouchableWithoutFeedback,
  View,
} from 'react-native';
import { COLORS } from '../theme';
import NotificationsStore from '../stores/NotificationsStore';
import NotificationComponentByType from '../components/NotificationsList/NotificationComponentByType';
import nullthrows from 'nullthrows';

const ENTER_ANIMATION_DURATION = 300;
const EXIT_ANIMATION_DURATION = 300;

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
    position: 'absolute',
    width: '100%',
    zIndex: 99999999,
  },
  notificationContainer: {
    borderColor: COLORS.secondary3,
    borderRadius: 4,
    borderWidth: 1,
    shadowColor: '#000000',
    shadowOffset: {
      height: 1,
      width: 0,
    },
    shadowOpacity: 0.8,
    shadowRadius: 4,
    width: '100%',
  },
  text: {
    textAlign: 'center',
  },
  textContainer: {
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.7)',
    justifyContent: 'center',
    padding: 12,
    width: 300,
  },
  textDanger: {
    color: COLORS.danger,
  },
  textDefault: {
    color: COLORS.textInverse,
  },
  textSuccess: {
    color: COLORS.success,
  },
});

const OFFSET = 20;

const onItemOpen = (notification: Notification) => {
  NotificationsStore.deleteByID(notification.id);
};

const TextMessage = ({
  style = 'default',
  text,
}: {
  style?: 'default' | 'danger' | 'success';
  text: string;
}) => {
  let dynamicTextStyle = null;
  switch (style) {
    case 'danger': {
      dynamicTextStyle = styles.textDanger;
      break;
    }
    case 'success': {
      dynamicTextStyle = styles.textSuccess;
      break;
    }
    default: {
      dynamicTextStyle = styles.textDefault;
    }
  }

  return (
    <View style={styles.textContainer}>
      <Text numberOfLines={2} style={[styles.text, dynamicTextStyle]}>
        {text}
      </Text>
    </View>
  );
};

const Content = ({
  message,
}: {
  message: SnackBarMessage;
}): React.ReactElement | null => {
  if (message.type === 'text') {
    return <TextMessage style={message.style} text={message.text} />;
  }
  let snackContent = null;
  if (message.type === 'content') {
    snackContent = message.content;
  } else if (message.type === 'notification') {
    const componentProps = {
      isSwipeable: false,
      notification: message.notification,
      onOpen: onItemOpen,
      onPress: NotificationsStore.onNotificationPress,
      onReadEnd: () => {},
    } as const;
    snackContent = <NotificationComponentByType {...componentProps} />;
  } else {
    return null;
  }

  return (
    <View style={{ padding: 10, width: '100%' }}>
      <View style={styles.notificationContainer}>{snackContent}</View>
    </View>
  );
};

export const SnackBar: React.FC = () => {
  const [height, setHeight] = React.useState<number>(0);
  const animationValue = React.useRef(new Animated.Value(-OFFSET)).current;
  const dropCurrentMessage = useRemoveSnackBarMessage();
  const currentMessage = useGetCurrentSnackBarMessage();

  const _onMessagePress = () => {
    Animated.timing(animationValue, {
      duration: EXIT_ANIMATION_DURATION,
      toValue: -height,
      useNativeDriver: false,
    }).start(dropCurrentMessage);
  };

  const _onLayout = (event: LayoutChangeEvent): void => {
    if (currentMessage === null || height !== 0) {
      return;
    }

    const { height: layoutHeight } = event.nativeEvent.layout;

    setHeight(layoutHeight);
    animationValue.setValue(-layoutHeight);

    Animated.sequence([
      Animated.timing(animationValue, {
        duration: ENTER_ANIMATION_DURATION,
        toValue: OFFSET,
        useNativeDriver: false,
      }),
      Animated.timing(animationValue, {
        delay: nullthrows(currentMessage).duration,
        duration: EXIT_ANIMATION_DURATION,
        toValue: -height,
        useNativeDriver: false,
      }),
    ]).start(({ finished }: Animated.EndResult) => {
      if (finished) {
        dropCurrentMessage();
      }
      setHeight(0);
    });
  };

  if (!currentMessage) {
    return null;
  }

  return (
    <Animated.View
      onLayout={height === 0 ? _onLayout : undefined}
      pointerEvents="box-none"
      style={[
        styles.container,
        currentMessage.position === 'bottom'
          ? { bottom: animationValue, top: undefined }
          : { bottom: undefined, top: animationValue },
      ]}
    >
      <TouchableWithoutFeedback onPress={_onMessagePress}>
        <Content message={currentMessage} />
      </TouchableWithoutFeedback>
    </Animated.View>
  );
};
