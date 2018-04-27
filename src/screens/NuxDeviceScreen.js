// @flow

import * as React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import flatNavigationParamsAndScreenProps from '../common/flatNavigationParamsAndScreenProps';
import Button from '../common/buttons/Button';
import InjectedComponent from '../common/InjectedComponent';
import Header from '../common/Header';
import Container from '../common/Container';
import { COLORS, TYPOGRAPHY } from '../theme';

const styles = StyleSheet.create({
  container: {
    backgroundColor: COLORS.primary,
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: 15,
    paddingVertical: 30,
  },
  descriptionText: {
    ...TYPOGRAPHY.heading,
    color: COLORS.textInverse,
    paddingVertical: 30,
    textAlign: 'center',
  },
  iconContainer: {
    alignSelf: 'center',
  },
});

type InjectedProps = {|
  onContinuePress: () => void | Promise<void>,
|};

@flatNavigationParamsAndScreenProps
class NuxDeviceScreen extends InjectedComponent<InjectedProps> {
  render() {
    return (
      <Container>
        <Header title="3. Give a name to your device" />
        <View style={styles.container}>
          <Text style={styles.descriptionText}>
            Cool! At this stage you brewskey box should be connected to your
            Wifi network. Now you have to give a name to you brewskey box.
          </Text>
          <Button
            onPress={this.injectedProps.onContinuePress}
            secondary
            title="Okay"
          />
        </View>
      </Container>
    );
  }
}

export default NuxDeviceScreen;
