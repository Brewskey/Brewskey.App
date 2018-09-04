// @flow

import './globals';
import { AppRegistry } from 'react-native';
import App from './src/App';

(console: any).ignoredYellowBox = ['Could not find image'];

AppRegistry.registerComponent('brewskey', () => App);
