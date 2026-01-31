import * as React from 'react';
import { useState } from 'react';

import { StyleSheet, Text, TouchableOpacity } from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';

import { HiddenWifiForm } from 'components/WifiSetup/WifiList/HiddenWifiForm';
import { Container } from 'common/Container';
import { COLORS, TYPOGRAPHY } from 'theme';

import type { WifiNetwork } from 'types';

const styles = StyleSheet.create({
  container: {
    backgroundColor: COLORS.secondary,
    borderBottomColor: COLORS.secondary3,
    borderBottomWidth: 2,
    paddingVertical: 15,
  },
  title: {
    ...TYPOGRAPHY.secondary,
    paddingHorizontal: 18,
  },
});

interface Props {
  onConnectPress: (wifiNetwork: WifiNetwork) => Promise<void>;
}

export const HiddenWifiInput: React.FC<Props> = ({ onConnectPress }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <Container style={styles.container}>
      <KeyboardAwareScrollView keyboardShouldPersistTaps="handled">
        <TouchableOpacity onPress={() => setIsExpanded(!isExpanded)}>
          <Text style={styles.title}>Hidden network</Text>
        </TouchableOpacity>
        {isExpanded ? <HiddenWifiForm onSubmit={onConnectPress} /> : null}
      </KeyboardAwareScrollView>
    </Container>
  );
};
