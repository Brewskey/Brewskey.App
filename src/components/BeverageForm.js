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
import { observer } from 'mobx-react/native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { FormValidationMessage } from 'react-native-elements';
import Button from '../common/buttons/Button';
import SectionContent from '../common/SectionContent';
import {
  AvailabilityStore,
  GlassStore,
  SrmStore,
  StyleStore,
} from '../stores/DAOStores';
import { form, FormField } from '../common/form';
import CheckBoxField from './CheckBoxField';
import TextField from './TextField';
import PickerField from '../common/PickerField';
import LoaderPickerField from '../common/PickerField/LoaderPickerField';

const YEARS_RANGE_LENGTH = 10;

const validate = (values: BeverageMutator): { [key: string]: string } => {
  const errors = {};
  if (!values.name) {
    errors.name = 'Name is required!';
  }

  if (!values.beverageType) {
    errors.beverageType = 'Beverage type is required';
  }

  return errors;
};

type Props = {|
  beverage?: Beverage,
  onSubmit: (values: BeverageMutator) => void | Promise<void>,
  submitButtonLabel: string,
|};

type InjectedProps = FormProps;

@form({ validate })
@observer
class BeverageForm extends InjectedComponent<InjectedProps, Props> {
  // todo Implement custom component for srm
  // todo implement autocomplete for style?
  render() {
    const { beverage = {}, submitButtonLabel } = this.props;

    const {
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
          disabled={submitting}
          initialValue={beverage.name}
          label="Name"
          name="name"
          nextFocusTo="description"
        />
        <FormField
          component={TextField}
          disabled={submitting}
          initialValue={beverage.description}
          label="Description"
          name="description"
        />
        <FormField
          component={PickerField}
          disabled={submitting}
          initialValue={beverage.beverageType}
          label="Type"
          name="beverageType"
        >
          <PickerField.Item label="Beer" value="Beer" />
          <PickerField.Item label="Cider" value="Cider" />
          <PickerField.Item label="Coffee" value="Coffee" />
          <PickerField.Item label="Soda" value="Soda" />
        </FormField>
        <FormField
          component={PickerField}
          disabled={submitting}
          initialValue={beverage.servingTemperature}
          label="Serving temperature"
          name="servingTemperature"
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
          disabled={submitting}
          initialValue={beverage.year}
          label="Year"
          name="year"
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
          component={LoaderPickerField}
          disabled={submitting}
          initialValue={beverage.availability && beverage.availability.id}
          itemsLoader={AvailabilityStore.getMany()}
          label="Availability"
          name="availableId"
        >
          {(items: Array<Availability>): Array<React.Node> =>
            items.map(({ id, name }: Availability): React.Node => (
              <PickerField.Item key={id} label={name} value={id} />
            ))
          }
        </FormField>
        <FormField
          component={LoaderPickerField}
          disabled={submitting}
          initialValue={beverage.glass && beverage.glass.id}
          itemsLoader={GlassStore.getMany()}
          label="Glass"
          name="glasswareId"
        >
          {(items: Array<Glass>): Array<React.Node> =>
            items.map(({ id, name }: Glass): React.Node => (
              <PickerField.Item key={id} label={name} value={id} />
            ))
          }
        </FormField>
        <FormField
          component={CheckBoxField}
          disabled={submitting}
          initialValue={beverage.isOrganic}
          label="Is Organic?"
          name="isOrganic"
        />
        {values.beverageType === 'Beer' && [
          <FormField
            component={LoaderPickerField}
            disabled={submitting}
            initialValue={beverage.srm && beverage.srm.id}
            itemsLoader={SrmStore.getMany()}
            key="srm"
            label="Srm"
            name="srmId"
          >
            {(items: Array<Srm>): Array<React.Node> =>
              items.map(({ id, name }: Srm): React.Node => (
                <PickerField.Item key={id} label={name} value={id} />
              ))
            }
          </FormField>,
          <FormField
            component={LoaderPickerField}
            disabled={submitting}
            initialValue={beverage.style && beverage.style.id}
            itemsLoader={StyleStore.getMany()}
            key="style"
            label="Style"
            name="styleId"
          >
            {(items: Array<Style>): Array<React.Node> =>
              items.map(({ id, name }: Style): React.Node => (
                <PickerField.Item key={id} label={name} value={id} />
              ))
            }
          </FormField>,
          <FormField
            component={TextField}
            disabled={submitting}
            initialValue={beverage.abv}
            key="abv"
            keyboardType="numeric"
            label="ABV"
            name="abv"
            nextFocusTo="originalGravity"
          />,
          <FormField
            component={TextField}
            disabled={submitting}
            initialValue={beverage.originalGravity}
            key="og"
            keyboardType="numeric"
            label="Original Gravity"
            name="originalGravity"
            nextFocusTo="ibu"
          />,
          <FormField
            component={TextField}
            disabled={submitting}
            initialValue={beverage.ibu}
            key="ibu"
            keyboardType="numeric"
            label="IBU"
            name="ibu"
            onSubmitEditing={handleSubmit}
          />,
        ]}
        <FormField initialValue={beverage.id} name="id" />
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

export default BeverageForm;
