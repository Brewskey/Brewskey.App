import * as React from 'react';
import { StyleSheet, View, type StyleProp, type ViewStyle } from 'react-native';
import { COLORS, getElevationStyle } from '../theme';

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

type Props = {
  bottomPadded?: boolean,
  children?: React.ReactNode,
  innerContainerStyle?: StyleProp<ViewStyle>
};

const Section: React.FC<Props> = ({ bottomPadded, children, innerContainerStyle }) => {
  const innerElement = (
    <View
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

export default Section;
