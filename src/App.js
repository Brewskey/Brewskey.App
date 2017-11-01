// @flow

import React from 'react';
import DAOApi from 'brewskey.js-api';
import { Provider } from 'mobx-react';
import { useStrict as mobxUseStrict } from 'mobx';
import config from './config';
import NavigationService from './NavigationService';
import RootStore from './stores/RootStore';
import AppRouter from './routes';

mobxUseStrict(true);

DAOApi.initializeDAOApi({
  endpoint: `${config.HOST}api/v2/`,
});

export const rootStore = new RootStore();
const stores = {};
Object.getOwnPropertyNames(rootStore).forEach((storeName: string): Object => {
  stores[storeName] = rootStore[storeName];
});

class App extends React.Component<{}> {
  render(): React.Node {
    return (
      <Provider rootStore={rootStore} {...stores}>
        <AppRouter
          rootRef={(navigator: Object): void =>
            NavigationService.setNavigator(navigator)}
        />
      </Provider>
    );
  }
}

export default App;
