import * as React from 'react';
import { Linking, StyleSheet, Text, TouchableHighlight } from 'react-native';
import { COLORS, TYPOGRAPHY } from '../theme';
import NotImplementedPlaceholder from '../common/NotImplementedPlaceholder';
import ErrorScreen from '../common/ErrorScreen';
import { withErrorBoundary } from '../common/ErrorBoundary';
import Container from '../common/Container';
import Header from '../common/Header';
import Section from '../common/Section';
import { useAddSnackBarMessage } from '../hooks/context/SnackBarContext';

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
      <Header showBackButton title="Help" />
      <Section innerContainerStyle={styles.section}>
        <Text
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
        <Text style={styles.setupTest}>
          You can get help a few different ways:
        </Text>
        <TouchableHighlight
          onPress={() => onOpenLink('https://brewskey.com/faq')}
        >
          <Text style={styles.listText}>
            {'• '}
            <Text style={styles.linkText}>Check out our FAQ</Text>
          </Text>
        </TouchableHighlight>
        <TouchableHighlight
          onPress={() => onOpenLink('https://m.me/brewskeyapp')}
        >
          <Text style={styles.listText}>
            {'• '}
            <Text style={styles.linkText}>Facebook Messenger</Text>
          </Text>
        </TouchableHighlight>
        <TouchableHighlight
          onPress={() => onOpenLink('mailto:john@brewskey.com')}
        >
          <Text style={styles.listText}>
            {'• '}
            <Text style={styles.linkText}>Email</Text>
          </Text>
        </TouchableHighlight>
      </Section>
    </Container>
  );
};

export default withErrorBoundary(HelpScreen, <ErrorScreen showBackButton />);
