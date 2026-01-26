// flow

import * as React from 'react';

import { View } from 'react-native';

import TextBlock from '../../common/TextBlock';

const PhoneConnectInstructions = () => (
  <View>
    <TextBlock paddedBottom index={1}>
      Open your nearby networks on your phone.
    </TextBlock>
    <TextBlock paddedBottom index={2}>
      Make sure WiFi is turned on, and choose a network that looks like
      Photon-XXXX.
    </TextBlock>
    <TextBlock paddedBottom index={3}>
      Once connected, you will move to the next step.
    </TextBlock>
    <TextBlock paddedBottom index={4}>
      If your Brewskey box is blinking blue but still not showing up in you
      smart phone's WiFi list, try turning your WiFi off and then on again.
    </TextBlock>
    <TextBlock index={5}>
      If you still having trouble, try unplugging and plugging the Brewskey box
      back in.
    </TextBlock>
  </View>
);

export default PhoneConnectInstructions;
