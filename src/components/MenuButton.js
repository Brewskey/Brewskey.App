// @flow

import * as React from 'react';
import { StyleSheet } from 'react-native';
import { Button as RNEButton } from 'react-native-elements';
import { COLORS } from '../theme';

const styles = StyleSheet.create({
  active: {
    backgroundColor: COLORS.primary4,
  },
  button: {
    backgroundColor: COLORS.secondary,
    justifyContent: 'flex-start',
  },
  container: {
    marginLeft: 0,
    width: '100%',
  },
  textStyle: {
    color: COLORS.text,
    marginLeft: 20,
  },
});

export type Props = {|
  ...React.ElementProps<typeof RNEButton>,
  icon: {| name: string, type?: string |},
  isActive?: boolean,
  // other RNEButton Props
|};

class MenuButton extends React.PureComponent<Props> {
  render(): React.Node {
    const { icon, isActive, ...rest } = this.props;
    return (
      <RNEButton
        icon={{ ...icon, color: COLORS.textFaded, size: 20 }}
        containerStyle={styles.container}
        buttonStyle={[styles.button, isActive && styles.active]}
        {...rest}
        titleStyle={styles.textStyle}
      />
    );
  }
}

export default MenuButton;
