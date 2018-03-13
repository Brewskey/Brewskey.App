// @flow

import type { Notification } from '../../stores/NotificationsStore';

// imported from experimental sources
// eslint-disable-next-line
import RNSwipeableRow from 'SwipeableRow';

import * as React from 'react';
import {
  Animated,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { Icon } from 'react-native-elements';
import moment from 'moment';
import { COLORS, TYPOGRAPHY } from '../../theme';

const READ_TIMEOUT = 2000;

const styles = StyleSheet.create({
  container: {
    borderBottomColor: COLORS.secondary3,
    borderBottomWidth: 1,
    flexDirection: 'row',
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  contentContainer: {
    flex: 1,
  },
  dateText: {
    color: COLORS.textFaded,
  },
  headerContainer: {
    alignItems: 'baseline',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  mainContainer: {
    flex: 1,
    justifyContent: 'flex-start',
    paddingLeft: 12,
  },
  slideoutContainer: {
    backgroundColor: COLORS.secondary,
    borderBottomWidth: 1,
    borderColor: COLORS.secondary3,
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
  },
  titleText: {
    ...TYPOGRAPHY.secondary,
    color: COLORS.text,
    fontWeight: 'bold',
  },
});

const AnimatedTouchableOpacity = Animated.createAnimatedComponent(
  TouchableOpacity,
);

export type Props = {
  contentComponent?: React.Node,
  leftComponent?: React.Node,
  notification: Notification,
  onOpen: (notification: Notification) => void,
  onPress: (notification: Notification) => void | Promise<void>,
  onReadEnd: (notification: Notification) => void,
};

type State = {
  readAnimationValue: Object,
};

class NotificationListItem extends React.PureComponent<Props, State> {
  _readAnimation: Object;

  state = {
    readAnimationValue: new Animated.Value(0),
  };

  componentDidMount() {
    const { readAnimationValue } = this.state;
    const { notification: { isRead } } = this.props;

    this._readAnimation = Animated.timing(readAnimationValue, {
      duration: READ_TIMEOUT,
      toValue: 1,
    });

    !isRead && this._readAnimation.start(this._onReadEnd);
  }

  _onReadEnd = () => {
    const { notification, onReadEnd } = this.props;
    onReadEnd(notification);
  };

  _onPress = () => {
    const { notification, onPress } = this.props;
    this._onReadEnd();
    this._readAnimation.stop();
    onPress(notification);
  };

  _onOpen = () => this.props.onOpen(this.props.notification);

  render() {
    const { readAnimationValue } = this.state;
    const {
      contentComponent: ContentComponent,
      leftComponent: LeftComponent,
      notification: { body, date, isRead, title },
    } = this.props;

    const backgroundColor = isRead
      ? COLORS.secondary
      : readAnimationValue.interpolate({
          inputRange: [0, 1],
          outputRange: [COLORS.primary4, COLORS.secondary],
        });

    const contentElement = ContentComponent || (
      <View>
        <Text>{body}</Text>
      </View>
    );

    return (
      <RNSwipeableRow
        maxSwipeDistance={250}
        onOpen={this._onOpen}
        slideoutView={<SlideoutView />}
      >
        <AnimatedTouchableOpacity
          onPress={this._onPress}
          style={[styles.container, { backgroundColor }]}
        >
          {LeftComponent}
          <View style={styles.mainContainer}>
            <View style={styles.headerContainer}>
              <Text style={styles.titleText}>{title}</Text>
              <Text style={styles.dateText}>{moment(date).fromNow()}</Text>
            </View>
            <View style={styles.contentContainer}>{contentElement}</View>
          </View>
        </AnimatedTouchableOpacity>
      </RNSwipeableRow>
    );
  }
}

const SlideoutView = () => (
  <View style={styles.slideoutContainer}>
    <Icon name="delete" color={COLORS.textFaded} />
  </View>
);

export default NotificationListItem;
