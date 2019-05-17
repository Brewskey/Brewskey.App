// @flow

import type {
  Device,
  EntityID,
  Organization,
  Tap,
  TapMutator,
} from 'brewskey.js-api';
import type { FormProps } from '../common/form/types';

import * as React from 'react';
import { View } from 'react-native';
import { withNavigationFocus } from 'react-navigation';
import { LoadObject } from 'brewskey.js-api';
import InjectedComponent from '../common/InjectedComponent';
import { observer } from 'mobx-react/native';
import { computed } from 'mobx';
import { FormValidationMessage } from 'react-native-elements';
import Button from '../common/buttons/Button';
import CheckBoxField from './CheckBoxField';
import TextField from './TextField';
import DevicePicker from './pickers/DevicePicker';
import { form, FormField } from '../common/form';
import { Fill } from 'react-slot-fill';
import { DeviceStore, OrganizationStore } from '../stores/DAOStores';

const validate = (values: TapMutator): { [key: string]: string } => {
  const errors = {};

  if (!values.deviceId) {
    errors.deviceId = 'Brewskey box is required';
  }

  return errors;
};

type Props = {|
  onSubmit: (values: TapMutator) => void | Promise<any>,
  submitButtonLabel: string,
  tap?: Tap,
|};

type InjectedProps = FormProps;

@form({ validate })
@withNavigationFocus
@observer
class TapForm extends InjectedComponent<InjectedProps, Props> {
  @computed
  get _organizationLoader(): LoadObject<Organization> {
    const {
      values: { deviceId },
    } = this.injectedProps;

    if (deviceId == null) {
      return LoadObject.empty();
    }

    return DeviceStore.getByID(deviceId.id).map(device =>
      OrganizationStore.getByID(device.organization.id),
    );
  }

  render() {
    const { isFocused, submitButtonLabel, tap = {} } = this.props;
    const {
      formError,
      handleSubmit,
      invalid,
      pristine,
      submitting,
    } = this.injectedProps;

    const organization = this._organizationLoader.getValue();

    return (
      <View>
        <FormValidationMessage>{formError}</FormValidationMessage>
        <FormField initialValue={tap.id} name="id" />
        <FormField
          component={TextField}
          initialValue={tap.description}
          name="description"
          label="Description"
        />
        <FormField
          component={DevicePicker}
          initialValue={tap.device}
          name="deviceId"
          parseOnSubmit={(value: Device): EntityID => value.id}
        />
        {organization == null || !organization.canEnablePayments ? null : (
          <FormField
            component={CheckBoxField}
            disabled={submitting}
            initialValue={tap.isPaymentEnabled}
            label="Enable Payments for this tap"
            name="isPaymentEnabled"
          />
        )}
        <FormField
          component={CheckBoxField}
          disabled={submitting}
          initialValue={tap.hideLeaderboard}
          label="Hide leaderboard"
          name="hideLeaderboard"
        />
        <FormField
          component={CheckBoxField}
          disabled={submitting}
          initialValue={tap.hideStats}
          label="Hide Stats tab"
          name="hideStats"
        />
        <FormField
          component={CheckBoxField}
          disabled={submitting}
          initialValue={tap.disableBadges}
          label="Disable Badges for tap"
          name="disableBadges"
        />

        {!isFocused ? null : (
          <Fill name="MainTabBar">
            <Button
              disabled={submitting || invalid || pristine}
              loading={submitting}
              onPress={handleSubmit}
              style={{ marginVertical: 12 }}
              title={submitButtonLabel}
            />
          </Fill>
        )}
      </View>
    );
  }
}

export default TapForm;
