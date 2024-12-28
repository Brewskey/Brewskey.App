import * as React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { TYPOGRAPHY } from '../theme';
import { Icon } from '@rneui/themed';

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    paddingBottom: 4,
    paddingHorizontal: 12,
  },
  titleText: {
    ...TYPOGRAPHY.paragraph,
    flex: 0,
    fontWeight: 'bold',
    marginRight: 12,
  },
  valueText: {
    ...TYPOGRAPHY.paragraph,
    flex: 1,
    marginLeft: 'auto',
  },
});

type Props = {
  iconName?: string;
  iconType?: string; // todo grab enum from rn-elements repo,
  title?: string;
  value: React.ReactNode;
};

const OverviewItem = ({
  iconName,
  iconType,
  title,
  value,
}: Props): React.ReactElement => (
  <View style={styles.container}>
    {iconName ? <Icon name={iconName} type={iconType} /> : null}
    <Text style={styles.titleText}>{title}</Text>
    <Text style={styles.valueText}>{value}</Text>
  </View>
);

export default OverviewItem;
