// @flow

import * as React from 'react';
import { View } from 'react-native';

type Props = {|
  children?: React.Node,
  paddedHorizontal?: boolean,
  paddedVertical?: boolean,
|};

const SectionContent = ({
  children,
  paddedVertical = true,
  paddedHorizontal = false,
}: Props) => (
  <View
    style={[
      paddedHorizontal && { paddingHorizontal: 12 },
      paddedVertical && { paddingVertical: 12 },
    ]}
  >
    {children}
  </View>
);

export default SectionContent;
