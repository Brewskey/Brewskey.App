// @flow

// the component fixes touchable feedback for react-native-elements Icon
// the current version works only for raised=false icon.
import type { ViewStyleProp } from '../../types';

import * as React from 'react';
import { StyleSheet } from 'react-native';
import { Icon } from 'react-native-elements';
import TouchableItem from './TouchableItem';

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 10,
  },
});

type Props = {
  containerStyle?: ViewStyleProp,
  onPress?: () => void,
  // react-native-elements icon props
};

// todo fix ripple out of boundaries on raised buttons
const IconButton = ({ containerStyle, onPress, ...rest }: Props) => (
  <TouchableItem borderless onPress={onPress} style={containerStyle}>
    <Icon {...rest} containerStyle={styles.container} />
  </TouchableItem>
);

export default IconButton;
