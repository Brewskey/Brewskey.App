// @flow

import * as React from 'react';
import { StyleSheet } from 'react-native';
import { ListItem as RNEListItem } from 'react-native-elements';

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'white',
  },
  subtitleStyle: {
    color: 'white',
  },
  titleStyle: {
    color: 'white',
  },
});

type Props = {
  containerStyle?: Object,
};

class ErrorListItem extends React.PureComponent<Props> {
  render() {
    return (
      <RNEListItem
        {...this.props}
        rightIcon={{ name: 'error' }}
        subtitle="none"
        subtitleStyle={styles.subtitleStyle}
        title="none"
        titleStyle={styles.titleStyle}
        containerStyle={[styles.container, this.props.containerStyle]}
      />
    );
  }
}

export default ErrorListItem;
