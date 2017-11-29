// @flow

import * as React from 'react';
import { StyleSheet } from 'react-native';
import { Button as RNEButton } from 'react-native-elements';
import { COLORS } from '../../theme';

const styles = StyleSheet.create({
  active: {
    backgroundColor: COLORS.primary3,
  },
  button: {
    backgroundColor: COLORS.primary,
    justifyContent: 'flex-start',
  },
  container: {
    marginLeft: 0,
    width: '100%',
  },
  textStyle: {
    marginLeft: 20,
  },
});

type Props = {
  icon: { name: string, type?: string },
  isActive?: boolean,
  // other RNEButton Props
};

class DrawerButton extends React.PureComponent<Props> {
  render() {
    const { icon, isActive, ...rest } = this.props;
    return (
      <RNEButton
        icon={{ ...icon, color: COLORS.secondary2, size: 20 }}
        containerViewStyle={styles.container}
        buttonStyle={[styles.button, isActive && styles.active]}
        {...rest}
        styles={[styles.button, isActive && styles.active]}
        textStyle={styles.textStyle}
      />
    );
  }
}

export default DrawerButton;
