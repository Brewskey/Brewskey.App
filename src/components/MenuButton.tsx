import * as React from 'react';
import { StyleSheet } from 'react-native';
import { COLORS } from '../theme';
import { Button } from '@rneui/themed';

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

export type Props = Omit<React.ComponentProps<typeof Button>, 'icon'> & {
  icon: {
    name: string;
    type?: string;
  };
  isActive?: boolean;
  // other RNEButton Props
};

class MenuButton extends React.PureComponent<Props> {
  render(): React.ReactElement {
    const { icon, isActive, ...rest } = this.props;
    return (
      <Button
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
