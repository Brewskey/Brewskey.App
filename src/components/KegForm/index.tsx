import type {
  Beverage,
  EntityID,
  Keg,
  KegMutator,
  KegType,
} from '@brewskey/js-api';
import type { ValidationFunction } from '../../common/form/types';

import * as React from 'react';
import { View } from 'react-native';
import { MAX_OUNCES_BY_KEG_TYPE } from '@brewskey/js-api';

import Button from '../../common/buttons/Button';
import SectionContent from '../../common/SectionContent';
import KegLevelSliderField from './KegLevelSliderField';
import { KEG_NAME_BY_KEG_TYPE } from '../../constants';
import { COLORS } from '../../theme';
import { calculateKegLevel } from '../../utils';
import { Form } from '../../common/form/Form';
import { useForm } from 'react-hook-form';
import { DropdownInput } from '../../common/form/DropdownInput';
import { useGetBeverages } from '../../hooks/queries/BeverageQueries';
import SelectableListItem from '../../common/SelectableListItem';
import BeverageAvatar from '../../common/avatars/BeverageAvatar';
import nullthrows from 'nullthrows';
import { FormField } from '../../common/form/FormField';

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
  onFloatedSubmit,
  onReplaceSubmit,
  onSubmit,
  showReplaceButton,
  submitButtonLabel,
  tapId,
}) => {
  const { data: beverages } = useGetBeverages();
  const form = useForm<FormFields>({
    defaultValues: {
      tapId,
      id: keg?.id,
    },
  });

  const {
    handleSubmit,
    formState: { isDirty, isSubmitting, isValid },
  } = form;

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

  const onSubmitForm = handleSubmit(onSubmit);
  const onReplaceSubmitForm = onReplaceSubmit
    ? handleSubmit(nullthrows(onReplaceSubmit))
    : undefined;
  const onFloatKegForm = handleSubmit(nullthrows(onFloatedSubmit));

  return (
    <Form form={form}>
      <View>
        <FormField
          component={DropdownInput<Beverage>}
          name="beverageId"
          label="Select Beverage"
          required="Beverage is required"
          data={beverages?.pages[0] ?? []}
          labelField="name"
          valueField="id"
          renderItem={(beverage, isSelected) => (
            <SelectableListItem
              leftAvatar={<BeverageAvatar beverageId={beverage.id} />}
              chevron={false}
              isSelected={isSelected ?? false}
              item={beverage}
              subtitle={beverage.beverageType}
              title={beverage.name}
            />
          )}
        />
        <FormField
          component={
            DropdownInput<{
              label: (typeof KEG_NAME_BY_KEG_TYPE)[KegType];
              value: KegType;
            }>
          }
          name="kegType"
          label="Select Keg Type"
          required="Keg type is required"
          data={KEG_VALUES}
          labelField="label"
          valueField="value"
        />
        <FormField
          component={KegLevelSliderField}
          label="Keg Level"
          maxOunces={selectedKegTypeMaxOunces}
          name="startingPercentage"
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
              title="Replace keg"
            />
          </SectionContent>
        )}
        <SectionContent paddedVertical>
          <Button
            disabled={!isDirty || !isValid || isSubmitting}
            loading={isSubmitting}
            onPress={onSubmitForm}
            title={submitButtonLabel}
          />
        </SectionContent>
      </View>
    </Form>
  );
};

export default KegForm;
