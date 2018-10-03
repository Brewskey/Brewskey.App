// @flow

import type { SnackBarMessage } from '../stores/SnackBarStore';

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
import SnackBarStore from '../stores/SnackBarStore';

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
    borderWidth: 1,
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
  animationValue: Object,
  height: number,
|};

const OFFSET = 20;

@observer
class SnackMessage extends React.Component<{}, State> {
  state = {
    animationValue: new Animated.Value(-OFFSET),
    height: 0,
  };

  _onMessagePress = () => {
    Animated.timing(this.state.animationValue, {
      duration: EXIT_ANIMATION_DURATION,
      toValue: -this.state.height,
    }).start(SnackBarStore.dropCurrentMessage);
  };

  _onLayout = event => {
    if (SnackBarStore.currentMessage === null || this.state.height !== 0) {
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
      }),
      Animated.timing(this.state.animationValue, {
        delay: SnackBarStore.currentMessage.duration,
        duration: EXIT_ANIMATION_DURATION,
        toValue: -height,
      }),
    ]).start(({ finished }: { finished: boolean }) => {
      finished && SnackBarStore.dropCurrentMessage();
      this.setState(() => ({ height: 0 }));
    });
  };

  render() {
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
          <Content {...currentMessage} />
        </TouchableWithoutFeedback>
      </Animated.View>
    );
  }
}

const Content = (props: SnackBarMessage) => {
  if (props.text) {
    return <TextMessage style={props.style} text={props.text} />;
  } else if (props.content) {
    return (
      <View style={{ padding: 10, width: '100%' }}>
        <View style={styles.notificationContainer}>{props.content}</View>
      </View>
    );
  }

  return null;
};

const TextMessage = ({
  style = 'default',
  text,
}: {
  style?: 'default' | 'danger' | 'success',
  text: string,
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

export default SnackMessage;
