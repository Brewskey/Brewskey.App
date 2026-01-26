import * as React from 'react';

import { Icon, ListItem } from '@rneui/themed';
import { StyleSheet } from 'react-native';

import { COLORS } from '../theme';

import type { StyleProp, ViewStyle } from 'react-native';

import type { LoaderErrorRowProps } from './LoaderRowTypes';

const styles = StyleSheet.create({
  container: {
    backgroundColor: COLORS.secondary,
  },
  subtitleStyle: {
    color: COLORS.secondary,
  },
  titleStyle: {
    color: COLORS.secondary,
  },
});

type Props = LoaderErrorRowProps<{
  containerStyle?: StyleProp<ViewStyle>;
}>;

const ErrorListItem: React.FC<Props> = ({
  error: _,
  containerStyle,
  ...otherProps
}) => (
  <ListItem {...otherProps} containerStyle={[styles.container, containerStyle]}>
    <Icon name="error" />
    <ListItem.Content>
      <ListItem.Title style={styles.titleStyle}>Error</ListItem.Title>
    </ListItem.Content>
  </ListItem>
);

export default ErrorListItem;
