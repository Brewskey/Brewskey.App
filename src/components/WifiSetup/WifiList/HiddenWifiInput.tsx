import * as React from 'react';
import { useState } from 'react';

import { StyleSheet, Text, TouchableOpacity } from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';

import { Container } from 'common/Container';
import { HiddenWifiForm } from 'components/WifiSetup/WifiList/HiddenWifiForm';
import { useSetupWifi } from 'hooks/queries/SoftApQueries';
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

export const HiddenWifiInput: React.FC = () => {
  const [isExpanded, setIsExpanded] = useState(false);
  const setupWifiMutator = useSetupWifi();
  const setupWifi = async (wifiNetwork: WifiNetwork) => {
    await setupWifiMutator.mutateAsync(wifiNetwork);
  };
  return (
    <Container style={styles.container}>
      <KeyboardAwareScrollView keyboardShouldPersistTaps="handled">
        <TouchableOpacity onPress={() => setIsExpanded(!isExpanded)}>
          <Text style={styles.title}>Hidden network</Text>
        </TouchableOpacity>
        {isExpanded ? <HiddenWifiForm onSubmit={setupWifi} /> : null}
      </KeyboardAwareScrollView>
    </Container>
  );
};
