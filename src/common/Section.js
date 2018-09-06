// @flow

import * as React from 'react';
import { StyleSheet, View } from 'react-native';
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

type Props = {|
  children?: React.Node,
  bottomPadded?: boolean,
|};

class Section extends React.PureComponent<Props> {
  render() {
    const { bottomPadded, children } = this.props;
    const innerElement = (
      <View
        style={[
          styles.innerContainer,
          bottomPadded && styles.innerContainerPadded,
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
  }
}

export default Section;
