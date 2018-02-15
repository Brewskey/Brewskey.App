// @flow

import type { Style } from '../types';

import * as React from 'react';
import { View } from 'react-native';

type Props = {|
  children?: React.Node,
  containerStyle?: Style,
  paddedHorizontal?: boolean,
  paddedVertical?: boolean,
|};

const SectionContent = ({
  children,
  containerStyle,
  paddedHorizontal = false,
  paddedVertical = true,
}: Props) => (
  <View
    style={[
      paddedHorizontal && { paddingHorizontal: 12 },
      paddedVertical && { paddingVertical: 12 },
      containerStyle,
    ]}
  >
    {children}
  </View>
);

export default SectionContent;
