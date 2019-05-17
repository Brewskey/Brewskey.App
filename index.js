// @flow

import './globals';
import { AppRegistry } from 'react-native';
import RNEventSource from 'react-native-event-source';

global.EventSource = RNEventSource;

// import applyDecoratedDescriptor from '@babel/runtime/helpers/esm/applyDecoratedDescriptor';
// import initializerDefineProperty from '@babel/runtime/helpers/esm/initializerDefineProperty';

// // $FlowFixMe
// Object.assign(babelHelpers, {
//   applyDecoratedDescriptor,
//   initializerDefineProperty,
// });

(console: any).ignoredYellowBox = ['Could not find image'];

const App = require('./src/App').default;

AppRegistry.registerComponent('brewskey', () => App);
