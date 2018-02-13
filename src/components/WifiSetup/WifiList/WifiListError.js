// @flow

import * as React from 'react';
import { StyleSheet } from 'react-native';
import Container from '../../../common/Container';
import TextBlock from '../../../common/TextBlock';
import { Icon } from 'react-native-elements';
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
      reverseColor={COLORS.accent}
      color={COLORS.secondary2}
      name="priority-high"
      size={45}
    />
    <TextBlock paddedBottom textStyle={styles.textTitle}>
      Couldn't receive the Brewskey box available WiFi networks
    </TextBlock>
    <TextBlock index={1} paddedBottom textStyle={styles.textInstructions}>
      Try unplugging and plugging the Brewskey box back in. Reconnect to
      Photon-XXX WiFi network on your phone and pull to refresh.
    </TextBlock>
    <TextBlock index={2} textStyle={styles.textInstructions}>
      If the previous step doesn't help, repeat the whole setup from the
      beginning.
    </TextBlock>
  </Container>
);

export default WifiListError;
