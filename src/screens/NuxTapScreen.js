// @flow

import * as React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import flatNavigationParamsAndScreenProps from '../common/flatNavigationParamsAndScreenProps';
import Button from '../common/buttons/Button';
import InjectedComponent from '../common/InjectedComponent';
import Header from '../common/Header';
import Container from '../common/Container';
import ErrorScreen from '../common/ErrorScreen';
import { errorBoundary } from '../common/ErrorBoundary';
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
class NuxTapScreen extends InjectedComponent<InjectedProps> {
  render() {
    return (
      <Container>
        <Header title="3. Give a name to your device" />
        <View style={styles.container}>
          <Text style={styles.descriptionText}>
            Almost done. You'll need to set up at least on tap on your Brewskey
            box.
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

export default NuxTapScreen;
