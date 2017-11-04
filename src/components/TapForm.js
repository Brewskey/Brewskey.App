// @flow

import type { Device, DeviceMutator, Tap, TapMutator } from 'brewskey.js-api';
import type DAOEntityStore from '../stores/DAOEntityStore';
import type { FormProps } from '../common/form/types';

import * as React from 'react';
import InjectedComponent from '../common/InjectedComponent';
import { inject, observer } from 'mobx-react';
import { Button, FormValidationMessage } from 'react-native-elements';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import PickerField from './PickerField';
import CheckBoxField from './CheckBoxField';
import TextField from './TextField';
import { form, FormField } from '../common/form';

const validate = (values: TapMutator): { [key: string]: string } => {
  const errors = {};

  if (!values.name) {
    errors.name = 'Name is required';
  }

  if (!values.device) {
    errors.device = 'Brewskey box is required';
  }

  return errors;
};

type Props = {|
  onSubmit: (values: TapMutator) => Promise<void>,
  submitButtonLabel: string,
  tap?: Tap,
|};

type InjectedProps = {|
  ...FormProps,
  deviceStore: DAOEntityStore<Device, DeviceMutator>,
|};

@form({ validate })
@inject('deviceStore')
@observer
class TapForm extends InjectedComponent<InjectedProps, Props> {
  componentWillMount() {
    // todo temporary solution for filling brewskey box picker options
    this.injectedProps.deviceStore.fetchMany();
  }

  render(): React.Node {
    const { submitButtonLabel, tap = {} } = this.props;
    const {
      formError,
      handleSubmit,
      invalid,
      pristine,
      submitting,
    } = this.injectedProps;

    return (
      <KeyboardAwareScrollView>
        <FormField
          component={TextField}
          initialValue={tap.name}
          disabled={submitting}
          name="name"
          label="Name"
        />
        <FormField
          component={TextField}
          initialValue={tap.description}
          name="description"
          label="Description"
        />
        <FormField
          component={PickerField}
          initialValue={tap.device}
          disabled={submitting}
          name="device"
          label="Brewskey box"
        >
          {this.injectedProps.deviceStore.all.map(
            (device: Device): React.Node => (
              <PickerField.Item
                key={device.id}
                label={device.name}
                value={device}
              />
            ),
          )}
        </FormField>
        <FormField
          component={CheckBoxField}
          initialValue={tap.hideLeaderboard}
          disabled={submitting}
          name="hideLeaderboard"
          label="Hide leaderboard"
        />
        <FormField
          component={CheckBoxField}
          initialValue={tap.hideStats}
          disabled={submitting}
          name="hideStats"
          label="Hide stats"
        />
        <FormField
          component={CheckBoxField}
          initialValue={tap.disableBadges}
          disabled={submitting}
          name="disableBadges"
          label="Disable badges"
        />
        <FormField initialValue={tap.id} name="id" />
        <FormValidationMessage>{formError}</FormValidationMessage>
        <Button
          disabled={submitting || invalid || pristine}
          onPress={handleSubmit}
          title={submitButtonLabel}
        />
      </KeyboardAwareScrollView>
    );
  }
}

export default TapForm;
