// @flow

import * as React from 'react';
import { StyleSheet } from 'react-native';
import { Button as RNEButton } from 'react-native-elements';

import { COLORS } from '../../theme';

const styles = StyleSheet.create({
  secondaryDisabledButton: {
    backgroundColor: COLORS.primary,
  },
  secondaryDisabledText: {
    color: COLORS.textInverse,
  },
});

type Props = {
  backgroundColor?: string,
  color?: string,
  secondary?: boolean,
  // react-native-elemenets button porps
};

const Button = ({
  backgroundColor = COLORS.primary2,
  color = COLORS.textInverse,
  secondary,
  ...rest
}: Props) => (
  <RNEButton
    disabledTextStyle={secondary && styles.secondaryDisabledText}
    disabledStyle={secondary && styles.secondaryDisabledButton}
    backgroundColor={secondary ? COLORS.secondary : backgroundColor}
    color={secondary ? COLORS.text : color}
    {...rest}
  />
);

export default Button;
