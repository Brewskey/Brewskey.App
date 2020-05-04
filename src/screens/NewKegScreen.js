// @flow

import type { EntityID, KegMutator } from 'brewskey.js-api';
import type { Navigation } from '../types';

import * as React from 'react';
import InjectedComponent from '../common/InjectedComponent';
import { NavigationActions, StackActions } from 'react-navigation';
import DAOApi from 'brewskey.js-api';
import { TapStore } from '../stores/DAOStores';
import SnackBarStore from '../stores/SnackBarStore';
import ErrorScreen from '../common/ErrorScreen';
import { errorBoundary } from '../common/ErrorBoundary';
import KegForm from '../components/KegForm';
import Container from '../common/Container';
import Header from '../common/Header';
import flatNavigationParamsAndScreenProps from '../common/flatNavigationParamsAndScreenProps';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';

type InjectedComponentProps = {
  navigation: Navigation,
  onTapSetupFinish?: (tapID: EntityID) => void | Promise<any>,
  tapId: EntityID,
};

@errorBoundary(<ErrorScreen showBackButton />)
@flatNavigationParamsAndScreenProps
class NewKegScreen extends InjectedComponent<InjectedComponentProps> {
  _onFormSubmit = async (values: KegMutator): Promise<void> => {
    const { navigation, onTapSetupFinish, tapId } = this.injectedProps;
    const clientID = DAOApi.KegDAO.post(values);
    await DAOApi.KegDAO.waitForLoaded((dao) => dao.fetchByID(clientID));
    TapStore.flushCache();

    SnackBarStore.showMessage({ text: 'New keg added' });

    if (onTapSetupFinish) {
      onTapSetupFinish(tapId);
      return;
    }

    const resetRouteAction = StackActions.reset({
      actions: [
        NavigationActions.navigate({ routeName: 'taps' }),
        NavigationActions.navigate({
          params: { id: tapId },
          routeName: 'tapDetails',
        }),
      ],
      index: 1,
    });
    navigation.dispatch(resetRouteAction);
  };

  render(): React.Node {
    const { tapId } = this.injectedProps;
    return (
      <Container>
        <Header showBackButton title="Add keg" />
        <KeyboardAwareScrollView keyboardShouldPersistTaps="always">
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
