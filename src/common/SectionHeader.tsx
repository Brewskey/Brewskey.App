import * as React from 'react';

import { StyleSheet, Text, View } from 'react-native';

import { COLORS, TYPOGRAPHY } from 'theme';

// todo make better styles, may be add borders etc
const styles = StyleSheet.create({
  container: {
    backgroundColor: COLORS.secondary,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderColor: COLORS.secondary3,
    paddingVertical: 12,
  },
  title: {
    ...TYPOGRAPHY.secondary,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  subtitle: {
    ...TYPOGRAPHY.small,
    color: COLORS.textFaded,
    textAlign: 'center',
    marginTop: 4,
  },
});

interface Props {
  title: string;
  subtitle?: string;
  testID?: string;
}

const SectionHeader = ({
  title,
  subtitle,
  testID,
}: Props): React.ReactElement => (
  <View style={styles.container} testID={testID}>
    <Text style={styles.title}>{title}</Text>
    {subtitle ? <Text style={styles.subtitle}>{subtitle}</Text> : null}
  </View>
);

export { SectionHeader };
