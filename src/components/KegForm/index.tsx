import * as React from 'react';

import { MAX_OUNCES_BY_KEG_TYPE } from '@brewskey/js-api';
import nullthrows from 'nullthrows';
import { useForm } from 'react-hook-form';
import { View } from 'react-native';

import { KegLevelSliderField } from './KegLevelSliderField';
import { Button } from '../../common/buttons/Button';
import { DropdownInput } from '../../common/form/DropdownInput';
import { Form } from '../../common/form/Form';
import { FormField } from '../../common/form/FormField';
import { FormValidationMessage } from '../../common/form/FormValidationMessage';
import { SubmitButton } from '../../common/form/SubmitButton';
import { SectionContent } from '../../common/SectionContent';
import { KEG_NAME_BY_KEG_TYPE } from '../../constants';
import { COLORS } from '../../theme';
import { calculateKegLevel, extractShortenedEntityId } from '../../utils';
import { BeveragePicker } from '../pickers/BeveragePicker';

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

type FormFields = Omit<KegMutator, 'beverageId'> & {
  beverage: Beverage | ShortenedEntity | null;
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
      beverage: initialBeverage,
      kegType: initialKegType,
      startingPercentage: initialStartingPercentage,
    },
  });

  const {
    formState: { isSubmitting, isValid },
  } = form;

  const kegType = form.watch('kegType');

  const selectedKegTypeMaxOunces = MAX_OUNCES_BY_KEG_TYPE[kegType] || 0;

  const currentPercentage = !keg ? 100 : calculateKegLevel(keg);
  const shouldShowFloatedButton =
    currentPercentage < 10 && keg?.floatedDate === null;
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
    ? form.handleSubmit(async (values) =>
        nullthrows(onReplaceSubmit)(transformValues(values)),
      )
    : undefined;
  const onFloatKegForm = form.handleSubmit(async (values) =>
    nullthrows(onFloatedSubmit)(transformValues(values)),
  );
  return (
    <Form form={form}>
      <View testID="keg-form">
        <FormValidationMessage />
        <FormField
          component={BeveragePicker}
          defaultValue={initialBeverage}
          label="Select Beverage"
          name="beverage"
          required="Beverage is required"
          testID="beverage-picker-beverage"
        />
        <FormField
          component={DropdownInput}
          confirmSelectItem={false}
          data={KEG_VALUES}
          defaultValue={KEG_VALUES.find((k) => k.value === initialKegType)}
          label="Select Keg Type"
          labelField="label"
          mode="default"
          name="kegType"
          required="Keg type is required"
          testID="dropdown-kegType"
          valueField="value"
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
