import * as React from 'react';

import { StyleSheet } from 'react-native';

import { IconButton } from './buttons/IconButton';

import type { StyleProp, ViewStyle } from 'react-native';

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    height: '100%',
    justifyContent: 'center',
    width: 75,
  },
});

type Props<TIconProps> = TIconProps & {
  containerStyle?: StyleProp<ViewStyle>;
  iconName: string;
  onPress?: () => void;
};

const SwipeableActionButton = <TIconProps extends object>({
  containerStyle,
  iconName,
  onPress,
  ...rest
}: Props<TIconProps>): React.ReactElement => (
  <IconButton
    {...rest}
    containerStyle={[styles.container, containerStyle]}
    name={iconName}
    onPress={onPress}
  />
);

export { SwipeableActionButton };
