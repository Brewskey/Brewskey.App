import { View } from 'react-native';

import type { ReactElement } from 'react';

interface Props {
  color: string;
  size?: number;
}

const ColorIcon = ({ size = 45, color }: Props): ReactElement => (
  <View
    style={{
      backgroundColor: color,
      borderRadius: size / 2,
      height: size,
      width: size,
    }}
  />
);

export { ColorIcon };
