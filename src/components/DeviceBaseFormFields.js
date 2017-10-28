// @flow

import type { FormFieldChildProps } from '../common/form/types';

import * as React from 'react';
import styled from 'styled-components/native';
import { inject, observer } from 'mobx-react';
import { View } from 'react-native';
import FormField from '../common/form/FormField';
import TextField from './TextField';
import PickerField from './PickerField';

const DescriptionContainer = styled.Text`
  align-items: center;
  margin-left: 13;
  margin-right: 13;
  text-align: center;
`;

const DEVICE_STATUS_DESCRIPTION = {
  Active:
    'The Brewskey Box is currently in the standard mode.' +
    ' If you have a valve it will be closed and the sensors will' +
    ' track pours normally.',
  Cleaning:
    'Your Brewskey Box is in cleaning mode.' +
    ' After an hour the box will be put into "disabled" mode',
  Free:
    'Your Brewskey Box will open the valve' +
    ' and allow users to pour without authentication.',
  Inactive:
    'Your Brewskey Box is disabled.' +
    ' The valve will not open and pours will not be tracked.',
};

type Props = {|
  device?: Device,
  locationStore: DAOEntityStore<Location, Location>,
|};

@inject('locationStore')
@observer
class DeviceFormFields extends React.Component<Props> {
  static defaultProps = {
    device: {},
  };

  componentWillMount() {
    // todo temporary solution to full fill location field
    this.props.locationStore.fetchMany();
  }

  // todo select only users locations
  render(): React.Node {
    const { device, locationStore } = this.props;
    return [
      <FormField initialValue={device.name} key="name" name="name">
        {(formFieldProps: FormFieldChildProps): React.Node => (
          <TextField label="name" {...formFieldProps} />
        )}
      </FormField>,
      <FormField
        initialValue={device.deviceType}
        key="deviceType"
        name="deviceType"
      >
        {(formFieldProps: FormFieldChildProps): React.Node => (
          <View>
            <PickerField {...formFieldProps}>
              <PickerField.Item label="Brewskey box" value="BrewskeyBox" />
              <PickerField.Item label="Onsite" value="Onsite" />
            </PickerField>
            <DescriptionContainer>
              {DEVICE_STATUS_DESCRIPTION[formFieldProps.value]}
            </DescriptionContainer>
          </View>
        )}
      </FormField>,
      <FormField initialValue={device.location} key="location" name="location">
        {(formFieldProps: FormFieldChildProps): React.Node => (
          <PickerField {...formFieldProps}>
            {locationStore.all.map((location: Location): React.Node => (
              <PickerField.Item
                key={location.id}
                label={location.name}
                value={location}
              />
            ))}
          </PickerField>
        )}
      </FormField>,
      <FormField
        initialValue={device.deviceStatus}
        key="deviceStatus"
        name="deviceStatus"
      >
        {(formFieldProps: FormFieldChildProps): React.Node => (
          <View>
            <PickerField {...formFieldProps}>
              <PickerField.Item label="Active" value="Active" />
              <PickerField.Item label="Cleaning" value="Cleaning" />
              <PickerField.Item label="Free" value="Free" />
              <PickerField.Item label="Inactive" value="Inactive" />
            </PickerField>
            <DescriptionContainer>
              {DEVICE_STATUS_DESCRIPTION[formFieldProps.value]}
            </DescriptionContainer>
          </View>
        )}
      </FormField>,
      <FormField initialValue={device.id} key="id" name="id" />,
    ];
  }
}

export default DeviceFormFields;
