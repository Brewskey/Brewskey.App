import { StyleSheet, View } from 'react-native';

import { COLORS } from 'theme';

import type { ReactElement } from 'react';

const styles = StyleSheet.create({
  separator: {
    backgroundColor: COLORS.secondary2,
    height: 4,
  },
});

const ListSubSectionSeparator = (): ReactElement => (
  <View style={styles.separator} />
);

export { ListSubSectionSeparator };
