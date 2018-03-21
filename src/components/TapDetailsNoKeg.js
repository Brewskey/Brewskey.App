// @flow

import type { EntityID } from 'brewskey.js-api';
import type { Navigation } from '../types';

import * as React from 'react';
import InjectedComponent from '../common/InjectedComponent';
import { StyleSheet, Text, TouchableOpacity } from 'react-native';
import { COLORS, TYPOGRAPHY } from '../theme';
import Container from '../common/Container';
import { withNavigation } from 'react-navigation';

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 10,
    paddingVertical: 200,
  },
  text: {
    ...TYPOGRAPHY.secondary,
    color: COLORS.textFaded,
    textAlign: 'center',
  },
  textLink: {
    textDecorationLine: 'underline',
  },
});

type Props = { tapId: EntityID };

type InjectedProps = {| navigation: Navigation |};

@withNavigation
class TapDetailsNoKeg extends InjectedComponent<InjectedProps, Props> {
  _onSetupPress = () =>
    this.injectedProps.navigation.navigate('newKeg', {
      tapId: this.props.tapId,
    });

  render() {
    return (
      <Container centered style={styles.container}>
        <Text style={styles.text}>You don't have keg on the tap.</Text>
        <TouchableOpacity onPress={this._onSetupPress}>
          <Text style={[styles.text, styles.textLink]}>
            Click to setup one.
          </Text>
        </TouchableOpacity>
      </Container>
    );
  }
}

export default TapDetailsNoKeg;
