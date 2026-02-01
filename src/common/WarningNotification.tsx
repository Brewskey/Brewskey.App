import * as React from 'react';

import { Icon } from '@rneui/themed';
import { StyleSheet, Text, View } from 'react-native';

import { TouchableItem } from 'common/buttons/TouchableItem';
import { COLORS, TYPOGRAPHY } from 'theme';

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

interface Props {
  message: string;
  onPress: () => void;
}

const WarningNotification: React.FC<Props> = ({ message, onPress }) => (
  <TouchableItem onPress={onPress}>
    <View style={styles.container}>
      <Icon
        reverse
        color={COLORS.secondary2}
        name="priority-high"
        reverseColor={COLORS.accent}
        size={15}
      />
      <View style={styles.messageContainer}>
        <Text style={styles.messageText}>{message}</Text>
      </View>
    </View>
  </TouchableItem>
);

export { WarningNotification };
