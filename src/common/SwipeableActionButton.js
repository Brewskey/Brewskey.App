// @flow

import type { Style } from '../types';

import * as React from 'react';
import { StyleSheet } from 'react-native';
import IconButton from './buttons/IconButton';

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    height: '100%',
    justifyContent: 'center',
    width: 75,
  },
});

type Props<TIconProps> = {|
  ...TIconProps,
  containerStyle?: Style,
  iconName: string,
  onPress?: () => void,
|};

const SwipeableActionButton = <TIconProps>({
  containerStyle,
  iconName,
  onPress,
  ...rest
}: Props<TIconProps>): React.Node => (
  <IconButton
    {...rest}
    containerStyle={[styles.container, containerStyle]}
    name={iconName}
    onPress={onPress}
  />
);

export default SwipeableActionButton;
