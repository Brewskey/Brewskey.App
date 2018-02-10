// flow

import * as React from 'react';
import { View } from 'react-native';
import TextBlock from '../../common/TextBlock';

const PhoneConnectInstructions = () => (
  <View>
    <TextBlock index={1} paddedBottom>
      Open your nearby networks on your phone.
    </TextBlock>
    <TextBlock index={2} paddedBottom>
      Make sure WiFi is turned on, and choose a network that looks like
      Photon-XXXX.
    </TextBlock>
    <TextBlock index={3} paddedBottom>
      Once connected, you will move to the next step.
    </TextBlock>
    <TextBlock index={4} paddedBottom>
      If your Brewskey box is blinking blue but still not showing up in you
      smart phone&#8217;s WiFi list, try turning your WiFi off and then on
      again.
    </TextBlock>
    <TextBlock index={5}>
      If you still having trouble, try unplugging and plugging the Brewskey box
      back in.
    </TextBlock>
  </View>
);

export default PhoneConnectInstructions;
