import type { EntityID, KegMutator } from '@brewskey/js-api';

import * as React from 'react';

import { NavigationActions, StackActions } from 'react-navigation';
import DAOApi from '@brewskey/js-api';
import { TapStore } from '../stores/DAOStores';
import SnackBarStore from '../hooks/context/SnackBarContext';
import ErrorScreen from '../common/ErrorScreen';
import { errorBoundary } from '../common/ErrorBoundary';
import KegForm from '../components/KegForm';
import Container from '../common/Container';
import Header from '../common/Header';
import flatNavigationParamsAndScreenProps from '../common/flatNavigationParamsAndScreenProps';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import NavigationService from '../NavigationService';

type InjectedComponentProps = {
  navigation: Navigation;
  onTapSetupFinish?: (tapID: EntityID) => undefined | Promise<any>;
  tapId: EntityID;
};

@errorBoundary(<ErrorScreen showBackButton />)
@flatNavigationParamsAndScreenProps
class NewKegScreen extends InjectedComponent<InjectedComponentProps> {
  _onFormSubmit = async (values: KegMutator): Promise<void> => {
    const { navigation, onTapSetupFinish, tapId } = this.injectedProps;
    const clientID = DAOApi.KegDAO.post(values);
    await DAOApi.KegDAO.waitForLoaded((dao) => dao.fetchByID(clientID));
    TapStore.flushCacheForEntity(tapId);

    SnackBarStore.showMessage({ text: 'New keg added' });

    if (onTapSetupFinish) {
      onTapSetupFinish(tapId);
      return;
    }

    NavigationService.reset('menu', 'menu');
    NavigationService.navigate('taps');
    NavigationService.navigate('tapDetails', { id: tapId });
  };

  render(): React.ReactElement {
    const { tapId } = this.injectedProps;
    return (
      <Container>
        <Header showBackButton title="Add keg" />
        <KeyboardAwareScrollView keyboardShouldPersistTaps="handled">
          <KegForm
            onSubmit={this._onFormSubmit}
            submitButtonLabel="Add keg"
            tapId={tapId}
            onFloatedSubmit={() => {}}
          />
        </KeyboardAwareScrollView>
      </Container>
    );
  }
}

export default NewKegScreen;
