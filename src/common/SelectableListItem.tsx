import * as React from 'react';

import { StyleSheet } from 'react-native';

import ListItem from './ListItem';
import { COLORS } from '../theme';

const styles = StyleSheet.create({
  selected: {
    backgroundColor: COLORS.primary4,
  },
});

interface Props<TEntity> {
  isSelected: boolean;
  item: TEntity;
  title: React.ReactNode;
  subtitle?: React.ReactNode;
  chevron?: boolean;
  onPress?: () => void;
  testID?: string;
}

function SelectableListItem<TEntity>({
  isSelected,
  item,
  title,
  subtitle,
  chevron,
  onPress,
  testID,
}: Props<TEntity>): React.ReactElement {
  return (
    <ListItem
      chevron={chevron}
      containerStyle={isSelected ? styles.selected : undefined}
      item={item}
      onPress={onPress}
      subtitle={subtitle}
      testID={testID}
      title={title}
    />
  );
}

export default SelectableListItem;
