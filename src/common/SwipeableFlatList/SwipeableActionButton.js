// @flow

import * as React from 'react';
import { StyleSheet } from 'react-native';
import { Icon } from 'react-native-elements';

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    height: '100%',
    justifyContent: 'center',
    width: 75,
  },
});

type Props = {|
  onPress: () => void,
  iconName: string,
|};

const SwipeableActionButton = ({ onPress, iconName }: Props): React.Node => (
  <Icon containerStyle={styles.container} onPress={onPress} name={iconName} />
);

export default SwipeableActionButton;
