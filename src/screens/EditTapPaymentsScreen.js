// @flow

import type {
  EntityID,
  Location,
  Organization,
  PriceVariant,
  PriceVariantMutator,
  Tap,
} from 'brewskey.js-api';
import type { Navigation } from '../types';
import type { FormProps } from '../common/form/types';

import * as React from 'react';
import { withNavigationFocus } from 'react-navigation';
import FormValidationMessage from '../common/form/FormValidationMessage';
import nullthrows from 'nullthrows';
import InjectedComponent from '../common/InjectedComponent';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { computed } from 'mobx';
import { observer } from 'mobx-react';
import DAOApi, { LoadObject } from 'brewskey.js-api';
import {
  LocationStore,
  OrganizationStore,
  PriceVariantStore,
  TapStore,
} from '../stores/DAOStores';
import ErrorScreen from '../common/ErrorScreen';
import { errorBoundary } from '../common/ErrorBoundary';
import Container from '../common/Container';
import Section from '../common/Section';
import SectionHeader from '../common/SectionHeader';
import LoaderComponent from '../common/LoaderComponent';
import Button from '../common/buttons/Button';
import flatNavigationParamsAndScreenProps from '../common/flatNavigationParamsAndScreenProps';
import TextField from '../components/TextField';
import { form, FormField } from '../common/form';
import SnackBarStore from '../stores/SnackBarStore';
import { Fill } from 'react-slot-fill';
import SimplePicker from '../components/pickers/SimplePicker';

type InjectedProps = {|
  isFocused: Boolean,
  tapId: EntityID,
  navigation: Navigation,
|};

@errorBoundary(<ErrorScreen />)
@flatNavigationParamsAndScreenProps
@observer
class EditTapPaymentsScreen extends InjectedComponent<InjectedProps> {
  static navigationOptions = {
    tabBarLabel: 'Prices',
  };

  @computed
  get _priceVariants(): LoadObject<PriceVariant> {
    return PriceVariantStore.getSingle({
      filters: [DAOApi.createFilter('tap/id').equals(this.injectedProps.tapId)],
    });
  }

  @computed
  get _location(): LoadObject<Location> {
    return TapStore.getByID(this.injectedProps.tapId).map<Location>((tap) =>
      LocationStore.getByID(nullthrows(tap.location).id),
    );
  }

  @computed
  get _organization(): LoadObject<Organization> {
    return TapStore.getByID(this.injectedProps.tapId).map<Organization>((tap) =>
      OrganizationStore.getByID(nullthrows(tap.organization).id),
    );
  }

  @computed
  get _squareLocationLoader(): LoadObject<
    Array<{|
      locationID: string,
      name: string,
    |}>,
  > {
    return LoadObject.merge([this._organization, this._location]).map(
      ([organization, location]) => {
        if (
          !organization.canEnablePayments ||
          location.squareLocationID != null
        ) {
          return [];
        }

        return OrganizationStore.fetchSquareLocations(organization.id);
      },
    );
  }

  _onFormSubmit = async (values: PriceVariantMutator): Promise<void> => {
    const squareLocationID = null;

    if (squareLocationID != null) {
      const organization = this._organization.getValueEnforcing();
      const {
        createdDate: _,
        geolocation: _1,
        isDeleted: _2,
        organization: _3,
        timeZone: _4,
        ...otherProps
      } = this._location.getValueEnforcing();

      const clientID = DAOApi.LocationDAO.put(otherProps.id, {
        ...otherProps,
        organizationId: nullthrows(organization).id,
        squareLocationID,
      });
      await DAOApi.LocationDAO.waitForLoaded((dao) => dao.fetchByID(clientID));
    }

    if (values.id != null) {
      const clientID = DAOApi.PriceVariantDAO.put(values.id, values);
      await DAOApi.PriceVariantDAO.waitForLoaded((dao) =>
        dao.fetchByID(clientID),
      );
      SnackBarStore.showMessage({ text: 'The price was edited' });
    } else {
      DAOApi.PriceVariantDAO.post(values);
      SnackBarStore.showMessage({ text: 'The price was created' });
    }
  };

  render(): React.Node {
    return (
      <LoaderComponent
        emptyComponent={LoadedComponent}
        loadedComponent={LoadedComponent}
        loader={LoadObject.merge([
          this._priceVariants,
          this._organization,
          this._location,
          this._squareLocationLoader,
        ])}
        onSubmit={this._onFormSubmit}
        tapId={this.injectedProps.tapId}
        updatingComponent={LoadedComponent}
      />
    );
  }
}

// type LoadedComponentProps = {
//   onTapFormSubmit: (values: TapMutator) => Promise<void>,
//   onToggleNotifications: () => void,
//   value: Tap,
// };

const validate = (values: PriceVariantMutator): { [key: string]: string } => {
  const errors = {};

  if (!values.ounces || !parseFloat(values.ounces)) {
    errors.ounces = 'Ounces is required';
  }

  if (!values.price || !parseFloat(values.price)) {
    errors.price = 'Price is required';
  }

  return errors;
};

type Props = {|
  isFocused: boolean,
  tapId: EntityID,
  value: PriceVariant,
|};

@form({ validate })
@withNavigationFocus
class LoadedComponent extends InjectedComponent<FormProps, Props> {
  render(): React.Node {
    const { isFocused, tapId, value } = this.props;

    const {
      formError,
      handleSubmit,
      invalid,
      pristine,
      submitting,
    } = this.injectedProps;

    if (value == null) {
      return null;
    }

    const [formValue, organization, location, squareLocations] = value;

    if (!organization.canEnablePayments) {
      return (
        <Container>
          <Section bottomPadded>
            <SectionHeader title="Payments are disabled for this organization" />
          </Section>
        </Container>
      );
    }

    return (
      <Container>
        <KeyboardAwareScrollView>
          {location == null || location.squareLocationID != null ? null : (
            <Section bottomPadded>
              <SectionHeader title="Set Square Location" />
              {squareLocations.length === 0 ? null : (
                <FormField
                  component={SimplePicker}
                  disabled={submitting}
                  doesRequireConfirmation={false}
                  headerTitle="Select Square Location"
                  initialValue={location.squareLocationID}
                  label="Square Location"
                  name="squareLocationID"
                  pickerValues={squareLocations.map((item) => ({
                    label: item.name,
                    value: item.locationID,
                  }))}
                />
              )}
            </Section>
          )}
          <Section bottomPadded>
            <SectionHeader title="Set Price and Ounces" />
            {formValue == null ? null : (
              <FormField initialValue={formValue.id} name="id" />
            )}
            <FormField initialValue={tapId} name="tapID" />

            <FormField
              component={TextField}
              initialValue={(formValue != null ? formValue.ounces : 0).toFixed(
                1,
              )}
              name="ounces"
              keyboardType="numeric"
              label="Ounces"
            />
            <FormField
              component={TextField}
              initialValue={(formValue != null
                ? formValue.price / 100
                : 0
              ).toFixed(2)}
              name="price"
              keyboardType="numeric"
              label="Price"
              parseOnSubmit={(price) => (price * 100).toFixed(0)}
            />
          </Section>
        </KeyboardAwareScrollView>
        {!isFocused ? null : (
          <Fill name="MainTabBar">
            <FormValidationMessage>{formError}</FormValidationMessage>
            <Button
              disabled={submitting || invalid || pristine}
              loading={submitting}
              onPress={handleSubmit}
              style={{ marginVertical: 12 }}
              title={formValue == null ? 'Create Price' : 'Update Price'}
            />
          </Fill>
        )}
      </Container>
    );
  }
}

export default EditTapPaymentsScreen;
