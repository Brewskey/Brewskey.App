import { StyleSheet, Text } from 'react-native';

import { COLORS } from 'theme';

import type { FC } from 'react';

const styles = StyleSheet.create({
  container: {
    backgroundColor: COLORS.secondary2,
    paddingVertical: 8,
    textAlign: 'center',
  },
});

interface Props {
  title: string;
}

const ListSectionHeader: FC<Props> = ({ title }) => (
  <Text style={styles.container}>{title}</Text>
);

export { ListSectionHeader };
