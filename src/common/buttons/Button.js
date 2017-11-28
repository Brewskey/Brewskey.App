// @flow

import * as React from 'react';
import { Button as RNEButton } from 'react-native-elements';

import { COLORS } from '../../theme';

type Props = {
  // react-native-elemenets button porps
};

const Button = (props: Props) => (
  <RNEButton
    color={COLORS.textInverse}
    backgroundColor={COLORS.primary2}
    {...props}
  />
);

export default Button;
