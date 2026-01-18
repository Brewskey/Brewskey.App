import * as React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { COLORS, TYPOGRAPHY } from '../theme';
import TouchableItem from './buttons/TouchableItem';
import { Icon } from '@rneui/themed';

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
  message: string;
  onPress: () => void;
};

const WarningNotification: React.FC<Props> = ({ message, onPress }) => {
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
};

export default WarningNotification;
