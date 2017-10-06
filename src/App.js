// @flow

import React from 'react';
import DAOApi from 'brewskey.js-api';
import { StyleSheet, Text, View } from 'react-native';
import { observer, Provider } from 'mobx-react';
import { action, observable } from 'mobx';
import { Button } from 'react-native-elements';
import config from './config';
import NavigationService from './NavigationService';
import RootStore from './stores/RootStore';
import RootRouter from './routes';

DAOApi.initializeDAOApi({
  endpoint: `${config.HOST}api/v2/`,
});

const rootStore = new RootStore();
let stores = {};
Object.getOwnPropertyNames(new RootStore()).map(
  (storeName: string): Object => (stores[storeName] = rootStore[storeName]),
);

class App extends React.Component {
  render() {
    return (
      <Provider {...stores}>
        <RootRouter
          ref={(navigator: Object) => NavigationService.setNavigator(navigator)}
        />
      </Provider>
    );
  }
}

export default App;
