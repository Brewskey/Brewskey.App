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

export type Props<TRNEProps> = {|
  ...TRNEProps,
  icon: {| name: string, type?: string |},
  isActive?: boolean,
  // other RNEButton Props
|};

class MenuButton<TRNEProps> extends React.PureComponent<Props<TRNEProps>> {
  render(): React.Node {
    const { icon, isActive, ...rest } = this.props;
    return (
      <RNEButton
        icon={{ ...icon, color: COLORS.textFaded, size: 20 }}
        containerViewStyle={styles.container}
        buttonStyle={[styles.button, isActive && styles.active]}
        {...rest}
        textStyle={styles.textStyle}
      />
    );
  }
}

export default MenuButton;
