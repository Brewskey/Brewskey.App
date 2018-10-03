// @flow

import type { Notification } from '../../stores/NotificationsStore';

// imported from experimental sources
// eslint-disable-next-line
import RNSwipeableRow from 'SwipeableRow';

import * as React from 'react';
import { Animated, StyleSheet, Text, View } from 'react-native';
import { Icon } from 'react-native-elements';
import moment from 'moment';
import TouchableItem from '../../common/buttons/TouchableItem';
import { COLORS, TYPOGRAPHY } from '../../theme';

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
    backgroundColor: COLORS.secondary,
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

export type Props = {
  contentComponent?: React.Node,
  isSwipeable: boolean,
  leftComponent?: React.Node,
  notification: Notification,
  onOpen: (notification: Notification) => void,
  onPress: (notification: Notification) => void | Promise<any>,
  onReadEnd: (notification: Notification) => void,
};

type State = {
  readAnimationValue: Object,
};

class NotificationListItem extends React.PureComponent<Props, State> {
  _readAnimation: Object;

  static defaultProps = {
    isSwipeable: true,
  };

  state = {
    readAnimationValue: new Animated.Value(0),
  };

  componentDidMount() {
    const { readAnimationValue } = this.state;
    const {
      notification: { isRead },
    } = this.props;

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
      isSwipeable,
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

    const content = (
      <TouchableItem onPress={this._onPress}>
        <Animated.View style={[styles.container, { backgroundColor }]}>
          {LeftComponent}
          <View style={styles.mainContainer}>
            <Text style={styles.titleText}>{title}</Text>
            <Text style={styles.dateText}>{moment(date).fromNow()}</Text>
            <View style={styles.contentContainer}>{contentElement}</View>
          </View>
        </Animated.View>
      </TouchableItem>
    );

    if (!isSwipeable) {
      return content;
    }

    return (
      <RNSwipeableRow
        maxSwipeDistance={250}
        onOpen={this._onOpen}
        preventSwipeRight
        slideoutView={<SlideoutView />}
        swipeThreshold={250}
      >
        {content}
      </RNSwipeableRow>
    );
  }
}

const SlideoutView = () => (
  <View style={styles.slideoutContainer}>
    <Icon name="delete" color={COLORS.danger} />
  </View>
);

export default NotificationListItem;
