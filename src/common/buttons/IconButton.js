// @flow

// the component fixes touchable feedback for react-native-elements Icon
// the current version works only for raised=false icon.
import type { Style } from '../../types';

import * as React from 'react';
import { StyleSheet } from 'react-native';
import { Icon } from 'react-native-elements';
import TouchableItem from './TouchableItem';

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 10,
  },
});

type Props<TRNE> = {|
  // react-native-elements icon props
  ...TRNE,
  containerStyle?: Style,
  name: string,
  onPress?: () => void | Promise<void>,
|};

// todo fix ripple out of boundaries on raised buttons
const IconButton = <TRNE>({
  containerStyle,
  onPress,
  ...rest
}: Props<TRNE>): React.Node => (
  <TouchableItem borderless onPress={onPress} style={containerStyle}>
    <Icon {...rest} containerStyle={styles.container} />
  </TouchableItem>
);

export default IconButton;
