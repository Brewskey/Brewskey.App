// @flow

import type { EntityID, LoadObject, Tap, TapMutator } from 'brewskey.js-api';
import type { Navigation } from '../types';
import type { FormProps } from '../common/form/types';

import * as React from 'react';
import { withNavigationFocus } from 'react-navigation';
import { FormValidationMessage } from 'react-native-elements';
import InjectedComponent from '../common/InjectedComponent';
import nullthrows from 'nullthrows';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { computed } from 'mobx';
import { observer } from 'mobx-react/native';
import DAOApi from 'brewskey.js-api';
import { TapStore } from '../stores/DAOStores';
import ErrorScreen from '../common/ErrorScreen';
import { errorBoundary } from '../common/ErrorBoundary';
import NotificationsStore from '../stores/NotificationsStore';
import Container from '../common/Container';
import Section from '../common/Section';
import LoaderComponent from '../common/LoaderComponent';
import Button from '../common/buttons/Button';
import flatNavigationParamsAndScreenProps from '../common/flatNavigationParamsAndScreenProps';
import TextField from '../components/TextField';
import { form, FormField } from '../common/form';
import SnackBarStore from '../stores/SnackBarStore';
import { Fill } from 'react-slot-fill';

type InjectedProps = {|
  tapId: EntityID,
  navigation: Navigation,
|};

@errorBoundary(<ErrorScreen showBackButton />)
@flatNavigationParamsAndScreenProps
@observer
class EditTapPaymentsScreen extends InjectedComponent<InjectedProps> {
  static navigationOptions = {
    tabBarLabel: 'Payments',
  };

  @computed
  get _tapLoader(): LoadObject<Tap> {
    return TapStore.getByID(this.injectedProps.tapId);
  }

  _onFormSubmit = async (values: TapMutator): Promise<void> => {
    const id = nullthrows(values.id);
    DAOApi.TapDAO.put(id, values);
    await DAOApi.TapDAO.waitForLoaded(dao => dao.fetchByID(id));
    SnackBarStore.showMessage({ text: 'The tap edited' });
  };

  render() {
    return (
      <LoaderComponent
        loadedComponent={LoadedComponent}
        loader={this._tapLoader}
        onTapFormSubmit={this._onFormSubmit}
        updatingComponent={LoadedComponent}
      />
    );
  }
}

// type LoadedComponentProps = {
//   onTapFormSubmit: (values: TapMutator) => Promise<void>,
//   onToggleNotifications: () => void,
//   value: Tap,
// };

const validate = (values: TapMutator): { [key: string]: string } => {
  const errors = {};

  if (!values.deviceId) {
    errors.deviceId = 'Brewskey box is required';
  }

  return errors;
};

@form({ validate })
@withNavigationFocus
@observer
class LoadedComponent extends InjectedComponent<FormProps, Props> {
  _onToggleNotifications = () =>
    NotificationsStore.toggleNotificationsForTap(this.props.value.id);

  render() {
    const {
      formError,
      handleSubmit,
      invalid,
      isFocused,
      pristine,
      submitting,
    } = this.injectedProps;
    return (
      <Container>
        <KeyboardAwareScrollView keyboardShouldPersistTaps="always">
          <Section bottomPadded>
            <FormValidationMessage>{formError}</FormValidationMessage>
            <FormField
              component={TextField}
              name="ounces"
              keyboardType="numeric"
              label="Ounces"
            />
            <FormField
              component={TextField}
              name="price"
              keyboardType="numeric"
              label="Price"
            />
          </Section>
        </KeyboardAwareScrollView>
        {!isFocused ? null : (
          <Fill name="MainTabBar">
            <Button
              disabled={submitting || invalid || pristine}
              loading={submitting}
              onPress={handleSubmit}
              style={{ marginVertical: 12 }}
              title="Update Payment"
            />
          </Fill>
        )}
      </Container>
    );
  }
}

export default EditTapPaymentsScreen;
