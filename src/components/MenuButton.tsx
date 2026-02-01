import * as React from 'react';

import { Icon } from '@rneui/themed';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { COLORS } from 'theme';

import type { PressableProps } from 'react-native';

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
  testID?: string;
  routeName?: string;
};

const MenuButtonComponent: React.FC<Props> = ({
  icon,
  isActive,
  onPress,
  title,
  testID,
  routeName: _routeName,
  ...pressableProps
}) => {
  const { pointerEvents, ...restProps } = pressableProps;

  return (
    <Pressable
      onPress={onPress}
      testID={testID}
      style={[
        styles.button,
        isActive && styles.active,
        pointerEvents && { pointerEvents },
      ]}
      {...restProps}
    >
      <View style={[styles.iconContainer, { pointerEvents: 'none' }]}>
        <Icon
          color={COLORS.textFaded}
          name={icon.name}
          size={20}
          type={icon.type}
        />
      </View>
      {title ? <Text style={styles.text}>{title}</Text> : null}
    </Pressable>
  );
};

export const MenuButton = React.memo(MenuButtonComponent);
