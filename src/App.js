// @flow

import * as React from 'react';
import { View } from 'react-native';
import { Button } from 'react-native-elements';
import DAOApi from 'brewskey.js-api';
import { Provider } from 'mobx-react';
import { useStrict as mobxUseStrict } from 'mobx';
import config from './config';
import NavigationService from './NavigationService';
import RootStore from './stores/RootStore';
import AppRouter from './AppRouter';
import NFCStore from './stores/NFCStore';
import NFCModal from './components/modals/NFCModal';

mobxUseStrict(true);

DAOApi.initializeDAOApi({
  endpoint: `${config.HOST}api/v2/`,
});

const STYLE = { flex: 1 };

export const rootStore: { [key: string]: Object } = new RootStore();
const stores = {};
Object.getOwnPropertyNames(rootStore).forEach((storeName: string) => {
  stores[storeName] = rootStore[storeName];
});

// todo Pour Button should be deepr in the router tree
// or hidden until login, it may be better use floactin action button
// like in twitter.
class App extends React.Component<{}> {
  render() {
    return (
      <Provider rootStore={rootStore} {...stores}>
        <View style={STYLE}>
          <AppRouter rootRef={ref => NavigationService.setNavigator(ref)} />
          <Button large onPress={NFCStore.onShowModal} title="Pour" />
          <NFCModal />
        </View>
      </Provider>
    );
  }
}

export default App;
