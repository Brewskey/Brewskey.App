// @flow

import * as React from 'react';
import { StyleSheet, Text } from 'react-native';
import { COLORS } from '../theme';

const styles = StyleSheet.create({
  container: {
    backgroundColor: COLORS.secondary2,
    paddingVertical: 8,
    textAlign: 'center',
  },
});

type Props = {|
  title: string,
|};

class ListSectionHeader extends React.PureComponent<Props> {
  render(): React.Node {
    return <Text style={styles.container}>{this.props.title}</Text>;
  }
}

export default ListSectionHeader;
