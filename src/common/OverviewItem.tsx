import * as React from 'react';

import { Icon } from '@rneui/themed';
import { StyleSheet, Text, View } from 'react-native';

import { TYPOGRAPHY } from '../theme';

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    paddingBottom: 4,
    paddingHorizontal: 12,
    alignItems: 'center',
  },
  titleText: {
    ...TYPOGRAPHY.paragraph,
    flex: 0,
    fontWeight: 'bold',
    marginRight: 12,
    textAlignVertical: 'center',
  },
  valueText: {
    ...TYPOGRAPHY.paragraph,
    flex: 1,
    marginLeft: 'auto',
    textAlign: 'right',
  },
  valueContainer: {
    flex: 1,
    marginLeft: 'auto',
    alignItems: 'flex-end',
    justifyContent: 'center',
  },
});

interface Props {
  iconName?: string;
  iconType?: string; // todo grab enum from rn-elements repo,
  title?: string;
  value: React.ReactNode;
  testID?: string;
}

const OverviewItem = ({
  iconName,
  iconType,
  title,
  value,
  testID,
}: Props): React.ReactElement => {
  const isStringValue = typeof value === 'string' || typeof value === 'number';

  // Generate testID from title if not provided
  const itemTestID =
    testID ||
    (title
      ? `overview-item-${title.toLowerCase().replace(/\s+/g, '-')}`
      : undefined);

  return (
    <View style={styles.container} testID={itemTestID}>
      {iconName ? <Icon name={iconName} type={iconType} /> : null}
      <Text style={styles.titleText}>{title}</Text>
      {isStringValue ? (
        <Text style={styles.valueText}>{value}</Text>
      ) : (
        <View style={styles.valueContainer}>{value}</View>
      )}
    </View>
  );
};

export default OverviewItem;
