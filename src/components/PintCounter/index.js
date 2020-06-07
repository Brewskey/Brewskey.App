// @flow

import type { EntityID } from 'brewskey.js-api';

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

const translateToPints = (ounces: number): number => ounces / 16;

type Props = {|
  beverageID: ?EntityID,
  ounces: number,
|};

const PintCounter = ({ beverageID, ounces }: Props): React.Node => {
  const pints = translateToPints(ounces.toFixed(1));
  const wholePints = createRange(0, Math.floor(pints));
  const partialPintLevel = (pints % 1) * 100;

  return (
    <View style={styles.container}>
      {wholePints.length > 3 ? (
        <Fragment>
          <Text style={styles.countText}>x{wholePints.length}</Text>
          <Pint beverageID={beverageID} />
        </Fragment>
      ) : (
        wholePints.map((index: number): React.Node => (
          <Pint beverageID={beverageID} key={index} />
        ))
      )}
      {partialPintLevel ? (
        <Pint beverageID={beverageID} level={partialPintLevel} />
      ) : null}
    </View>
  );
};

export default PintCounter;
