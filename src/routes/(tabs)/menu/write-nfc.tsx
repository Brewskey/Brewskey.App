import * as React from 'react';
import { Linking, StyleSheet, Text, TouchableHighlight } from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { TYPOGRAPHY } from '../../../theme';
import Container from '../../../common/Container';
import Header from '../../../common/Header';
import Section from '../../../common/Section';
import Button from '../../../common/buttons/Button';
import { LoginForm } from '../../../components/LoginForm';
import { withErrorBoundary } from '../../../common/ErrorBoundary';
import ErrorScreen from '../../../common/ErrorScreen';

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

const WriteNFCScreen = withErrorBoundary(
  () => {
    const onOpenLink = async () => {
      const url = 'https://brewskey.com/faq#supported-nfc-cards';
      const isSupported = await Linking.canOpenURL(url);
      if (!isSupported) {
        return;
      }

      await Linking.openURL(url);
    };

    const status = 'instructions' as string;
    let content = null;

    switch (status) {
      case 'instructions': {
        content = (
          <>
            <Section bottomPadded innerContainerStyle={styles.section} testID="nfc-instructions-section">
              <Text style={styles.instructionText} testID="nfc-instructions-text">
                Brewskey can use NFC cards for "tap to pour". These cards can
                work just like tapping with your phone.
              </Text>
              <TouchableHighlight onPress={onOpenLink} testID="nfc-supported-cards-link">
                <Text style={styles.instructionText}>
                  In order to use this feature, you'll need to use one of the{' '}
                  <Text style={styles.linkText} testID="nfc-supported-cards-link-text">supported NFC cards</Text>.
                </Text>
              </TouchableHighlight>
            </Section>
            <Section bottomPadded innerContainerStyle={styles.section} testID="nfc-setup-steps-section">
              <Text style={styles.setupTest} testID="nfc-setup-steps-title">
                To set up your card, you'll need to
              </Text>
              <Text style={styles.listText} testID="nfc-setup-step-1">1. Click "Next"</Text>
              <Text style={styles.listText} testID="nfc-setup-step-2">
                2. Log in as the account the NFC card should use.
              </Text>
              <Text style={styles.listText} testID="nfc-setup-step-3">3. Write to the NFC card.</Text>
              <Button
                style={styles.nextButton}
                testID="button-nfc-next"
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
              <LoginForm isInverse={false} />
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
        <Header shouldShowBackButton testID="header-write-nfc" title="NFC Card Setup" />
        <KeyboardAwareScrollView keyboardShouldPersistTaps="handled" testID="write-nfc-content">
          {content}
        </KeyboardAwareScrollView>
      </Container>
    );
  },
  <ErrorScreen shouldShowBackButton />,
);

export default WriteNFCScreen;
