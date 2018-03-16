// @flow

import * as React from 'react';
import { View } from 'react-native';
import TextBlock from '../../common/TextBlock';

const FinishInstructions = () => (
  <View>
    <TextBlock paddedBottom>
      The WiFi information has been sent to your Brewskey box!
    </TextBlock>
    <TextBlock paddedBottom>
      The LED should now turn green, and eventually blue.
    </TextBlock>
    <TextBlock paddedBottom>
      If the LED continues to flash green for a minute or more, it means the
      password entered incorrectly. You will need to restart the setup process.
    </TextBlock>
    <TextBlock paddedBottom>
      If your phone not already reverted back to your regular WiFi network,
      re-connect to it now to get back online.
    </TextBlock>
  </View>
);

export default FinishInstructions;
