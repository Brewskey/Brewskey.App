// @flow

import type {
  Availability,
  Beverage,
  Glass,
  Srm,
  Style,
} from 'brewskey.js-api';
import type DAOEntityStore from '../stores/DAOEntityStore';
import type { FormChildProps, FormFieldChildProps } from '../common/form/types';

import * as React from 'react';
import { inject, observer } from 'mobx-react';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { Button, FormValidationMessage } from 'react-native-elements';
import Form from '../common/form/Form';
import FormField from '../common/form/FormField';

import TextField from './TextField';
import Picker from './Picker';

const YEARS_RANGE_LENGTH = 10;

type Props = {
  availabilityStore: DAOEntityStore<Availability, Availability>,
  beverage?: Beverage,
  glassStore: DAOEntityStore<Glass, Glass>,
  onSubmit: (values: Beverage) => Promise<void>,
  srmStore: DAOEntityStore<Srm, Srm>,
  styleStore: DAOEntityStore<Style, Style>,
  submitButtonLabel: string,
};

@inject('availabilityStore')
@inject('glassStore')
@inject('srmStore')
@inject('styleStore')
@observer
class BeverageForm extends React.Component<Props> {
  static defaultProps = {
    beverage: {},
  };

  componentWillMount() {
    // todo replace to fetchAll when it will be implemented
    this.props.availabilityStore.fetchMany();
    this.props.srmStore.fetchMany({
      orderBy: [{ column: 'hex', direction: 'desc ' }],
    });
    this.props.glassStore.fetchMany();
    this.props.styleStore.fetchMany();
  }

  // todo Implement custom component for srm
  // todo implement autocomplete for style
  // todo add isOrganic field when taps pr will be merged(need CheckboxField component)
  render(): React.Node {
    const { beverage, onSubmit, submitButtonLabel } = this.props;
    const currentYear = new Date().getFullYear();
    const yearsRange = [...Array(YEARS_RANGE_LENGTH)]
      .map(
        (value: null, index: string): number =>
          currentYear - YEARS_RANGE_LENGTH + index + 1,
      )
      .reverse();

    return (
      <Form>
        {({
          formError,
          handleSubmit,
          invalid,
          pristine,
          submitting,
          values,
        }: FormChildProps): React.Node => (
          <KeyboardAwareScrollView>
            <FormField initialValue={beverage.name} name="name">
              {(formFieldProps: FormFieldChildProps): React.Node => (
                <TextField
                  disabled={submitting}
                  label="Name"
                  {...formFieldProps}
                />
              )}
            </FormField>
            <FormField initialValue={beverage.description} name="description">
              {(formFieldProps: FormFieldChildProps): React.Node => (
                <TextField
                  disabled={submitting}
                  label="Description"
                  {...formFieldProps}
                />
              )}
            </FormField>
            <FormField initialValue={beverage.beverageType} name="beverageType">
              {(formFieldProps: FormFieldChildProps): React.Node => (
                <Picker label="Type" {...formFieldProps}>
                  <Picker.Item label="Beer" value="Beer" />
                  <Picker.Item label="Cider" value="Cider" />
                  <Picker.Item label="Coffee" value="Coffee" />
                  <Picker.Item label="Soda" value="Soda" />
                </Picker>
              )}
            </FormField>
            <FormField
              initialValue={beverage.servingTemperature}
              name="servingTemperature"
            >
              {(formFieldProps: FormFieldChildProps): React.Node => (
                <Picker label="Serving Temperature" {...formFieldProps}>
                  <Picker.Item label="Cellar" value="cellar" />
                  <Picker.Item label="Cold" value="cold" />
                  <Picker.Item label="Cool" value="cool" />
                  <Picker.Item label="Hot" value="hot" />
                  <Picker.Item label="Very Cold" value="very_cold" />
                  <Picker.Item label="Warm" value="warm" />
                </Picker>
              )}
            </FormField>
            <FormField initialValue={beverage.year} name="year">
              {(formFieldProps: FormFieldChildProps): React.Node => (
                <Picker label="Year" {...formFieldProps}>
                  {yearsRange.map((year: number): React.Node => (
                    <Picker.Item
                      key={year}
                      label={year.toString()}
                      value={year.toString()}
                    />
                  ))}
                </Picker>
              )}
            </FormField>
            <FormField initialValue={beverage.availability} name="availability">
              {(formFieldProps: FormFieldChildProps): React.Node => (
                <Picker label="Availability" {...formFieldProps}>
                  {this.props.availabilityStore.all.map(
                    ({ id, name }: Availability): React.Node => (
                      <Picker.Item key={id} label={name} value={id} />
                    ),
                  )}
                </Picker>
              )}
            </FormField>
            <FormField initialValue={beverage.glassware} name="glassware">
              {(formFieldProps: FormFieldChildProps): React.Node => (
                <Picker label="Glass" {...formFieldProps}>
                  {this.props.glassStore.all.map(
                    ({ id, name }: Glass): React.Node => (
                      <Picker.Item key={id} label={name} value={id} />
                    ),
                  )}
                </Picker>
              )}
            </FormField>
            {values.beverageType === 'Beer' && [
              <FormField initialValue={beverage.srm} key="srm" name="srm">
                {(formFieldProps: FormFieldChildProps): React.Node => (
                  <Picker label="Srm" {...formFieldProps}>
                    {this.props.srmStore.all.map(
                      ({ id, name }: Srm): React.Node => (
                        <Picker.Item key={id} label={name} value={id} />
                      ),
                    )}
                  </Picker>
                )}
              </FormField>,
              <FormField initialValue={beverage.style} key="style" name="style">
                {(formFieldProps: FormFieldChildProps): React.Node => (
                  <Picker label="Style" {...formFieldProps}>
                    {this.props.styleStore.all.map(
                      ({ id, name }: Style): React.Node => (
                        <Picker.Item key={id} label={name} value={id} />
                      ),
                    )}
                  </Picker>
                )}
              </FormField>,
              <FormField initialValue={beverage.abv} key="abv" name="abv">
                {(formFieldProps: FormFieldChildProps): React.Node => (
                  <TextField
                    disabled={submitting}
                    label="ABV"
                    keyboardType="numeric"
                    {...formFieldProps}
                  />
                )}
              </FormField>,
              <FormField
                initialValue={beverage.originalGravity}
                key="og"
                name="originalGravity"
              >
                {(formFieldProps: FormFieldChildProps): React.Node => (
                  <TextField
                    disabled={submitting}
                    label="Original Gravity"
                    keyboardType="numeric"
                    {...formFieldProps}
                  />
                )}
              </FormField>,
              <FormField initialValue={beverage.ibu} key="ibu" name="ibu">
                {(formFieldProps: FormFieldChildProps): React.Node => (
                  <TextField
                    disabled={submitting}
                    label="IBU"
                    keyboardType="numeric"
                    {...formFieldProps}
                  />
                )}
              </FormField>,
            ]}
            <FormField initialValue={beverage.id} name="id" />
            <FormValidationMessage>{formError}</FormValidationMessage>
            <Button
              disabled={submitting || invalid || pristine}
              onPress={(): void => handleSubmit(onSubmit)}
              title={submitButtonLabel}
            />
          </KeyboardAwareScrollView>
        )}
      </Form>
    );
  }
}

export default BeverageForm;
