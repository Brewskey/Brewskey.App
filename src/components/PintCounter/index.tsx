import * as React from 'react';

import { EntityID } from '@brewskey/js-api';
import { StyleSheet, Text, View } from 'react-native';

import { Pint } from 'components/PintCounter/Pint';
import { COLORS } from 'theme';
import { createRange } from 'utils';

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

interface Props {
  beverageID: EntityID | null | undefined;
  ounces: number;
}

const PintCounter = ({ beverageID, ounces }: Props): React.ReactElement => {
  const pints = translateToPints(ounces);
  const wholePints = createRange(0, Math.floor(pints));
  const partialPintLevel = (pints % 1) * 100;

  return (
    <View style={styles.container}>
      {wholePints.length > 3 ? (
        <React.Fragment>
          <Text style={styles.countText}>x{wholePints.length}</Text>
          <Pint beverageID={beverageID} />
        </React.Fragment>
      ) : (
        wholePints.map(
          (index: number): React.ReactElement => (
            <Pint key={index} beverageID={beverageID} />
          ),
        )
      )}
      {partialPintLevel ? (
        <Pint beverageID={beverageID} level={partialPintLevel} />
      ) : null}
    </View>
  );
};

export { PintCounter };
