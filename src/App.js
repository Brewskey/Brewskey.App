// @flow

import * as React from 'react';
import { SafeAreaView, StyleSheet } from 'react-native';
import DAOApi from 'brewskey.js-api';
import { configure as mobxConfigure } from 'mobx';
import config from './config';
import NavigationService from './NavigationService';
import AppRouter from './AppRouter';
import NFCModal from './components/modals/NFCModal';
import NotificationsStore from './stores/NotificationsStore';
import { COLORS } from './theme';
import SnackBar from './common/SnackBar';

mobxConfigure({
  enforceActions: true,
});

DAOApi.initializeDAOApi({
  endpoint: `${config.HOST}api/v2/`,
});

const styles = StyleSheet.create({
  safeArea: {
    backgroundColor: COLORS.primary2,
    flex: 1,
  },
});

class App extends React.Component<{}> {
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
      <SafeAreaView style={styles.safeArea}>
        <AppRouter ref={this._setNavigationRef} />
        <NFCModal />
        <SnackBar />
      </SafeAreaView>
    );
  }
}

export default App;
