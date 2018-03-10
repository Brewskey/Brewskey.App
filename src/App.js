// @flow

import * as React from 'react';
import { SafeAreaView, StyleSheet } from 'react-native';
import DAOApi from 'brewskey.js-api';
import { useStrict as mobxUseStrict } from 'mobx';
import config from './config';
import NavigationService from './NavigationService';
import AppRouter from './AppRouter';
import NFCModal from './components/modals/NFCModal';
import AuthStore from './stores/AuthStore';
import AppSettingsStore from './stores/AppSettingsStore';
import NotificationsStore from './stores/NotificationsStore';

mobxUseStrict(true);

DAOApi.initializeDAOApi({
  endpoint: `${config.HOST}api/v2/`,
});

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

class App extends React.Component<{}> {
  async componentWillMount() {
    await AuthStore.initialize();
    await AppSettingsStore.initialize();
  }

  componentDidMount() {
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
      <SafeAreaView style={styles.container}>
        <AppRouter ref={this._setNavigationRef} />
        <NFCModal />
      </SafeAreaView>
    );
  }
}

export default App;
