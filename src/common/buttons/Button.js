// @flow

import * as React from 'react';
import { Button as RNEButton } from 'react-native-elements';

import { COLORS } from '../../theme';

type Props = {
  backgroundColor?: string,
  color?: string,
  // react-native-elemenets button porps
};

const Button = ({
  backgroundColor = COLORS.primary2,
  color = COLORS.textInverse,
  ...rest
}: Props) => (
  <RNEButton color={color} backgroundColor={backgroundColor} {...rest} />
);

export default Button;
