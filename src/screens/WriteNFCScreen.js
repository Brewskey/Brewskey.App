// @flow

import type { Navigation } from '../types';

import * as React from 'react';
import InjectedComponent from '../common/InjectedComponent';
import { Linking, StyleSheet, Text, TouchableHighlight } from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { TYPOGRAPHY } from '../theme';
import { observer } from 'mobx-react';
import ErrorScreen from '../common/ErrorScreen';
import { errorBoundary } from '../common/ErrorBoundary';
import Container from '../common/Container';
import Header from '../common/Header';
import NFCWriterStore from '../stores/NFCWriterStore';
import Section from '../common/Section';
import Button from '../common/buttons/Button';
import LoginForm from '../components/LoginForm';

const styles = StyleSheet.create({
  instructionText: {
    ...TYPOGRAPHY.secondary,
    marginBottom: 8,
    textAlign: 'center',
  },
  linkText: {
    textDecorationLine: 'underline',
  },
  listText: {
    ...TYPOGRAPHY.small,
  },
  nextButton: {
    marginTop: 16,
  },
  section: {
    padding: 16,
  },
  setupTest: {
    ...TYPOGRAPHY.secondary,
    fontWeight: 'bold',
    marginBottom: 8,
  },
});

type InjectedProps = {|
  navigation: Navigation,
|};

@errorBoundary(<ErrorScreen showBackButton />)
@observer
class WriteNFCScreen extends InjectedComponent<InjectedProps> {
  _store = new NFCWriterStore();

  componentWillUnmount() {
    this._store.onFinished();
  }

  _onOpenLink = async () => {
    const url = 'https://brewskey.com/faq#supported-nfc-cards';
    const isSupported = await Linking.canOpenURL(url);
    if (!isSupported) {
      // console.log(`Can't handle url: ${  url}`);
      return;
    }

    await Linking.openURL(url);
  };

  render(): React.Node {
    const { status } = this._store;
    let content = null;

    switch (status) {
      case 'instructions': {
        content = (
          <>
            <Section bottomPadded innerContainerStyle={styles.section}>
              <Text style={styles.instructionText}>
                Brewskey can use NFC cards for "tap to pour". These cards can
                work just like tapping with your phone.
              </Text>
              <TouchableHighlight onPress={this._onOpenLink}>
                <Text style={styles.instructionText}>
                  In order to use this feature, you'll need to use one of the{' '}
                  <Text style={styles.linkText}>supported NFC cards</Text>.
                </Text>
              </TouchableHighlight>
            </Section>
            <Section bottomPadded innerContainerStyle={styles.section}>
              <Text style={styles.setupTest}>
                To set up your card, you'll need to
              </Text>
              <Text style={styles.listText}>1. Click "Next"</Text>
              <Text style={styles.listText}>
                2. Log in as the account the NFC card should use.
              </Text>
              <Text style={styles.listText}>3. Write to the NFC card.</Text>
              <Button
                onPress={this._store.onBeginUserLogin}
                style={styles.nextButton}
                title="Next"
              />
            </Section>
          </>
        );
        break;
      }

      case 'login': {
        content = (
          <>
            <Section bottomPadded innerContainerStyle={styles.section}>
              <Text style={styles.instructionText}>
                Log in as the user you'd like your NFC card to work for.
              </Text>
            </Section>
            <Section bottomPadded>
              <LoginForm onSubmit={this._store.onAuthenticateUser} />
            </Section>
          </>
        );
        break;
      }

      case 'writing': {
        content = (
          <>
            <Section bottomPadded innerContainerStyle={styles.section}>
              <Text style={styles.instructionText}>
                Tap your NFC card to the back of your phone. We'll let you know
                when you have successfully written to the card.
              </Text>
            </Section>
            <Section bottomPadded innerContainerStyle={styles.section}>
              <Button
                onPress={this._store.onBeginUserLogin}
                style={styles.nextButton}
                title="Go Back"
              />
            </Section>
          </>
        );
        break;
      }

      default: {
        throw new Error('Unmapped status');
      }
    }

    return (
      <Container>
        <Header showBackButton title="NFC Card Setup" />
        <KeyboardAwareScrollView keyboardShouldPersistTaps="always">
          {content}
        </KeyboardAwareScrollView>
      </Container>
    );
  }
}

export default WriteNFCScreen;
