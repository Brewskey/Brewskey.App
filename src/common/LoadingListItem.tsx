import * as React from 'react';
import { StyleProp, StyleSheet, ViewStyle } from 'react-native';
import { getRandomInt } from '../utils';
import { COLORS } from '../theme';
import ListItem from './ListItem';

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

const LoadingListItem: React.FC<Props> = ({ containerStyle, ...otherProps }) => {
  return (
    <ListItem
      {...otherProps}
      chevron={false}
      subtitle="none"
      subtitleStyle={[
        styles.subtitleContainerStyle,
        styles.subtitleStyle,
      ]}
      title="none"
      titleStyle={[
        styles.titleContainerStyle,
        styles.titleStyle,
      ]}
      containerStyle={[styles.container, containerStyle]}
    />
  );
};

export default LoadingListItem;
