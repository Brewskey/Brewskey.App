// @flow

import * as React from 'react';
import { Linking, StyleSheet, Text, TouchableHighlight } from 'react-native';
import { COLORS, TYPOGRAPHY } from '../theme';
import NotImplementedPlaceholder from '../common/NotImplementedPlaceholder';
import ErrorScreen from '../common/ErrorScreen';
import { errorBoundary } from '../common/ErrorBoundary';
import Container from '../common/Container';
import Header from '../common/Header';
import Section from '../common/Section';
import SnackBarStore from '../stores/SnackBarStore';

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

@errorBoundary(<ErrorScreen showBackButton />)
class HelpScreen extends React.Component<{||}> {
  _onOpenLink = async (url) => {
    const isSupported = await Linking.canOpenURL(url);
    if (!isSupported) {
      SnackBarStore.showMessage({
        duration: 5000,
        style: 'danger',
        text: `Couldn't open link:\n${url}`,
        position: 'top',
      });
      return;
    }

    await Linking.openURL(url);
  };

  render(): React.Node {
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
            onPress={() => this._onOpenLink('https://brewskey.com/faq')}
          >
            <Text style={styles.listText}>
              {'• '}
              <Text style={styles.linkText}>Check out our FAQ</Text>
            </Text>
          </TouchableHighlight>
          <TouchableHighlight
            onPress={() => this._onOpenLink('https://m.me/brewskeyapp')}
          >
            <Text style={styles.listText}>
              {'• '}
              <Text style={styles.linkText}>Facebook Messenger</Text>
            </Text>
          </TouchableHighlight>
          <TouchableHighlight
            onPress={() => this._onOpenLink('mailto:john@brewskey.com')}
          >
            <Text style={styles.listText}>
              {'• '}
              <Text style={styles.linkText}>Email</Text>
            </Text>
          </TouchableHighlight>
        </Section>
      </Container>
    );
  }
}

export default HelpScreen;
