import * as React from 'react';

import { View } from 'react-native';

import { OrderedText } from '../../common/TextBlock';

const DeviceSetupInstructions = () => (
  <View>
    <OrderedText paddedBottom index={1}>
      Please power on your Brewskey box by plugging it in.
    </OrderedText>
    <OrderedText paddedBottom index={2}>
      The LED on the Brewskey box should be blinking blue. If not, hold the
      button on the back of the box for 3 seconds.
    </OrderedText>
    <OrderedText index={3}>
      Make sure your phone is connected to the internet
    </OrderedText>
  </View>
);

export { DeviceSetupInstructions };
