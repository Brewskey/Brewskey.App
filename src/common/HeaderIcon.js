// @flow

import * as React from 'react';
import { StyleSheet } from 'react-native';
import { Icon } from 'react-native-elements';

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    backgroundColor: 'transparent',
    flexDirection: 'row',
  },
  icon: {
    height: 24,
    margin: 16,
    width: 24,
  },
});

type Props = {|
  name: string,
  onPress: () => void,
|};

const HeaderIcon = ({ name, onPress }: Props): React.Element<*> => (
  <Icon
    containerStyle={styles.container}
    iconStyle={styles.icon}
    name={name}
    onPress={onPress}
  />
);

export default HeaderIcon;
