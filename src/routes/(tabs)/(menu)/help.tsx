import * as React from 'react';

import {
  Linking,
  StyleSheet,
  Text,
  TouchableHighlight,
  View,
} from 'react-native';

import { Container } from 'common/Container';
import { Header } from 'common/Header';
import { Section } from 'common/Section';
import { useAddSnackBarMessage } from 'hooks/context/SnackBarContext';
import { COLORS, TYPOGRAPHY } from 'theme';

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
    ...TYPOGRAPHY.paragraph,
    marginBottom: 8,
  },
  nextButton: {
    marginTop: 16,
  },
  section: {
    padding: 16,
  },
  setupTest: {
    ...TYPOGRAPHY.secondary,
    marginBottom: 8,
  },
});

const HelpScreen: React.FC = () => {
  const addSnackBarMessage = useAddSnackBarMessage();

  const onOpenLink = async (url: string) => {
    const isSupported = await Linking.canOpenURL(url);
    if (!isSupported) {
      addSnackBarMessage({
        content: `Couldn't open link:\n${url}`,
        style: 'danger',
      });
      return;
    }

    await Linking.openURL(url);
  };

  return (
    <Container>
      <Header shouldShowBackButton title="Help" />
      <Section innerContainerStyle={styles.section} testID="help-content">
        <Text
          testID="help-instruction-text"
          style={[
            styles.instructionText,
            {
              borderBottomWidth: 2,
              borderColor: COLORS.secondary2,
              paddingBottom: 8,
            },
          ]}
        >
          Having trouble setting up your Brewskey box or have questions in
          General?
        </Text>
        <Text style={styles.setupTest} testID="help-setup-text">
          You can get help a few different ways:
        </Text>
        <View testID="help-link-faq">
          <TouchableHighlight
            onPress={async () => onOpenLink('https://brewskey.com/faq')}
          >
            <Text style={styles.listText}>
              {'• '}
              <Text style={styles.linkText} testID="help-link-faq-text">
                Check out our FAQ
              </Text>
            </Text>
          </TouchableHighlight>
        </View>
        <View testID="help-link-messenger">
          <TouchableHighlight
            onPress={async () => onOpenLink('https://m.me/brewskeyapp')}
          >
            <Text style={styles.listText}>
              {'• '}
              <Text style={styles.linkText} testID="help-link-messenger-text">
                Facebook Messenger
              </Text>
            </Text>
          </TouchableHighlight>
        </View>
        <View testID="help-link-email">
          <TouchableHighlight
            onPress={async () => onOpenLink('mailto:john@brewskey.com')}
          >
            <Text style={styles.listText}>
              {'• '}
              <Text style={styles.linkText} testID="help-link-email-text">
                Email
              </Text>
            </Text>
          </TouchableHighlight>
        </View>
      </Section>
    </Container>
  );
};

export default HelpScreen;
