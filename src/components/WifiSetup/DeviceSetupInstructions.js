// @flow

import * as React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import Button from '../../common/buttons/Button';
import SectionHeader from '../../common/SectionHeader';
import SectionContent from '../../common/SectionContent';
import { TYPOGRAPHY } from '../../theme';

const styles = StyleSheet.create({
  text: {
    ...TYPOGRAPHY.paragraph,
  },
});

type Props = {|
  onReadyPress: () => void,
|};

const DeviceSetupInstructions = ({ onReadyPress }: Props) => (
  <View>
    <SectionHeader title="Time to set up WiFi your Brewskey box!" />
    <SectionContent paddedHorizontal>
      <Text style={styles.text}>
        1. Please power on your Brewskey box by plugging it in.
      </Text>
      <Text style={styles.text}>
        2. The LED on the Brewskey box should be blinking blue. If not, hold the
        button for 3 seconds.
      </Text>
      <Text style={styles.text}>
        3. Make sure your phone is connected to the internet
      </Text>
      <Button onPress={onReadyPress} title="Ready" />
    </SectionContent>
  </View>
);

export default DeviceSetupInstructions;
