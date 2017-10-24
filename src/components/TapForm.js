// @flow

import type { FormChildProps, FormFieldChildProps } from '../common/form/types';

import * as React from 'react';
import { inject, observer } from 'mobx-react';
import { Button, FormValidationMessage } from 'react-native-elements';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import PickerField from './PickerField';
import CheckBoxField from './CheckBoxField';
import TextField from './TextField';
import Form from '../common/form/Form';
import FormField from '../common/form/FormField';

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
  deviceStore: DAOEntityStore<Device, DeviceMutator>,
  onSubmit: (values: DeviceMutator) => Promise<void>,
  submitButtonLabel: string,
  tap?: Tap,
|};

@inject('deviceStore')
@observer
class TapForm extends React.Component<Props> {
  componentWillMount() {
    // todo temporary solution for filling brewskey box picker options
    this.props.deviceStore.fetchMany();
  }

  render(): React.Node {
    const { onSubmit, submitButtonLabel, tap = {} } = this.props;
    return (
      <Form validate={validate}>
        {({
          formError,
          handleSubmit,
          invalid,
          pristine,
          submitting,
        }: FormChildProps): React.Node => (
          <KeyboardAwareScrollView>
            <FormField initialValue={tap.name} name="name">
              {(formFieldProps: FormFieldChildProps): React.Node => (
                <TextField
                  disabled={submitting}
                  label="Name"
                  {...formFieldProps}
                />
              )}
            </FormField>
            <FormField initialValue={tap.description} name="description">
              {(formFieldProps: FormFieldChildProps): React.Node => (
                <TextField
                  disabled={submitting}
                  label="Description"
                  {...formFieldProps}
                />
              )}
            </FormField>
            <FormField initialValue={tap.deviceId} name="device">
              {(formFieldProps: FormFieldChildProps): React.Node => (
                <PickerField label="Brewskey Box" {...formFieldProps}>
                  {this.props.deviceStore.all.map(
                    (device: Device): React.Node => (
                      <PickerField.Item
                        key={device.id}
                        label={device.name}
                        value={device}
                      />
                    ),
                  )}
                </PickerField>
              )}
            </FormField>
            <FormField
              initialValue={tap.hideLeaderboard}
              name="hideLeaderboard"
            >
              {(formFieldProps: FormFieldChildProps): React.Node => (
                <CheckBoxField
                  disabled={submitting}
                  label="Hide leaderboard"
                  {...formFieldProps}
                />
              )}
            </FormField>
            <FormField initialValue={tap.hideStats} name="hideStats">
              {(formFieldProps: FormFieldChildProps): React.Node => (
                <CheckBoxField
                  disabled={submitting}
                  label="Hide stats"
                  {...formFieldProps}
                />
              )}
            </FormField>
            <FormField initialValue={tap.disableBadges} name="disableBadges">
              {(formFieldProps: FormFieldChildProps): React.Node => (
                <CheckBoxField
                  disabled={submitting}
                  label="Disable badges"
                  {...formFieldProps}
                />
              )}
            </FormField>
            <FormField initialValue={tap.id} name="id" />
            <FormValidationMessage>{formError}</FormValidationMessage>
            <Button
              disabled={submitting || invalid || pristine}
              onPress={(): void => handleSubmit(onSubmit)}
              title={submitButtonLabel}
            />
          </KeyboardAwareScrollView>
        )}
      </Form>
    );
  }
}

export default TapForm;
