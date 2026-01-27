import * as React from 'react';

import { View } from 'react-native';

import { OrderedText } from '../../common/TextBlock';

const FinishInstructions = () => (
  <View>
    <OrderedText paddedBottom>
      The WiFi information has been sent to your Brewskey box!
    </OrderedText>
    <OrderedText paddedBottom>
      The LED should now turn green, and eventually blue.
    </OrderedText>
    <OrderedText paddedBottom>
      If the LED continues to flash green for a minute or more, it means the
      password entered incorrectly. You will need to restart the setup process.
    </OrderedText>
    <OrderedText paddedBottom>
      If your phone not already reverted back to your regular WiFi network,
      re-connect to it now to get back online.
    </OrderedText>
  </View>
);

export { FinishInstructions };
