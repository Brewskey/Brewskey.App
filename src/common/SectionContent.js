// @flow

import type { Style } from '../types';

import * as React from 'react';
import { View } from 'react-native';

type Props = {|
  centered?: boolean,
  children?: React.Node,
  containerStyle?: Style,
  paddedHorizontal?: boolean,
  paddedVertical?: boolean,
|};

const SectionContent = ({
  centered,
  children,
  containerStyle,
  paddedHorizontal,
  paddedVertical = true,
}: Props): React.Node => (
  <View
    style={[
      centered && { alignItems: 'center', justifyContent: 'center' },
      paddedHorizontal && { paddingHorizontal: 12 },
      paddedVertical && { paddingVertical: 12 },
      containerStyle,
    ]}
  >
    {children}
  </View>
);

export default SectionContent;
