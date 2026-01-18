import * as React from 'react';
import { StyleSheet, Text } from 'react-native';
import { COLORS } from '../theme';

const styles = StyleSheet.create({
  container: {
    backgroundColor: COLORS.secondary2,
    paddingVertical: 8,
    textAlign: 'center',
  },
});

type Props = {
  title: string
};

const ListSectionHeader: React.FC<Props> = ({ title }) => {
  return <Text style={styles.container}>{title}</Text>;
};

export default ListSectionHeader;
