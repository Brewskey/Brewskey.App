import * as React from 'react';
import { StyleSheet } from 'react-native';
import ListItem from './ListItem';
import { COLORS } from '../theme';

const styles = StyleSheet.create({
  selected: {
    backgroundColor: COLORS.primary4,
  },
});

type Props<TEntity> = {
  isSelected: boolean;
  item: TEntity;
  title: React.ReactNode;
  subtitle?: React.ReactNode;
  chevron?: boolean;
  onPress?: () => void;
  testID?: string;
};

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
      item={item}
      title={title}
      subtitle={subtitle}
      chevron={chevron}
      onPress={onPress}
      containerStyle={isSelected ? styles.selected : undefined}
      testID={testID}
    />
  );
}

export default SelectableListItem;
