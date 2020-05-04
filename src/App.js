// @flow

import * as React from 'react';
import { SafeAreaView, StyleSheet } from 'react-native';
import nullthrows from 'nullthrows';
import DAOApi from 'brewskey.js-api';
import codePush from 'react-native-code-push';
import { autorun, configure as mobxConfigure, reaction } from 'mobx';
import { Provider as SlotFillProvider } from 'react-slot-fill';
import config from './config';
import NavigationService from './NavigationService';
import AppRouter from './AppRouter';
import AuthStore from './stores/AuthStore';
import NotificationsStore from './stores/NotificationsStore';
import { UNAUTH_ERROR_CODE } from './constants';
import PourProcessModal from './components/modals/PourProcessModal';
import { COLORS } from './theme';
import SnackBar from './common/SnackBar';
import { flushAPIStoreCaches } from './stores/ApiRequestStores/makeRequestApiStore';
import SnackBarStore from './stores/SnackBarStore';

// stripe.setOptions({
//   androidPayMode: 'test', // Android only
//   // merchantId: 'MERCHANT_ID', // Optional
//   publishableKey: 'pk_test_B8kBbgSzIHam4hf1RRNC2WRf',
// });

mobxConfigure({
  enforceActions: 'observed',
});

DAOApi.initialize(config.HOST);

DAOApi.onError((error: Error) => {
  // todo fix the type in dao-api to remove the casting
  const { status } = (error: any);
  if (status === UNAUTH_ERROR_CODE) {
    AuthStore.logout();
  }
});

reaction(
  (): boolean => AuthStore.isAuthorized,
  (isAuthorized: boolean) => {
    if (isAuthorized) {
      DAOApi.setToken(nullthrows(AuthStore.accessToken));
      try {
        DAOApi.Signalr.startAll();
      } catch (error) {
        SnackBarStore.showMessage({
          style: 'danger',
          text: "Can't establish socket connection. autorefreshes wont work",
        });
      }
    } else {
      try {
        DAOApi.Signalr.stopAll();
      } catch (error) {
        // swallow
      }
      DAOApi.flushCache();
      flushAPIStoreCaches();
    }
  },
);

const styles = StyleSheet.create({
  safeArea: {
    backgroundColor: COLORS.primary2,
    flex: 1,
  },
});

@codePush({
  checkFrequency: codePush.CheckFrequency.ON_APP_RESUME,
  installMode: codePush.InstallMode.IMMEDIATE,
})
class App extends React.Component<{}> {
  componentDidMount() {
    autorun(async () => {
      if (!AuthStore.isReady) {
        return;
      }

      if (AuthStore.isAuthorized) {
        NavigationService.navigate('main');
      } else {
        NavigationService.navigate('login');
      }
    });
  }

  _setNavigationRef = (ref) => {
    // todo make navigationStore which will persist navigation
    // state, just like in redux.
    // this will allow to avoid this shitty hacks
    NavigationService.setNavigator(ref);
    if (ref) {
      NotificationsStore.setNavigation(ref._navigation);
    }
  };

  render(): React.Node {
    return (
      <SafeAreaView style={styles.safeArea}>
        <SlotFillProvider>
          <AppRouter ref={this._setNavigationRef} />
        </SlotFillProvider>
        <PourProcessModal />
        <SnackBar />
      </SafeAreaView>
    );
  }
}

export default App;
