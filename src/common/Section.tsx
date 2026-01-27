import * as React from 'react';

import { StyleSheet, View } from 'react-native';

import { COLORS, getElevationStyle } from '../theme';

import type { StyleProp, ViewStyle } from 'react-native';

const styles = StyleSheet.create({
  innerContainer: {
    backgroundColor: COLORS.secondary,
  },
  innerContainerPadded: {
    ...getElevationStyle(1),
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderColor: COLORS.secondary2,
  },
  outerContainerPadded: {
    backgroundColor: COLORS.secondary2,
    paddingBottom: 12,
  },
});

interface Props {
  bottomPadded?: boolean;
  children?: React.ReactNode;
  innerContainerStyle?: StyleProp<ViewStyle>;
  testID?: string;
}

const Section: React.FC<Props> = ({
  bottomPadded,
  children,
  innerContainerStyle,
  testID,
}) => {
  const innerElement = (
    <View
      testID={testID}
      style={[
        styles.innerContainer,
        bottomPadded && styles.innerContainerPadded,
        innerContainerStyle,
      ]}
    >
      {children}
    </View>
  );

  return bottomPadded ? (
    <View style={styles.outerContainerPadded}>{innerElement}</View>
  ) : (
    innerElement
  );
};

export { Section };
