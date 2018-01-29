// @flow

import type { ViewStyleProp } from '../../types';

import * as React from 'react';
import { StyleSheet } from 'react-native';
import IconButton from '../buttons/IconButton';

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    height: '100%',
    justifyContent: 'center',
    width: 75,
  },
});

type Props = {
  containerStyle?: ViewStyleProp,
  iconName: string,
  onPress?: () => void,
  // other IconProps
};

const SwipeableActionButton = ({
  containerStyle,
  iconName,
  onPress,
  ...rest
}: Props) => (
  <IconButton
    {...rest}
    containerStyle={[styles.container, containerStyle]}
    name={iconName}
    onPress={onPress}
  />
);

export default SwipeableActionButton;
