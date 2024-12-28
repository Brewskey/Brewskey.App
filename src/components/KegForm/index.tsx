import type {
  Beverage,
  EntityID,
  Keg,
  KegMutator,
  KegType,
} from '@brewskey/js-api';
import type { FormProps, ValidationFunction } from '../../common/form/types';

import * as React from 'react';
import { View } from 'react-native';
import nullthrows from 'nullthrows';
import { MAX_OUNCES_BY_KEG_TYPE } from '@brewskey/js-api';

import Button from '../../common/buttons/Button';
import SectionContent from '../../common/SectionContent';
import SimplePicker from '../../components/pickers/SimplePicker';
import BeveragePicker from '../pickers/BeveragePicker';
import KegLevelSliderField from './KegLevelSliderField';
import { KEG_NAME_BY_KEG_TYPE } from '../../constants';
import { COLORS } from '../../theme';
import { calculateKegLevel } from '../../utils';
import { Form } from '../../common/form/Form';
import { useForm } from 'react-hook-form';
import { Dropdown } from '../../common/form/Dropdown';

const validate: ValidationFunction<KegMutator> = (values) => {
  const errors: Record<string, any> = {};

  if (!values.beverageId) {
    errors.beverageId = 'Beverage is required';
  }

  if (!values.kegType) {
    errors.kegType = 'Keg type is required';
  }
  return errors;
};

const KEG_VALUES = (Object.keys(KEG_NAME_BY_KEG_TYPE) as KegType[])
  .sort((a, b) =>
    MAX_OUNCES_BY_KEG_TYPE[a] > MAX_OUNCES_BY_KEG_TYPE[b] ? 1 : -1,
  )
  .map((kegType) => ({ label: KEG_NAME_BY_KEG_TYPE[kegType], value: kegType }));

type Props = {
  keg?: Keg;
  onFloatedSubmit: (values: KegMutator) => KegMutator | Promise<KegMutator>;
  onReplaceSubmit?: (values: KegMutator) => KegMutator | Promise<KegMutator>;
  onSubmit: (values: KegMutator) => KegMutator | Promise<KegMutator>;
  showReplaceButton?: boolean;
  submitButtonLabel: string;
  tapId: EntityID;
};

type FormFields = KegMutator;

export const KegForm: React.FC<Props> = ({
  keg,
  showReplaceButton,
  submitButtonLabel,
  tapId,
}) => {
  // _onSubmit = () => this.props.handleSubmit(this.props.onSubmit);

  // _onReplaceSubmit = () =>
  //   this.props.handleSubmit(nullthrows(this.props.onReplaceSubmit));

  // _onFloatKeg = () =>
  //   this.props.handleSubmit(nullthrows(this.props.onFloatedSubmit));

  const form = useForm<FormFields>();
  const kegType = form.watch('kegType');

  const selectedKegTypeMaxOunces = MAX_OUNCES_BY_KEG_TYPE[kegType] || 0;
  const isInitialKegType = keg && keg.kegType === kegType;

  const initialStartingPercentage =
    isInitialKegType && selectedKegTypeMaxOunces && keg
      ? (keg.maxOunces / selectedKegTypeMaxOunces) * 100
      : 100;

  const currentPercentage = !keg ? 100 : calculateKegLevel(keg);
  const shouldShowFloatedButton =
    currentPercentage < 10 && keg && keg.floatedDate === null;
  const shouldReplaceBeDisnabled = currentPercentage === 100;

  return (
    <Form {...form} defaultValues={{ tapId, id: keg?.id }}>
      <View>
        {/* <FormField
          component={BeveragePicker}
          disabled={submitting}
          initialValue={keg && keg.beverage}
          name="beverageId"
          parseOnSubmit={(value: Beverage): EntityID => value.id}
        /> */}
        <Dropdown
          name="beverageId"
          data={[]}
          labelField={[]}
          valueField={[]}
          onChangeText={() => {}}
          onBlur={() => {}}
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
        <FormField initialValue={keg && keg.id} name="id" />
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
              disabled={shouldReplaceBeDisnabled || invalid || submitting}
              loading={submitting}
              onPress={this._onReplaceSubmit}
              title="Replace keg"
            />
          </SectionContent>
        )}
        <SectionContent paddedVertical>
          <Button
            disabled={pristine || invalid || submitting}
            loading={submitting}
            onPress={this._onSubmit}
            title={submitButtonLabel}
          />
        </SectionContent>
      </View>
    </Form>
  );
};

export default KegForm;
