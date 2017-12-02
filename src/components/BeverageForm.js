// @flow

import type {
  Availability,
  Beverage,
  BeverageMutator,
  Glass,
  Srm,
  Style,
} from 'brewskey.js-api';
import type { FormProps } from '../common/form/types';

import * as React from 'react';
import InjectedComponent from '../common/InjectedComponent';
import { observer } from 'mobx-react';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { FormValidationMessage } from 'react-native-elements';
import Button from '../common/buttons/Button';
import withComponentStores from '../common/withComponentStores';
import BeverageFormStore from '../stores/BeverageFormStore';
import { form, FormField } from '../common/form';
import CheckBoxField from './CheckBoxField';
import TextField from './TextField';
import PickerField from './PickerField';

const YEARS_RANGE_LENGTH = 10;

type Props = {|
  beverage?: Beverage,
  onSubmit: (values: BeverageMutator) => void | Promise<void>,
  submitButtonLabel: string,
|};

type InjectedProps = FormProps & {|
  beverageFormStore: BeverageFormStore,
|};

@form()
@withComponentStores({ beverageFormStore: new BeverageFormStore() })
@observer
class BeverageForm extends InjectedComponent<InjectedProps, Props> {
  // todo Implement custom component for srm
  // todo implement autocomplete for style?
  render() {
    const { beverage = {}, submitButtonLabel } = this.props;

    const {
      beverageFormStore,
      formError,
      handleSubmit,
      invalid,
      pristine,
      submitting,
      values,
    } = this.injectedProps;

    const currentYear = new Date().getFullYear();
    const yearsRange = [...Array(YEARS_RANGE_LENGTH)]
      .map(
        (value: null, index: number): number =>
          currentYear - YEARS_RANGE_LENGTH + index + 1,
      )
      .reverse();

    return (
      <KeyboardAwareScrollView>
        <FormField
          component={TextField}
          initialValue={beverage.name}
          disabled={submitting}
          name="name"
          label="Name"
        />
        <FormField
          component={TextField}
          initialValue={beverage.description}
          disabled={submitting}
          name="description"
          label="Description"
        />
        <FormField
          component={PickerField}
          initialValue={beverage.beverageType}
          disabled={submitting}
          name="beverageType"
          label="Type"
        >
          <PickerField.Item label="Beer" value="Beer" />
          <PickerField.Item label="Cider" value="Cider" />
          <PickerField.Item label="Coffee" value="Coffee" />
          <PickerField.Item label="Soda" value="Soda" />
        </FormField>
        <FormField
          component={PickerField}
          initialValue={beverage.servingTemperature}
          disabled={submitting}
          name="servingTemperature"
          label="Serving temperature"
        >
          <PickerField.Item label="Cellar" value="cellar" />
          <PickerField.Item label="Cold" value="cold" />
          <PickerField.Item label="Cool" value="cool" />
          <PickerField.Item label="Hot" value="hot" />
          <PickerField.Item label="Very Cold" value="very_cold" />
          <PickerField.Item label="Warm" value="warm" />
        </FormField>
        <FormField
          component={PickerField}
          initialValue={beverage.year}
          disabled={submitting}
          name="year"
          label="Year"
        >
          {yearsRange.map((year: number): React.Node => (
            <PickerField.Item
              key={year}
              label={year.toString()}
              value={year.toString()}
            />
          ))}
        </FormField>
        <FormField
          component={PickerField}
          initialValue={beverage.availability && beverage.availability.id}
          disabled={submitting}
          name="availableId"
          label="Availability"
        >
          {beverageFormStore.availabilities.map(
            ({ id, name }: Availability): React.Node => (
              <PickerField.Item key={id} label={name} value={id} />
            ),
          )}
        </FormField>
        <FormField
          component={PickerField}
          initialValue={beverage.glass && beverage.glass.id}
          disabled={submitting}
          name="glasswareId"
          label="Glass"
        >
          {beverageFormStore.glasses.map(({ id, name }: Glass): React.Node => (
            <PickerField.Item key={id} label={name} value={id} />
          ))}
        </FormField>
        <FormField
          component={CheckBoxField}
          initialValue={beverage.isOrganic}
          disabled={submitting}
          name="isOrganic"
          label="Is Organic?"
        />
        {values.beverageType === 'Beer' && [
          <FormField
            component={PickerField}
            disabled={submitting}
            initialValue={beverage.srm && beverage.srm.id}
            key="srm"
            label="Srm"
            name="srmId"
          >
            {beverageFormStore.srm.map(({ id, name }: Srm): React.Node => (
              <PickerField.Item key={id} label={name} value={id} />
            ))}
          </FormField>,
          <FormField
            component={PickerField}
            disabled={submitting}
            initialValue={beverage.style && beverage.style.id}
            key="style"
            label="Style"
            name="styleId"
          >
            {beverageFormStore.styles.map(({ id, name }: Style): React.Node => (
              <PickerField.Item key={id} label={name} value={id} />
            ))}
          </FormField>,
          <FormField
            component={TextField}
            disabled={submitting}
            initialValue={beverage.abv}
            key="abv"
            keyboardType="numeric"
            label="ABV"
            name="abv"
          />,
          <FormField
            component={TextField}
            disabled={submitting}
            initialValue={beverage.originalGravity}
            key="og"
            keyboardType="numeric"
            label="Original Gravity"
            name="originalGravity"
          />,
          <FormField
            component={TextField}
            disabled={submitting}
            initialValue={beverage.ibu}
            key="ibu"
            keyboardType="numeric"
            label="IBU"
            name="ibu"
          />,
        ]}
        <FormField initialValue={beverage.id} name="id" />
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

export default BeverageForm;
