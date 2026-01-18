import * as React from 'react';
import { StyleSheet, View, Text, Pressable, PressableProps } from 'react-native';
import { COLORS } from '../theme';
import { Icon } from '@rneui/themed';

const styles = StyleSheet.create({
  active: {
    backgroundColor: COLORS.primary4,
  },
  button: {
    backgroundColor: COLORS.secondary,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
    paddingVertical: 12,
    paddingHorizontal: 16,
    width: '100%',
  },
  iconContainer: {
    marginRight: 20,
  },
  text: {
    color: COLORS.text,
    fontSize: 16,
  },
});

export type Props = Omit<PressableProps, 'style' | 'onPress'> & {
  icon: {
    name: string;
    type?: string;
  };
  isActive?: boolean;
  onPress?: () => void;
  title?: string;
};

const MenuButton: React.FC<Props> = ({ icon, isActive, onPress, title, ...pressableProps }) => {
  const { pointerEvents, ...restProps } = pressableProps;
  return (
    <Pressable
      onPress={onPress}
      style={[styles.button, isActive && styles.active, pointerEvents && { pointerEvents }]}
      {...restProps}
    >
      <View style={[styles.iconContainer, { pointerEvents: 'none' }]}>
        <Icon
          name={icon.name}
          type={icon.type}
          color={COLORS.textFaded}
          size={20}
        />
      </View>
      {title && <Text style={styles.text}>{title}</Text>}
    </Pressable>
  );
};

export default React.memo(MenuButton);
