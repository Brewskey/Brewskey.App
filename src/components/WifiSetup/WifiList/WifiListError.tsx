import * as React from 'react';

import { Icon } from '@rneui/themed';
import { StyleSheet } from 'react-native';

import { Container } from '../../../common/Container';
import { OrderedText } from '../../../common/TextBlock';
import { COLORS, TYPOGRAPHY } from '../../../theme';

const styles = StyleSheet.create({
  textInstructions: {
    ...TYPOGRAPHY.paragraph,
    color: COLORS.textFaded,
    paddingHorizontal: 12,
  },
  textTitle: {
    ...TYPOGRAPHY.secondary,
    color: COLORS.textFaded,
    paddingHorizontal: 12,
    textAlign: 'center',
  },
});

const WifiListError = () => (
  <Container centered>
    <Icon
      reverse
      color={COLORS.secondary2}
      name="priority_high"
      reverseColor={COLORS.accent}
      size={45}
    />
    <OrderedText paddedBottom textStyle={styles.textTitle}>
      Couldn't receive the Brewskey box available WiFi networks
    </OrderedText>
    <OrderedText paddedBottom index={1} textStyle={styles.textInstructions}>
      Try unplugging and plugging the Brewskey box back in. Reconnect to
      Photon-XXX WiFi network on your phone and pull to refresh.
    </OrderedText>
    <OrderedText index={2} textStyle={styles.textInstructions}>
      If the previous step doesn't help, repeat the whole setup from the
      beginning.
    </OrderedText>
  </Container>
);

export { WifiListError };
