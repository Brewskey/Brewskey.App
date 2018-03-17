// @flow

import * as React from 'react';
import { StyleSheet, View, Text } from 'react-native';
import { calculateKegLevel } from '../utils';
import { COLORS, TYPOGRAPHY } from '../theme';

const LOW_KEG_LEVEL = 10;

const styles = StyleSheet.create({
  container: {
    backgroundColor: COLORS.secondary,
    elevation: 1,
    height: 50,
    justifyContent: 'center',
  },
  filledBar: {
    backgroundColor: COLORS.accent,
    height: 50,
    left: 0,
    position: 'absolute',
    width: '30%',
  },
  filledBarDanger: {
    backgroundColor: COLORS.danger,
  },
  text: {
    ...TYPOGRAPHY.secondary,
    fontWeight: 'bold',
  },
  textDanger: {
    color: COLORS.danger,
  },
  textLeft: {
    color: COLORS.textInverse,
    marginLeft: 15,
    marginRight: 'auto',
  },
  textRight: {
    color: COLORS.text,
    marginLeft: 'auto',
    marginRight: 15,
  },
});

type Props = {|
  maxOunces: number,
  ounces: number,
|};

class KegLevelBar extends React.PureComponent<Props> {
  render() {
    const { maxOunces, ounces } = this.props;
    const kegLevel = calculateKegLevel(ounces, maxOunces);
    const isLowLevel = kegLevel <= LOW_KEG_LEVEL;
    const levelText = isLowLevel
      ? `Low keg level: ${kegLevel}%`
      : `${kegLevel}%`;

    return (
      <View style={styles.container}>
        <View
          style={[
            styles.filledBar,
            { width: `${kegLevel}%` },
            isLowLevel && styles.filledBarDanger,
          ]}
        />
        <Text
          style={[
            styles.text,
            kegLevel > 50 ? styles.textLeft : styles.textRight,
            isLowLevel && styles.textDanger,
          ]}
        >
          {levelText}
        </Text>
      </View>
    );
  }
}

export default KegLevelBar;
