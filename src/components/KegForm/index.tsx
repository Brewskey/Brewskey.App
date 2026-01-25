import type {
  Beverage,
  EntityID,
  Keg,
  KegMutator,
  KegType,
} from '@brewskey/js-api';

import * as React from 'react';
import { View } from 'react-native';
import { MAX_OUNCES_BY_KEG_TYPE } from '@brewskey/js-api';

import Button from '../../common/buttons/Button';
import SectionContent from '../../common/SectionContent';
import KegLevelSliderField from './KegLevelSliderField';
import { KEG_NAME_BY_KEG_TYPE } from '../../constants';
import { COLORS } from '../../theme';
import { calculateKegLevel, extractShortenedEntityId } from '../../utils';
import { Form } from '../../common/form/Form';
import { useForm, SubmitHandler } from 'react-hook-form';
import { DropdownInput } from '../../common/form/DropdownInput';
import nullthrows from 'nullthrows';
import { FormField } from '../../common/form/FormField';
import { BeveragePicker } from '../pickers';
import { FormValidationMessage } from '../../common/form/FormValidationMessage';
import { SubmitButton } from '../../common/form/SubmitButton';

const KEG_VALUES = (Object.keys(KEG_NAME_BY_KEG_TYPE) as KegType[])
  .sort((a, b) =>
    MAX_OUNCES_BY_KEG_TYPE[a] > MAX_OUNCES_BY_KEG_TYPE[b] ? 1 : -1,
  )
  .map((kegType) => ({
    label: KEG_NAME_BY_KEG_TYPE[kegType],
    value: kegType,
  }));

type Props = {
  keg?: Keg;
  onFloatedSubmit: (values: KegMutator) => KegMutator | Promise<KegMutator>;
  onReplaceSubmit?: (values: KegMutator) => KegMutator | Promise<KegMutator>;
  onSubmit: (values: KegMutator) => KegMutator | Promise<KegMutator>;
  showReplaceButton?: boolean;
  submitButtonLabel: string;
  tapId: EntityID;
};

type FormFields = Omit<KegMutator, 'beverageId'> & {
  beverage: Beverage | null;
};

export const KegForm: React.FC<Props> = ({
  keg,
  onFloatedSubmit,
  onReplaceSubmit,
  onSubmit,
  showReplaceButton,
  submitButtonLabel,
  tapId,
}) => {
  // Get the initial beverage from the keg (Keg has a beverage property)
  const initialBeverage = keg?.beverage ?? null;

  // Calculate initial starting percentage before form initialization
  const initialKegType = keg?.kegType;
  const initialKegTypeMaxOunces = initialKegType ? MAX_OUNCES_BY_KEG_TYPE[initialKegType] : 0;
  const initialStartingPercentage =
    initialKegType && initialKegTypeMaxOunces && keg
      ? (keg.maxOunces / initialKegTypeMaxOunces) * 100
      : 100;

  const form = useForm<FormFields>({
    defaultValues: {
      tapId,
      id: keg?.id,
      beverage: initialBeverage,
      kegType: initialKegType,
      startingPercentage: initialStartingPercentage,
    },
  });

  const {
    formState: { isDirty, isSubmitting, isValid },
  } = form;

  const kegType = form.watch('kegType');

  const selectedKegTypeMaxOunces = MAX_OUNCES_BY_KEG_TYPE[kegType] || 0;
  const isInitialKegType = keg && keg.kegType === kegType;

  const currentPercentage = !keg ? 100 : calculateKegLevel(keg);
  const shouldShowFloatedButton =
    currentPercentage < 10 && keg && keg.floatedDate === null;
  const shouldReplaceBeDisnabled = currentPercentage === 100;

  // Transform form values to convert beverage to beverageId
  const transformValues = (values: FormFields): KegMutator => {
    const { beverage, ...rest } = values;

    return {
      ...rest,
      beverageId: extractShortenedEntityId(beverage),
    } as KegMutator;
  };

  const onSubmitForm: SubmitHandler<FormFields> = (values) => {
    onSubmit(transformValues(values));
  };
  const onReplaceSubmitForm = onReplaceSubmit
    ? form.handleSubmit((values) => nullthrows(onReplaceSubmit)(transformValues(values)))
    : undefined;
  const onFloatKegForm = form.handleSubmit((values) => nullthrows(onFloatedSubmit)(transformValues(values)));

  return (
    <Form form={form}>
      <View testID="keg-form">
        <FormValidationMessage />
        <FormField
          component={BeveragePicker}
          testID="beverage-picker-beverage"
          name="beverage"
          label="Select Beverage"
          required="Beverage is required"
          multiple={false}
        />
        <FormField
          component={DropdownInput}
          name="kegType"
          label="Select Keg Type"
          required="Keg type is required"
          data={KEG_VALUES}
          labelField="label"
          testID="dropdown-kegType"
          valueField="value"
          mode="default"
          confirmSelectItem={false}
        />
        <FormField
          component={KegLevelSliderField}
          label="Keg Level"
          maxOunces={selectedKegTypeMaxOunces}
          name="startingPercentage"
          testID="input-startingPercentage"
        />
        {!showReplaceButton ? null : (
          <SectionContent paddedVertical>
            {!shouldShowFloatedButton ? null : (
              <Button
                backgroundColor={COLORS.accent}
                disabled={isSubmitting}
                loading={isSubmitting}
                onPress={onFloatKegForm}
                style={{ marginBottom: 4 }}
                title="Keg Floated"
              />
            )}
            <Button
              disabled={shouldReplaceBeDisnabled || !isValid || isSubmitting}
              loading={isSubmitting}
              onPress={onReplaceSubmitForm}
              testID="button-replace-keg"
              title="Replace keg"
            />
          </SectionContent>
        )}
        <SectionContent paddedVertical>
          <SubmitButton<FormFields>
            onSubmit={onSubmitForm}
            testID={keg ? 'submit-button-update-current-keg' : 'submit-button-create-keg'}
            title={submitButtonLabel}
            allowSubmitWhenValid={!keg}
          />
        </SectionContent>
      </View>
    </Form>
  );
};

export default KegForm;
