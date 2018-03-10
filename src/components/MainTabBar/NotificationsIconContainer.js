// @flow

import * as React from 'react';
import { StyleSheet, View } from 'react-native';
import { observer } from 'mobx-react';
import NotificationsStore from '../../stores/NotificationsStore';
import { COLORS } from '../../theme';
import TouchableItem from '../../common/buttons/TouchableItem';

const styles = StyleSheet.create({
  unreadIndicator: {
    backgroundColor: COLORS.primary2,
    borderColor: COLORS.secondary,
    borderRadius: 6,
    borderWidth: 1,
    height: 12,
    left: 14,
    position: 'absolute',
    top: 0,
    width: 12,
    zIndex: 10,
  },
});

type Props = {
  children?: React.Node,
  // touchableItem props
};

@observer
class NotificationsIconContainer extends React.Component<Props> {
  render() {
    const { children } = this.props;

    return (
      <TouchableItem {...this.props}>
        <View>
          {children}
          {NotificationsStore.hasUnread && (
            <View style={styles.unreadIndicator} />
          )}
        </View>
      </TouchableItem>
    );
  }
}

export default NotificationsIconContainer;
