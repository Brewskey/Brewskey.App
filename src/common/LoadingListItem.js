// @flow

import * as React from 'react';
import { StyleSheet } from 'react-native';
import { getRandomInt } from '../utils';
import { ListItem as RNEListItem } from 'react-native-elements';

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'white',
  },
  subtitleContainerStyle: {
    backgroundColor: '#eee',
  },
  subtitleStyle: {
    color: '#eee',
  },
  titleContainerStyle: {
    backgroundColor: '#eee',
  },
  titleStyle: {
    color: '#eee',
  },
});

type Props = {
  containerStyle?: Object,
};

class LoadingListItem extends React.PureComponent<Props> {
  render() {
    return (
      <RNEListItem
        {...this.props}
        hideChevron
        subtitle="none"
        subtitleContainerStyle={[
          styles.subtitleContainerStyle,
          { width: `${getRandomInt(60, 80)}%` },
        ]}
        subtitleStyle={styles.subtitleStyle}
        title="none"
        titleContainerStyle={[
          styles.titleContainerStyle,
          {
            width: `${getRandomInt(30, 50)}%`,
          },
        ]}
        titleStyle={styles.titleStyle}
        containerStyle={[styles.container, this.props.containerStyle]}
      />
    );
  }
}

export default LoadingListItem;
