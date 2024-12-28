import type { WifiNetwork } from '../../../types';

import * as React from 'react';
import { StyleSheet, Text, TouchableOpacity } from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import Container from '../../../common/Container';
import { COLORS, TYPOGRAPHY } from '../../../theme';
import HiddenWifiForm from './HiddenWifiForm';
import { useState } from 'react';

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

type Props = {
  onConnectPress: (wifiNetwork: WifiNetwork) => Promise<void>;
};

export const HiddenWifiInput: React.FC<Props> = ({ onConnectPress }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <Container style={styles.container}>
      <KeyboardAwareScrollView keyboardShouldPersistTaps="handled">
        <TouchableOpacity onPress={() => setIsExpanded(!isExpanded)}>
          <Text style={styles.title}>Hidden network</Text>
        </TouchableOpacity>
        {isExpanded && <HiddenWifiForm onSubmit={onConnectPress} />}
      </KeyboardAwareScrollView>
    </Container>
  );
};
