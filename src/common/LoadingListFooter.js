// @flow

import * as React from 'react';
import { ActivityIndicator, StyleSheet, View } from 'react-native';

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    paddingVertical: 15,
  },
});

type Props = {|
  isLoading: boolean,
|};

class LoadingListFooter extends React.PureComponent<Props> {
  render() {
    return !this.props.isLoading ? null : (
      <View style={styles.container}>
        <ActivityIndicator size="large" />
      </View>
    );
  }
}

export default LoadingListFooter;
