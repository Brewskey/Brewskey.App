// @flow

import type { Beverage, EntityID, Keg, KegMutator } from 'brewskey.js-api';
import type { FormProps } from '../../common/form/types';

import * as React from 'react';
import nullthrows from 'nullthrows';
import { MAX_OUNCES_BY_KEG_TYPE } from 'brewskey.js-api';
import InjectedComponent from '../../common/InjectedComponent';
import { BeverageStore } from '../../stores/DAOStores';
import { observer } from 'mobx-react';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { FormValidationMessage } from 'react-native-elements';
import Button from '../../common/buttons/Button';
import SectionContent from '../../common/SectionContent';
import PickerField from '../../common/PickerField';
import BeveragePicker from '../BeveragePicker';
import KegLevelSliderField from './KegLevelSliderField';
import { KEG_NAME_BY_KEG_TYPE } from '../../constants';
import { form, FormField } from '../../common/form';
import { COLORS } from '../../theme';

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

type Props = {|
  keg?: Keg,
  onReplaceSubmit?: (values: KegMutator) => void | Promise<void>,
  onSubmit: (values: KegMutator) => void | Promise<void>,
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
        ? keg.maxOunces / selectedKegTypeMaxOunces * 100
        : 100;

    return (
      <KeyboardAwareScrollView>
        <FormField
          component={BeveragePicker}
          disabled={submitting}
          initialValue={keg.beverage}
          itemsLoader={BeverageStore.getMany()}
          label="Beverage"
          name="beverageId"
          parseOnSubmit={(value: Beverage): EntityID => value.id}
        />
        <FormField
          component={PickerField}
          disabled={submitting}
          initialValue={keg && keg.kegType}
          label="Keg type"
          name="kegType"
        >
          {Object.entries(KEG_NAME_BY_KEG_TYPE).map(
            ([type, name]: [any, any]): React.Node => (
              <PickerField.Item key={type} label={name} value={type} />
            ),
          )}
        </FormField>
        <FormField
          component={KegLevelSliderField}
          initialValue={initialStartingPercentage}
          maxOunces={selectedKegTypeMaxOunces}
          name="startingPercentage"
        />
        <FormField initialValue={tapId} name="tapId" />
        <FormField initialValue={keg.id} name="id" />
        <FormValidationMessage>{formError}</FormValidationMessage>
        {showReplaceButton && (
          <SectionContent paddedVertical>
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
