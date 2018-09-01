// @flow

import * as React from 'react';
import { SafeAreaView, StyleSheet } from 'react-native';
import nullthrows from 'nullthrows';
import DAOApi from 'brewskey.js-api';
import { autorun, configure as mobxConfigure, reaction } from 'mobx';
import config from './config';
import NavigationService from './NavigationService';
import AppRouter from './AppRouter';
import Signalr from './signalr';
import AuthStore from './stores/AuthStore';
import NotificationsStore from './stores/NotificationsStore';
import { UNAUTH_ERROR_CODE } from './constants';
import PourProcessModal from './components/modals/PourProcessModal';
import { COLORS } from './theme';
import SnackBar from './common/SnackBar';

mobxConfigure(
  ({
    enforceActions: true,
    // cast because of wrong mobx typings
  }: any),
);

const setDAOHeaders = (token: string) => {
  const daoHeaders = DAOApi.getHeaders().filter(
    (header: { name: string, value: string }): boolean =>
      header.name !== 'Authorization' && header.name !== 'timezoneOffset',
  );

  DAOApi.setHeaders([
    ...daoHeaders,
    {
      name: 'timezoneOffset',
      value: new Date().getTimezoneOffset().toString(),
    },
    {
      name: 'Authorization',
      value: `Bearer ${token}`,
    },
  ]);
};

DAOApi.initializeDAOApi({
  endpoint: `${config.HOST}api/v2/`,
});

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
      setDAOHeaders(nullthrows(AuthStore.token));
      Signalr.startAll();
    } else {
      Signalr.stopAll();
      DAOApi.flushCache();
    }
  },
);

const styles = StyleSheet.create({
  safeArea: {
    backgroundColor: COLORS.primary2,
    flex: 1,
  },
});

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
    NotificationsStore.handleInitialNotification();
  }

  _setNavigationRef = ref => {
    // todo make navigationStore which will persist navigation
    // state, just like in redux.
    // this will allow to avoid this shitty hacks
    NavigationService.setNavigator(ref);
    if (ref) {
      NotificationsStore.setNavigation(ref._navigation);
    }
  };

  render() {
    return (
      <SafeAreaView style={styles.safeArea}>
        <AppRouter ref={this._setNavigationRef} />
        <PourProcessModal />
        <SnackBar />
      </SafeAreaView>
    );
  }
}

export default App;
