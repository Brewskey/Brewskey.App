// @flow

import type { Device, Tap, TapMutator } from 'brewskey.js-api';
import type { FormProps } from '../common/form/types';

import * as React from 'react';
import InjectedComponent from '../common/InjectedComponent';
import { observer } from 'mobx-react';
import { Button, FormValidationMessage } from 'react-native-elements';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { DeviceStore } from '../stores/DAOStores';
import CheckBoxField from './CheckBoxField';
import TextField from './TextField';
import PickerField from '../common/PickerField';
import LoaderPickerField from '../common/PickerField/LoaderPickerField';
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
  onSubmit: (values: TapMutator) => void | Promise<void>,
  submitButtonLabel: string,
  tap?: Tap,
|};

type InjectedProps = FormProps;

@form({ validate })
@observer
class TapForm extends InjectedComponent<InjectedProps, Props> {
  render() {
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
          component={LoaderPickerField}
          initialValue={tap.device && tap.device.id}
          itemsLoader={DeviceStore.getMany()}
          disabled={submitting}
          name="deviceId"
          label="Brewskey box"
        >
          {(items: Array<Device>): Array<React.Node> =>
            items.map(({ id, name }: Device): React.Node => (
              <PickerField.Item key={id} label={name} value={id} />
            ))
          }
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
