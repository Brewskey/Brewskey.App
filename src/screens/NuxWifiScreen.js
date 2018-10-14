// @flow

import * as React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Icon } from 'react-native-elements';
import flatNavigationParamsAndScreenProps from '../common/flatNavigationParamsAndScreenProps';
import Button from '../common/buttons/Button';
import InjectedComponent from '../common/InjectedComponent';
import Header from '../common/Header';
import ErrorScreen from '../common/ErrorScreen';
import { errorBoundary } from '../common/ErrorBoundary';
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
  onContinuePress: () => void | Promise<any>,
|};

@errorBoundary(<ErrorScreen showBackButton />)
@flatNavigationParamsAndScreenProps
class NuxWifiScreen extends InjectedComponent<InjectedProps> {
  render() {
    return (
      <Container>
        <Header title="2. Setup Wifi" />
        <View style={styles.container}>
          <Icon
            color={COLORS.textInverse}
            containerStyle={styles.iconContainer}
            name="wifi"
            size={200}
          />
          <Text style={styles.descriptionText}>
            Next, you need to setup WiFi on your Brewskey box.
          </Text>
          <Button
            onPress={this.injectedProps.onContinuePress}
            secondary
            title="Next"
          />
        </View>
      </Container>
    );
  }
}

export default NuxWifiScreen;
