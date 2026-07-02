import * as React from 'react';

import { ScrollView, StyleSheet, Text } from 'react-native';

import { Button } from 'common/buttons/Button';
import { Container } from 'common/Container';
import { Header } from 'common/Header';
import { Section } from 'common/Section';
import { useNfcBoxRead } from 'hooks/useNfcBoxRead';
import { COLORS, TYPOGRAPHY } from 'theme';

const styles = StyleSheet.create({
  button: {
    marginTop: 8,
  },
  instructionText: {
    ...TYPOGRAPHY.secondary,
    marginBottom: 8,
    textAlign: 'center',
  },
  logText: {
    ...TYPOGRAPHY.small,
    fontFamily: 'monospace',
  },
  resultText: {
    ...TYPOGRAPHY.secondary,
    color: COLORS.accent,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  section: {
    padding: 16,
  },
});

const NfcDebugScreen = () => {
  const { status, logs, result, isSupported, startScan, stopScan } =
    useNfcBoxRead();

  return (
    <Container>
      <Header
        shouldShowBackButton
        testID="header-nfc-debug"
        title="NFC Box Test"
      />
      <Section bottomPadded innerContainerStyle={styles.section}>
        <Text style={styles.instructionText} testID="nfc-debug-instructions">
          {isSupported
            ? 'Reads the NDEF message directly from a Brewskey Box over ' +
              'ISO-DEP. Hold your phone against the box after starting.'
            : 'NFC is not available on this device.'}
        </Text>
        {status === 'scanning' ? (
          <Button
            onPress={stopScan}
            style={styles.button}
            testID="button-nfc-debug-stop"
            title="Stop"
          />
        ) : (
          <Button
            disabled={!isSupported}
            onPress={startScan}
            style={styles.button}
            testID="button-nfc-debug-start"
            title="Start Scan"
          />
        )}
        {result == null ? null : (
          <Text style={styles.resultText} testID="nfc-debug-result">
            {result.uri ?? `(raw) ${result.rawNdefHex}`}
            {` — ${result.durationMs}ms`}
          </Text>
        )}
      </Section>
      <Section bottomPadded innerContainerStyle={styles.section}>
        <ScrollView testID="nfc-debug-logs">
          {logs.map((line, index) => (
            // eslint-disable-next-line react/no-array-index-key
            <Text key={index} style={styles.logText}>
              {line}
            </Text>
          ))}
        </ScrollView>
      </Section>
    </Container>
  );
};

export default NfcDebugScreen;
