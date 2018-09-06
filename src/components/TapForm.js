// @flow

import type { Device, EntityID, Tap, TapMutator } from 'brewskey.js-api';
import type { FormProps } from '../common/form/types';

import * as React from 'react';
import InjectedComponent from '../common/InjectedComponent';
import { observer } from 'mobx-react/native';
import { FormValidationMessage } from 'react-native-elements';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import Button from '../common/buttons/Button';
import SectionContent from '../common/SectionContent';
import CheckBoxField from './CheckBoxField';
import TextField from './TextField';
import DevicePicker from './pickers/DevicePicker';
import { form, FormField } from '../common/form';

const validate = (values: TapMutator): { [key: string]: string } => {
  const errors = {};

  if (!values.name) {
    errors.name = 'Name is required';
  }

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
      <KeyboardAwareScrollView keyboardShouldPersistTaps="always">
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
          label="Hide stats"
          name="hideStats"
        />
        <FormField
          component={CheckBoxField}
          disabled={submitting}
          initialValue={tap.disableBadges}
          label="Disable badges"
          name="disableBadges"
        />
        <FormField initialValue={tap.id} name="id" />
        <FormValidationMessage>{formError}</FormValidationMessage>
        <SectionContent paddedVertical>
          <Button
            disabled={submitting || invalid || pristine}
            loading={submitting}
            onPress={handleSubmit}
            title={submitButtonLabel}
          />
        </SectionContent>
      </KeyboardAwareScrollView>
    );
  }
}

export default TapForm;
