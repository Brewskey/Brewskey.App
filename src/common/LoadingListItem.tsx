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

class LoadingListItem extends React.PureComponent<Props> {
  _subtitleContainerWidth = `${getRandomInt(60, 80)}%`;

  _titleContainerWidth = `${getRandomInt(30, 50)}%`;

  render(): React.ReactElement {
    const { containerStyle: _, ...otherProps } = this.props;
    return (
      <ListItem
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        {...(otherProps as any)}
        chevron={false}
        subtitle="none"
        subtitleStyle={[
          styles.subtitleContainerStyle,
          styles.subtitleStyle,
          // { width: this._subtitleContainerWidth },
        ]}
        title="none"
        titleStyle={[
          styles.titleContainerStyle,
          // {
          //   width: this._titleContainerWidth,
          // },
          styles.titleStyle,
        ]}
        containerStyle={[styles.container, this.props.containerStyle]}
      />
    );
  }
}

export default LoadingListItem;
