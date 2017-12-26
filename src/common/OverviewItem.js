// @flow

import * as React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Icon } from 'react-native-elements';
import { TYPOGRAPHY } from '../theme';

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    paddingHorizontal: 15,
  },
  titleText: {
    ...TYPOGRAPHY.paragraph,
    fontWeight: 'bold',
  },
  valueText: {
    ...TYPOGRAPHY.paragraph,
    marginLeft: 'auto',
  },
});

type Props = {|
  iconName?: string,
  iconType?: string, // todo grab enum from rn-elements repo
  title?: string,
  value: string,
|};

const OverviewItem = ({ iconName, iconType, title, value }: Props) => (
  <View style={styles.container}>
    {iconName && <Icon name={iconName} type={iconType} />}
    <Text style={styles.titleText}>{title}</Text>
    <Text style={styles.valueText}>{value}</Text>
  </View>
);

export default OverviewItem;
