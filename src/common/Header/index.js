// @flow

import * as React from 'react';
import { StyleSheet } from 'react-native';
import { Header as RNEHeader } from 'react-native-elements';
import HeaderDrawerButton from './HeaderDrawerButton';
import HeaderBackButton from './HeaderBackButton';
import { COLORS, TYPOGRAPHY } from '../../theme';

const styles = StyleSheet.create({
  innerContainer: {
    alignItems: 'center',
  },
  outerContainer: {
    backgroundColor: COLORS.primary2,
    elevation: 2,
    height: 60,
    paddingVertical: 0,
  },
  title: {
    ...TYPOGRAPHY.heading,
    color: COLORS.textInverse,
  },
});

type Props = {
  leftComponent?: React.ComponentType<any> | React.Node,
  rightComponent?: React.ComponentType<any> | React.Node,
  showBackButton?: boolean,
  title?: string,
};

class Header extends React.PureComponent<Props> {
  render() {
    const { leftComponent, rightComponent, showBackButton, title } = this.props;

    let LeftComponent = <HeaderDrawerButton />;
    if (showBackButton) {
      LeftComponent = <HeaderBackButton />;
    }
    if (leftComponent) {
      LeftComponent = leftComponent;
    }

    return (
      <RNEHeader
        statusBarProps={{
          backgroundColor: COLORS.primary3,
        }}
        centerComponent={{ style: styles.title, text: title }}
        leftComponent={LeftComponent}
        innerContainerStyles={styles.innerContainer}
        outerContainerStyles={styles.outerContainer}
        rightComponent={rightComponent}
      />
    );
  }
}

export default Header;
