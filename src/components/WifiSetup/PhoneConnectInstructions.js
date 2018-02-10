// flow

import * as React from 'react';
import { Text, View } from 'react-native';

const PhoneConnectInstructions = () => (
  <View>
    <Text>1. Open your nearby networks on your phone.</Text>
    <Text>
      2. Make sure WiFi is turned on, and choose a network that looks like
      Photon-XXXX.
    </Text>
    <Text>3. Once connected, you will move to the next step.</Text>
    <Text>
      4. If your Brewskey box is blinking blue but still not showing up in you
      smart phone&#8217;s WiFi list, try turning your WiFi off and then on
      again.
    </Text>
    <Text>
      5. If you still having trouble, try unplugging and plugging the Brewskey
      box back in.
    </Text>
  </View>
);

export default PhoneConnectInstructions;
