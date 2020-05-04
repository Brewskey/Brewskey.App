// @flow

import * as React from 'react';
import { StyleSheet } from 'react-native';
import ListItem from './ListItem';
import { COLORS } from '../theme';

const styles = StyleSheet.create({
  selected: {
    backgroundColor: COLORS.primary4,
  },
});

type Props<TEntity, RNE> = {|
  isSelected: boolean,
  item: TEntity,
  toggleItem: (item: TEntity) => void,
  // other react-native=elements ListItemProps
|};

const SelectableListItem = <TEntity, RNE>({
  isSelected,
  toggleItem,
  ...rest
}: Props<TEntity, RNE>): React.Node => (
  <ListItem
    {...rest}
    containerStyle={isSelected && styles.selected}
    onPress={toggleItem}
  />
);

export default SelectableListItem;
