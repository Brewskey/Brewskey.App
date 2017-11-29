// @flow

import * as React from 'react';
import { StyleSheet, View } from 'react-native';
import DAOApi from 'brewskey.js-api';
import { useStrict as mobxUseStrict } from 'mobx';
import config from './config';
import NavigationService from './NavigationService';
import AppRouter from './AppRouter';
import PourButton from './components/PourButton';
import NFCModal from './components/modals/NFCModal';
import AuthStore from './stores/AuthStore';
import AppSettingsStore from './stores/AppSettingsStore';

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

mobxUseStrict(true);

DAOApi.initializeDAOApi({
  endpoint: `${config.HOST}api/v2/`,
});

class App extends React.Component<{}> {
  async componentWillMount() {
    await AuthStore.initialize();
    await AppSettingsStore.initialize();
  }

  render() {
    return (
      <View style={styles.container}>
        <AppRouter rootRef={ref => NavigationService.setNavigator(ref)} />
        <PourButton />
        <NFCModal />
      </View>
    );
  }
}

export default App;
