import * as React from 'react';
import { StyleProp, View, ViewStyle } from 'react-native';

type Props = {
  centered?: boolean;
  children?: React.ReactNode;
  containerStyle?: StyleProp<ViewStyle>;
  paddedHorizontal?: boolean;
  paddedVertical?: boolean;
};

const SectionContent = ({
  centered,
  children,
  containerStyle,
  paddedHorizontal,
  paddedVertical = true,
}: Props): React.ReactElement => (
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
