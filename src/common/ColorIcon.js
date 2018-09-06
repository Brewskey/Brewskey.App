// @flow

import * as React from 'react';
import { View } from 'react-native';

type Props = {
  color: string,
  size?: number,
};

const ColorIcon = ({ size = 45, color }: Props) => (
  <View
    style={{
      backgroundColor: color,
      borderRadius: size / 2,
      height: size,
      width: size,
    }}
  />
);

export default ColorIcon;
