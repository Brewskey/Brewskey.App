// @flow

import * as React from 'react';
import CutBeerLineImage from '../../resources/installation/1_cut-beer-line.png';
import InstallSensorImage from '../../resources/installation/2_install-sensor.png';
import DetachTowerImage from '../../resources/installation/3_detach-tower.png';
import SensorCableToBoxImage from '../../resources/installation/4_sensor-cable-to-box.png';
import AttachTowerImage from '../../resources/installation/5_attach-tower.png';
import PlugInImage from '../../resources/installation/6_plug-in.png';
import FinishImage from '../../resources/installation/7_finish-in-app.png';
import SetupStep from './SetupStep';

const SETUP_STEPS = [
  <SetupStep
    description="To attach the flow sensor, cut your beer line near its midpoint."
    image={CutBeerLineImage}
    key={1}
    title="1. Cut your beer line"
  />,
  <SetupStep
    description={
      'Taking the two ends of the line you just cut, ' +
      'soak them in hot water for about a minute. ' +
      'Then, slide the pointed ends of the flow sensor on the beer line.'
    }
    key={2}
    image={InstallSensorImage}
    title="2. Install flow sensor"
  />,
  <SetupStep
    description={
      'Remove the screws holding up the kegerator tower ' +
      'and pick up the rubber ring underneath.'
    }
    image={DetachTowerImage}
    key={3}
    title="3. Detach kegerator tower"
  />,
  <SetupStep
    description={
      'Plug the flat cable into your Brewskey box ' +
      'and connect the other end into the flow sensor.'
    }
    image={SensorCableToBoxImage}
    key={4}
    title="4. Run cable from your Brewskey box to sensor"
  />,
  <SetupStep
    description={
      'Make sure the Brewskey box is in good place ' +
      "because you won't be able to move it much. " +
      "Also, make sure the flat cable isn't pinched or twisted."
    }
    image={AttachTowerImage}
    key={5}
    title="5. Re-attach kegerator tower"
  />,
  <SetupStep
    description={
      "You're almost finished. Plug in the power cable " +
      'and the LED light should start blinking blue. ' +
      "This means it's ready for you to set up the WiFi."
    }
    image={PlugInImage}
    key={6}
    title="6. Plug in the Brewskey box"
  />,
  <SetupStep
    description={
      'Create a location, connect to your box, and name your tap. ' +
      "After that, you're ready to pour!"
    }
    image={FinishImage}
    key={7}
    title="7. Finish installation with the mobile app"
  />,
];

export default SETUP_STEPS;
