// @flow

import type { Beverage, EntityID, Keg, KegMutator } from 'brewskey.js-api';
import type { FormProps } from '../../common/form/types';

import * as React from 'react';
import nullthrows from 'nullthrows';
import { MAX_OUNCES_BY_KEG_TYPE } from 'brewskey.js-api';
import InjectedComponent from '../../common/InjectedComponent';
import { observer } from 'mobx-react/native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { FormValidationMessage } from 'react-native-elements';
import Button from '../../common/buttons/Button';
import SectionContent from '../../common/SectionContent';
import SimplePicker from '../../components/pickers/SimplePicker';
import BeveragePicker from '../pickers/BeveragePicker';
import KegLevelSliderField from './KegLevelSliderField';
import { KEG_NAME_BY_KEG_TYPE } from '../../constants';
import { form, FormField } from '../../common/form';
import { COLORS } from '../../theme';
import { calculateKegLevel } from '../../utils';

const validate = (values: KegMutator): { [key: string]: string } => {
  const errors = {};

  if (!values.beverageId) {
    errors.beverageId = 'Beverage is required';
  }

  if (!values.kegType) {
    errors.kegType = 'Keg type is required';
  }
  return errors;
};

const KEG_VALUES = Object.entries(KEG_NAME_BY_KEG_TYPE)
  .sort(
    (a, b) =>
      MAX_OUNCES_BY_KEG_TYPE[a[0]] > MAX_OUNCES_BY_KEG_TYPE[b[0]] ? 1 : -1,
  )
  .map(([type, name]: [any, any]) => ({ label: name, value: type }));

type Props = {|
  keg?: Keg,
  onFloatedSubmit: (values: KegMutator) => void | Promise<any>,
  onReplaceSubmit?: (values: KegMutator) => void | Promise<any>,
  onSubmit: (values: KegMutator) => void | Promise<any>,
  showReplaceButton?: boolean,
  submitButtonLabel: string,
  tapId: EntityID,
|};

type InjectedProps = FormProps;

@form({ validate })
@observer
class KegForm extends InjectedComponent<InjectedProps, Props> {
  _onSubmit = () => this.injectedProps.handleSubmit(this.props.onSubmit);

  _onReplaceSubmit = () =>
    this.injectedProps.handleSubmit(nullthrows(this.props.onReplaceSubmit));

  _onFloatKeg = () =>
    this.injectedProps.handleSubmit(nullthrows(this.props.onFloatedSubmit));

  render() {
    const {
      keg = {},
      showReplaceButton,
      submitButtonLabel,
      tapId,
    } = this.props;
    const {
      formError,
      invalid,
      pristine,
      submitting,
      values,
    } = this.injectedProps;

    const selectedKegTypeMaxOunces =
      MAX_OUNCES_BY_KEG_TYPE[values.kegType] || 0;

    const isInitialKegType = keg.kegType === values.kegType;

    const initialStartingPercentage =
      isInitialKegType && selectedKegTypeMaxOunces
        ? (keg.maxOunces / selectedKegTypeMaxOunces) * 100
        : 100;

    const currentPercentage = !keg ? 100 : calculateKegLevel(keg);
    const shouldShowFloatedButton =
      currentPercentage < 10 && keg.floatedDate === null;

    return (
      <KeyboardAwareScrollView keyboardShouldPersistTaps="always">
        <FormField
          component={BeveragePicker}
          disabled={submitting}
          initialValue={keg.beverage}
          name="beverageId"
          parseOnSubmit={(value: Beverage): EntityID => value.id}
        />
        <FormField
          component={SimplePicker}
          disabled={submitting}
          doesRequireConfirmation={false}
          headerTitle="Select Keg Type"
          initialValue={keg && keg.kegType}
          label="Keg type"
          name="kegType"
          pickerValues={KEG_VALUES}
        />
        <FormField
          component={KegLevelSliderField}
          initialValue={initialStartingPercentage}
          maxOunces={selectedKegTypeMaxOunces}
          name="startingPercentage"
        />
        <FormField initialValue={tapId} name="tapId" />
        <FormField initialValue={keg.id} name="id" />
        <FormValidationMessage>{formError}</FormValidationMessage>
        {!showReplaceButton ? null : (
          <SectionContent paddedVertical>
            {!shouldShowFloatedButton ? null : (
              <Button
                backgroundColor={COLORS.accent}
                disabled={submitting}
                loading={submitting}
                onPress={this._onFloatKeg}
                style={{ marginBottom: 4 }}
                title="Keg Floated"
              />
            )}
            <Button
              disabled={pristine || invalid || submitting}
              loading={submitting}
              onPress={this._onReplaceSubmit}
              title="Replace keg"
            />
          </SectionContent>
        )}
        <SectionContent paddedVertical>
          <Button
            color={showReplaceButton ? COLORS.primary2 : undefined}
            disabled={pristine || invalid || submitting}
            loading={submitting}
            onPress={this._onSubmit}
            title={submitButtonLabel}
            transparent={showReplaceButton}
          />
        </SectionContent>
      </KeyboardAwareScrollView>
    );
  }
}

export default KegForm;
