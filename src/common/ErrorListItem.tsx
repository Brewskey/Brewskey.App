import type { LoaderErrorRowProps } from './LoaderRow';

import * as React from 'react';
import { StyleProp, StyleSheet, ViewStyle } from 'react-native';
import { COLORS } from '../theme';
import { Icon, ListItem } from '@rneui/themed';

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

class ErrorListItem extends React.PureComponent<Props> {
  render(): React.ReactElement {
    const { error: _, ...otherProps } = this.props;
    return (
      <ListItem
        {...otherProps}
        containerStyle={[styles.container, this.props.containerStyle]}
      >
        <Icon name="error" />
        <ListItem.Content>
          <ListItem.Title style={styles.titleStyle}>Error</ListItem.Title>
        </ListItem.Content>
      </ListItem>
    );
  }
}

export default ErrorListItem;
