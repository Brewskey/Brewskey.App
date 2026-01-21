import * as React from 'react';
import { StyleProp, View, ViewStyle } from 'react-native';

type Props = {
  centered?: boolean;
  children?: React.ReactNode;
  containerStyle?: StyleProp<ViewStyle>;
  paddedHorizontal?: boolean;
  paddedVertical?: boolean;
  testID?: string;
};

const SectionContent = ({
  centered,
  children,
  containerStyle,
  paddedHorizontal,
  paddedVertical = true,
  testID,
}: Props): React.ReactElement => (
  <View
    style={[
      centered && { alignItems: 'center', justifyContent: 'center' },
      paddedHorizontal && { paddingHorizontal: 12 },
      paddedVertical && { paddingVertical: 12 },
      containerStyle,
    ]}
    testID={testID}
  >
    {children}
  </View>
);

export default SectionContent;
