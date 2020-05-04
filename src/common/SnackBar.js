// @flow

import type { SnackBarMessage } from '../stores/SnackBarStore';
import type { Notification } from '../stores/NotificationsStore';
import type AnimatedValue from 'react-native/Libraries/Animated/src/nodes/AnimatedValue';

import * as React from 'react';
import { observer } from 'mobx-react';
import {
  Animated,
  StyleSheet,
  Text,
  TouchableWithoutFeedback,
  View,
} from 'react-native';
import { COLORS } from '../theme';
import NotificationsStore from '../stores/NotificationsStore';
import SnackBarStore from '../stores/SnackBarStore';
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

type State = {|
  animationValue: Object, // typeof Animated.Value,
  height: number,
|};

const OFFSET = 20;

@observer
class SnackMessage extends React.Component<{||}, State> {
  state: State = {
    animationValue: new Animated.Value(-OFFSET),
    height: 0,
  };

  _onMessagePress = () => {
    Animated.timing(this.state.animationValue, {
      duration: EXIT_ANIMATION_DURATION,
      toValue: -this.state.height,
      useNativeDriver: true,
    }).start(SnackBarStore.dropCurrentMessage);
  };

  _onLayout = (event) => {
    const { currentMessage } = SnackBarStore;
    if (currentMessage === null || this.state.height !== 0) {
      return;
    }

    const { height } = event.nativeEvent.layout;

    this.setState(() => ({
      height,
    }));

    this.state.animationValue.setValue(-height);

    Animated.sequence([
      Animated.timing(this.state.animationValue, {
        duration: ENTER_ANIMATION_DURATION,
        toValue: OFFSET,
        useNativeDriver: true,
      }),
      Animated.timing(this.state.animationValue, {
        delay: nullthrows(currentMessage).duration,
        duration: EXIT_ANIMATION_DURATION,
        toValue: -height,
        useNativeDriver: true,
      }),
    ]).start(({ finished }: { finished: boolean }) => {
      finished && SnackBarStore.dropCurrentMessage();
      this.setState(() => ({ height: 0 }));
    });
  };

  render(): React.Node {
    const { currentMessage } = SnackBarStore;
    if (!currentMessage) {
      return null;
    }

    return (
      <Animated.View
        onLayout={this.state.height === 0 ? this._onLayout : null}
        pointerEvents="box-none"
        style={[
          styles.container,
          currentMessage.position === 'bottom'
            ? { bottom: this.state.animationValue, top: undefined }
            : { bottom: undefined, top: this.state.animationValue },
        ]}
      >
        <TouchableWithoutFeedback onPress={this._onMessagePress}>
          <Content message={currentMessage} />
        </TouchableWithoutFeedback>
      </Animated.View>
    );
  }
}

const onItemOpen = (notification: Notification) => {
  NotificationsStore.deleteByID(notification.id);
};

const Content = ({ message }: {| message: SnackBarMessage |}): React.Node => {
  if (message.text) {
    return <TextMessage style={message.style} text={message.text} />;
  }
  let snackContent = null;
  if (message.content != null) {
    snackContent = message.content;
  } else if (message.notification != null) {
    const componentProps = {
      isSwipeable: false,
      notification: message.notification,
      onOpen: onItemOpen,
      onPress: NotificationsStore.onNotificationPress,
      onReadEnd: () => {},
    };
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

const TextMessage = ({
  style = 'default',
  text,
}: {|
  style?: 'default' | 'danger' | 'success',
  text: string,
|}) => {
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

export default SnackMessage;
