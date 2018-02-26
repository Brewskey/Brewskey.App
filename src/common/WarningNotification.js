// @flow

import * as React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Icon } from 'react-native-elements';
import { COLORS, TYPOGRAPHY } from '../theme';
import TouchableItem from './buttons/TouchableItem';

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    flexDirection: 'row',
    overflow: 'hidden',
    paddingHorizontal: 8,
    paddingVertical: 8,
  },
  messageContainer: {
    flex: 1,
  },
  messageText: {
    ...TYPOGRAPHY.small,
    flexWrap: 'wrap',
  },
});

type Props = {
  message: string,
  onPress: () => void,
};

class WarningNotification extends React.PureComponent<Props> {
  render() {
    const { message, onPress } = this.props;
    return (
      <TouchableItem onPress={onPress}>
        <View style={styles.container}>
          <Icon
            color={COLORS.secondary2}
            name="priority-high"
            reverse
            reverseColor={COLORS.accent}
            size={15}
          />
          <View style={styles.messageContainer}>
            <Text style={styles.messageText}>{message}</Text>
          </View>
        </View>
      </TouchableItem>
    );
  }
}

export default WarningNotification;
