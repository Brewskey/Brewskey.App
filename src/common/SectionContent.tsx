import * as React from 'react';

import { View } from 'react-native';

import type { StyleProp, ViewStyle } from 'react-native';

interface Props {
  centered?: boolean;
  children?: React.ReactNode;
  containerStyle?: StyleProp<ViewStyle>;
  paddedHorizontal?: boolean;
  paddedVertical?: boolean;
  testID?: string;
}

const SectionContent = ({
  centered,
  children,
  containerStyle,
  paddedHorizontal,
  paddedVertical = true,
  testID,
}: Props): React.ReactElement => (
  <View
    testID={testID}
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

export { SectionContent };
