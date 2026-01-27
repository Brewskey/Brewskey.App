import * as React from 'react';

import { StyleSheet } from 'react-native';

import { COLORS } from '../theme';
import { ListItem } from './ListItem';

import type { StyleProp, ViewStyle } from 'react-native';

const styles = StyleSheet.create({
  container: {
    backgroundColor: COLORS.secondary,
  },
  subtitleContainerStyle: {
    backgroundColor: COLORS.secondary2,
  },
  subtitleStyle: {
    // the same as background because we want to hide text content
    color: COLORS.secondary2,
  },
  titleContainerStyle: {
    backgroundColor: COLORS.secondary2,
  },
  titleStyle: {
    // the same as background because we want to hide text content
    color: COLORS.secondary2,
  },
});

type Props = React.ComponentProps<typeof ListItem> & {
  containerStyle?: StyleProp<ViewStyle>;
};

const LoadingListItem: React.FC<Props> = ({
  containerStyle,
  ...otherProps
}) => (
  <ListItem
    {...otherProps}
    chevron={false}
    containerStyle={[styles.container, containerStyle]}
    subtitle="none"
    subtitleStyle={[styles.subtitleContainerStyle, styles.subtitleStyle]}
    title="none"
    titleStyle={[styles.titleContainerStyle, styles.titleStyle]}
  />
);

export { LoadingListItem };
