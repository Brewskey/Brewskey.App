// @flow

import * as React from 'react';
import { View } from 'react-native';
import TextBlock from '../../common/TextBlock';

const DeviceSetupInstructions = () => (
  <View>
    <TextBlock index={1} paddedBottom>
      Please power on your Brewskey box by plugging it in.
    </TextBlock>
    <TextBlock index={2} paddedBottom>
      The LED on the Brewskey box should be blinking blue. If not, hold the
      button on the back of the box for 3 seconds.
    </TextBlock>
    <TextBlock index={3}>
      Make sure your phone is connected to the internet
    </TextBlock>
  </View>
);

export default DeviceSetupInstructions;
