// @flow

import type { EntityID, Tap, TapMutator } from 'brewskey.js-api';
import type { Navigation } from '../types';

import * as React from 'react';
import InjectedComponent from '../common/InjectedComponent';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import DAOApi from 'brewskey.js-api';
import ErrorScreen from '../common/ErrorScreen';
import { errorBoundary } from '../common/ErrorBoundary';
import flatNavigationParamsAndScreenProps from '../common/flatNavigationParamsAndScreenProps';
import Container from '../common/Container';
import Header from '../common/Header';
import TapForm from '../components/TapForm';
import SnackBarStore from '../stores/SnackBarStore';

type InjectedProps = {|
  initialValues?: $Shape<Tap>,
  navigation: Navigation,
  onTapSetupFinish?: (tapID: EntityID) => void | Promise<any>,
  showBackButton?: boolean,
|};

@errorBoundary(<ErrorScreen showBackButton />)
@flatNavigationParamsAndScreenProps
class NewTapScreen extends InjectedComponent<InjectedProps> {
  static defaultProps = {
    showBackButton: true,
  };

  _onFormSubmit = async (values: TapMutator): Promise<void> => {
    const { navigation, onTapSetupFinish, showBackButton } = this.injectedProps;
    const clientID = DAOApi.TapDAO.post(values);
    const { id } = await DAOApi.TapDAO.waitForLoaded((dao) =>
      dao.fetchByID(clientID),
    );

    navigation.navigate('newFlowSensor', {
      onTapSetupFinish,
      showBackButton,
      tapId: id,
    });
    SnackBarStore.showMessage({ text: 'New tap created' });
  };

  render(): React.Node {
    const { initialValues, showBackButton } = this.injectedProps;

    return (
      <Container>
        <Header showBackButton={showBackButton} title="New tap" />
        <KeyboardAwareScrollView keyboardShouldPersistTaps="handled">
          <TapForm
            onSubmit={this._onFormSubmit}
            submitButtonLabel="Create tap"
            tap={initialValues}
          />
        </KeyboardAwareScrollView>
      </Container>
    );
  }
}

export default NewTapScreen;
