// @flow

import * as React from 'react';
import { StyleSheet } from 'react-native';
import { getRandomInt } from '../utils';
import { COLORS } from '../theme';
import { ListItem as RNEListItem } from 'react-native-elements';

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

type Props = {
  containerStyle?: Object,
};

class LoadingListItem extends React.PureComponent<Props> {
  _subtitleContainerWidth = `${getRandomInt(60, 80)}%`;
  _titleContainerWidth = `${getRandomInt(30, 50)}%`;

  render() {
    return (
      <RNEListItem
        {...this.props}
        hideChevron
        subtitle="none"
        subtitleContainerStyle={[
          styles.subtitleContainerStyle,
          { width: this._subtitleContainerWidth },
        ]}
        subtitleStyle={styles.subtitleStyle}
        title="none"
        titleContainerStyle={[
          styles.titleContainerStyle,
          {
            width: this._titleContainerWidth,
          },
        ]}
        titleStyle={styles.titleStyle}
        containerStyle={[styles.container, this.props.containerStyle]}
      />
    );
  }
}

export default LoadingListItem;
