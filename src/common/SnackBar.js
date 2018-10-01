// @flow

import type { SnackBarMessage } from '../stores/SnackBarStore';

import * as React from 'react';
import { reaction } from 'mobx';
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

const ENTER_ANIMATION_DURATION = 200;
const EXIT_ANIMATION_DURATION = 200;

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    overflow: 'hidden',
    position: 'absolute',
    width: '100%',
    zIndex: 99999,
  },
  text: {
    textAlign: 'center',
  },
  textContainer: {
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.7)',
    height: 60,
    justifyContent: 'center',
    paddingHorizontal: 12,
    position: 'absolute',
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
  bottomAnimValue: Object,
|};

@observer
class SnackMessage extends React.Component<{}, State> {
  state = {
    bottomAnimValue: new Animated.Value(-60),
  };

  constructor(props: {}) {
    super(props);

    reaction(
      () => SnackBarStore.currentMessage,
      (currentMessage: ?SnackBarMessage) => {
        if (!currentMessage) {
          return;
        }
        // TODO - support top/bottom
        Animated.sequence([
          Animated.timing(this.state.bottomAnimValue, {
            duration: ENTER_ANIMATION_DURATION,
            toValue: 0,
          }),
          Animated.timing(this.state.bottomAnimValue, {
            delay:
              currentMessage.duration -
              ENTER_ANIMATION_DURATION -
              ENTER_ANIMATION_DURATION,
            duration: EXIT_ANIMATION_DURATION,
            toValue: -60,
          }),
        ]).start(({ finished }: { finished: boolean }) => {
          finished && SnackBarStore.dropCurrentMessage();
        });
      },
    );
  }

  _onMessagePress = () => {
    Animated.timing(this.state.bottomAnimValue, {
      duration: EXIT_ANIMATION_DURATION,
      toValue: 0,
    }).start(SnackBarStore.dropCurrentMessage);
  };

  render() {
    const { currentMessage } = SnackBarStore;
    if (!currentMessage) {
      return null;
    }

    return (
      <View pointerEvents="box-none" style={styles.container}>
        <TouchableWithoutFeedback onPress={this._onMessagePress}>
          <Animated.View style={{ bottom: this.state.bottomAnimValue }}>
            <Content {...currentMessage} />
          </Animated.View>
        </TouchableWithoutFeedback>
      </View>
    );
  }
}

const Content = (props: SnackBarMessage) => {
  if (props.text) {
    return <TextMessage style={props.style} text={props.text} />;
  } else if (props.content) {
    return props.content;
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
