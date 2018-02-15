// @flow

import type { FlowSensorType } from 'brewskey.js-api';

import ft330Image from '../../resources/sensors/ft330.png';
import sf800Image from '../../resources/sensors/sf800.png';
import titan300Image from '../../resources/sensors/titan.png';
import yf201Image from '../../resources/sensors/yf-201.png';

export type FlowSensorItem = {
  defaultPulses: number,
  description: string,
  image: ?number,
  name: string,
  value: FlowSensorType,
};

const FLOW_SENSOR_ITEMS: Array<FlowSensorItem> = [
  {
    defaultPulses: 5375,
    description: 'The Brewskey standard flow sensor.',
    image: titan300Image,
    name: 'Titan 300',
    value: 'Titan',
  },
  {
    defaultPulses: 10313,
    description: 'Very accurate sensor.',
    image: ft330Image,
    name: 'FT330',
    value: 'FT330',
  },
  {
    defaultPulses: 20820,
    description: 'Very accurate but uses BSP pipe threading.',
    image: sf800Image,
    name: 'SF800',
    value: 'SwissFlowSF800',
  },
  {
    defaultPulses: 3785,
    description: 'Cheap sensor with lower accuracy.',
    image: yf201Image,
    name: 'YF-201',
    value: 'Sea',
  },
  {
    defaultPulses: 0,
    description: 'Roll your own!',
    image: null,
    name: 'Custom',
    value: 'Custom',
  },
];

export default FLOW_SENSOR_ITEMS;
