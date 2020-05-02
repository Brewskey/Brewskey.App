// @flow

import * as React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { createRange } from '../../utils';
import Fragment from '../../common/Fragment';
import Pint from './Pint';
import { COLORS } from '../../theme';

const styles = StyleSheet.create({
  container: {
    alignItems: 'flex-end',
    flexDirection: 'row',
  },
  countText: {
    color: COLORS.text,
    fontSize: 24,
    fontWeight: 'bold',
  },
});

const translateToPints = (ounces: number): number =>
  (Math.round(ounces) || 1) / 14;

type Props = {|
  ounces: number,
|};

const PintCounter = ({ ounces }: Props) => {
  const pints = translateToPints(ounces);
  const wholePints = createRange(0, Math.floor(pints));
  const partialPintLevel = (pints % 1) * 100;

  return (
    <View style={styles.container}>
      {wholePints.length > 3 ? (
        <Fragment>
          <Text style={styles.countText}>x{wholePints.length}</Text>
          <Pint />
        </Fragment>
      ) : (
        wholePints.map((index: number): React.Node => <Pint key={index} />)
      )}
      {partialPintLevel ? <Pint level={partialPintLevel} /> : null}
    </View>
  );
};

export default PintCounter;
