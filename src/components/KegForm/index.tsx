import * as React from 'react';

import { MAX_OUNCES_BY_KEG_TYPE } from '@brewskey/js-api';
import nullthrows from 'nullthrows';
import { useForm } from 'react-hook-form';
import { View } from 'react-native';

import { KEG_NAME_BY_KEG_TYPE } from '@/constants';
import { DropdownInput } from 'common/form/DropdownInput';
import { Form } from 'common/form/Form';
import { FormField } from 'common/form/FormField';
import { FormValidationMessage } from 'common/form/FormValidationMessage';
import { SubmitButton } from 'common/form/SubmitButton';
import { SectionContent } from 'common/SectionContent';
import { KegLevelSliderField } from 'components/KegForm/KegLevelSliderField';
import { BeveragePicker } from 'components/pickers/BeveragePicker';
import { COLORS } from 'theme';
import { calculateKegLevel } from 'utils';

import type {
  Beverage,
  EntityID,
  Keg,
  KegMutator,
  KegType,
  ShortenedEntity,
} from '@brewskey/js-api';
import type { SubmitHandler } from 'react-hook-form';

const KEG_VALUES = (Object.keys(KEG_NAME_BY_KEG_TYPE) as KegType[])
  .sort((a, b) =>
    MAX_OUNCES_BY_KEG_TYPE[a] > MAX_OUNCES_BY_KEG_TYPE[b] ? 1 : -1,
  )
  .map((kegType) => ({
    label: KEG_NAME_BY_KEG_TYPE[kegType],
    value: kegType,
  }));

interface Props {
  keg?: Keg;
  onFloatedSubmit: (values: KegMutator) => KegMutator | Promise<KegMutator>;
  onReplaceSubmit?: (values: KegMutator) => KegMutator | Promise<KegMutator>;
  onSubmit: (values: KegMutator) => KegMutator | Promise<KegMutator>;
  showReplaceButton?: boolean;
  submitButtonLabel: string;
  tapId: EntityID;
}

type FormFields = KegMutator;

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
  const initialBeverage =
    (keg?.beverage as Beverage | ShortenedEntity | null | undefined) ?? null;

  // Calculate initial starting percentage before form initialization
  const initialKegType = keg?.kegType;
  const initialKegTypeMaxOunces = initialKegType
    ? MAX_OUNCES_BY_KEG_TYPE[initialKegType]
    : 0;
  const initialStartingPercentage =
    initialKegType && initialKegTypeMaxOunces && keg
      ? (keg.maxOunces / initialKegTypeMaxOunces) * 100
      : 100;

  const form = useForm<FormFields>({
    defaultValues: {
      tapId,
      id: keg?.id,
      beverageId: initialBeverage?.id,
      kegType: initialKegType,
      startingPercentage: initialStartingPercentage,
    },
  });

  const kegType = form.watch('kegType');

  const selectedKegTypeMaxOunces = MAX_OUNCES_BY_KEG_TYPE[kegType] || 0;

  const currentPercentage = !keg ? 100 : calculateKegLevel(keg);
  const shouldShowFloatedButton =
    currentPercentage < 10 && keg?.floatedDate === null;
  const shouldReplaceBeDisnabled = currentPercentage === 100;

  const onSubmitForm: SubmitHandler<FormFields> = (values) => {
    onSubmit(values);
  };
  const onReplaceSubmitForm: SubmitHandler<FormFields> | undefined =
    onReplaceSubmit
      ? async (values) => nullthrows(onReplaceSubmit)(values)
      : undefined;
  const onFloatKegForm: SubmitHandler<FormFields> = async (values) =>
    nullthrows(onFloatedSubmit)(values);
  return (
    <Form form={form}>
      <View testID="keg-form">
        <FormValidationMessage />
        <FormField<FormFields, typeof BeveragePicker>
          component={BeveragePicker}
          defaultValue={initialBeverage}
          label="Select Beverage"
          name="beverageId"
          required="Beverage is required"
          testID="beverage-dropdown"
        />
        <FormField<FormFields, typeof DropdownInput>
          component={DropdownInput}
          confirmSelectItem={false}
          data={KEG_VALUES}
          defaultValue={KEG_VALUES.find((k) => k.value === initialKegType)}
          label="Select Keg Type"
          labelField="label"
          mode="default"
          name="kegType"
          required="Keg type is required"
          testID="keg-type-dropdown"
          valueField="value"
        />
        <FormField<FormFields, typeof KegLevelSliderField>
          component={KegLevelSliderField}
          label="Keg Level"
          maxOunces={selectedKegTypeMaxOunces}
          name="startingPercentage"
          testID="input-startingPercentage"
        />
        {!showReplaceButton ? null : (
          <SectionContent paddedVertical>
            {!shouldShowFloatedButton ? null : (
              <SubmitButton<FormFields>
                allowSubmitWhenValid
                buttonStyle={{
                  backgroundColor: COLORS.accent,
                  marginBottom: 4,
                }}
                onSubmit={onFloatKegForm}
                title="Keg Floated"
              />
            )}
            {onReplaceSubmitForm != null ? (
              <SubmitButton<FormFields>
                allowSubmitWhenValid
                disabled={shouldReplaceBeDisnabled}
                onSubmit={onReplaceSubmitForm}
                testID="button-replace-keg"
                title="Replace keg"
              />
            ) : null}
          </SectionContent>
        )}
        <SectionContent paddedVertical>
          <SubmitButton<FormFields>
            allowSubmitWhenValid={!keg}
            onSubmit={onSubmitForm}
            title={submitButtonLabel}
            testID={
              keg
                ? 'submit-button-update-current-keg'
                : 'submit-button-create-keg'
            }
          />
        </SectionContent>
      </View>
    </Form>
  );
};
