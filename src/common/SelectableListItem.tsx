import * as React from 'react';
import { StyleSheet } from 'react-native';
import ListItem from './ListItem';
import { COLORS } from '../theme';

const styles = StyleSheet.create({
  selected: {
    backgroundColor: COLORS.primary4,
  },
});

type Props<TEntity> = React.ComponentProps<typeof ListItem> & {
  isSelected: boolean;
  item: TEntity;
};

const SelectableListItem = <TEntity,>({
  isSelected,
  ...rest
}: Props<TEntity>): React.ReactElement => (
  <ListItem {...rest} containerStyle={isSelected && styles.selected} />
);

export default SelectableListItem;
