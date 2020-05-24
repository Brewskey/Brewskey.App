// @flow

import './globals';
import { AppRegistry } from 'react-native';

import RNEventSource from 'react-native-event-source';
import 'mobx-react/batchingForReactNative';

// import applyDecoratedDescriptor from '@babel/runtime/helpers/esm/applyDecoratedDescriptor';
// import initializerDefineProperty from '@babel/runtime/helpers/esm/initializerDefineProperty';

global.EventSource = RNEventSource;

// $FlowFixMe
// Object.assign(babelHelpers, {
//   applyDecoratedDescriptor,
//   initializerDefineProperty,
// });

(console: any).ignoredYellowBox = ['Could not find image'];

const App = require('./src/App').default;

AppRegistry.registerComponent('brewskey', () => App);
