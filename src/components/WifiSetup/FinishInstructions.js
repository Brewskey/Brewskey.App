// @flow

import * as React from 'react';
import { Text, View } from 'react-native';
import Button from '../../common/buttons/Button';

const FinishInstructions = ({ onFinishPress }: Props) => (
  <View>
    <Text>The WiFi information has been sent to your Brewskey box!</Text>
    <Text>The LED should now turn green, and eventually blue.</Text>
    <Text>
      If the LED continues to flash green for a minute or more, it means the
      password entered incorrectly. You will need to restart the setup process.
    </Text>
    <Text>
      If your phone not already reverted back to your regular WiFi network,
      re-connect to it now to get back online.
    </Text>
    <Button onPress={onFinishPress} title="Finish" />
  </View>
);

export default FinishInstructions;
