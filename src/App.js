// @flow

import React from 'react';
import DAOApi from 'brewskey.js-api';
import { StyleSheet, Text, View } from 'react-native';
import { observer, Provider } from 'mobx-react';
import { action, observable, useStrict as mobxUseStrict } from 'mobx';
import config from './config';
import NavigationService from './NavigationService';
import RootStore from './stores/RootStore';
import RootRouter from './routes';

mobxUseStrict(true);

DAOApi.initializeDAOApi({
  endpoint: `${config.HOST}api/v2/`,
});

export const rootStore = new RootStore();
let stores = {};
Object.getOwnPropertyNames(rootStore).map(
  (storeName: string): Object => (stores[storeName] = rootStore[storeName]),
);

class App extends React.Component {
  render(): React.Element<*> {
    return (
      <Provider {...stores}>
        <RootRouter
          ref={(navigator: Object): void =>
            NavigationService.setNavigator(navigator)}
        />
      </Provider>
    );
  }
}

export default App;
