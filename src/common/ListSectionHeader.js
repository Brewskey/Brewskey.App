// @flow

import * as React from 'react';
import { StyleSheet, Text } from 'react-native';
import { COLORS } from '../theme';

const styles = StyleSheet.create({
  headerContainer: {
    borderBottomColor: COLORS.outline,
    borderBottomWidth: 1,
    paddingVertical: 6,
    textAlign: 'center',
  },
});

type Props = {|
  title: string,
|};

class ListSectionHeader extends React.PureComponent<Props> {
  render() {
    return <Text style={styles.headerContainer}>{this.props.title}</Text>;
  }
}

export default ListSectionHeader;
