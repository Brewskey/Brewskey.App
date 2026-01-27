import type { FlowSensorType } from '@brewskey/js-api';
import type { ImageSourcePropType } from 'react-native';

export interface FlowSensorItem {
  defaultPulses: number;
  description: string;
  image: ImageSourcePropType | undefined;
  name: string;
  value: FlowSensorType;
}

const FLOW_SENSOR_ITEMS: FlowSensorItem[] = [
  {
    defaultPulses: 5375,
    description: 'The Brewskey standard flow sensor.',
    image: require('../../resources/sensors/titan.png'),
    name: 'Titan 300',
    value: 'Titan',
  },
  {
    defaultPulses: 10313,
    description: 'Very accurate sensor.',
    image: require('../../resources/sensors/ft330.png'),
    name: 'FT330',
    value: 'FT330',
  },
  {
    defaultPulses: 20820,
    description: 'Very accurate but uses BSP pipe threading.',
    image: require('../../resources/sensors/sf800.png'),
    name: 'SF800',
    value: 'SwissFlowSF800',
  },
  {
    defaultPulses: 3785,
    description: 'Cheap sensor with lower accuracy.',
    image: require('../../resources/sensors/yf-201.png'),
    name: 'YF-201',
    value: 'Sea',
  },
  {
    defaultPulses: 0,
    description: 'Roll your own!',
    image: undefined,
    name: 'Custom',
    value: 'Custom',
  },
];

export { FLOW_SENSOR_ITEMS };
