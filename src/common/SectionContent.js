// @flow

import * as React from 'react';
import { StyleSheet, View } from 'react-native';

const styles = StyleSheet.create({
  container: {
    paddingVertical: 12,
  },
});

type Props = {|
  children?: React.Node,
|};

const SectionContent = ({ children }: Props) => (
  <View style={styles.container}>{children}</View>
);

export default SectionContent;
