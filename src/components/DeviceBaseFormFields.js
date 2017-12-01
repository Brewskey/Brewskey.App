// @flow

import type { Device, Location } from 'brewskey.js-api';

import * as React from 'react';
import DAOApi from 'brewskey.js-api';
import InjectedComponent from '../common/InjectedComponent';
import { observer } from 'mobx-react';
import DAOEntityStore from '../stores/DAOEntityStore';
import withComponentStores from '../common/withComponentStores';
import { FormField } from '../common/form';
import TextField from './TextField';
import PickerField from './PickerField';
import DeviceStatusPicker from './DeviceStatusPicker';

type Props = {
  device?: Device,
};

type InjectedProps = {
  locationStore: DAOEntityStore<Location>,
};

@withComponentStores({ locationStore: new DAOEntityStore(DAOApi.LocationDAO) })
@observer
class DeviceFormFields extends InjectedComponent<InjectedProps, Props> {
  render() {
    const { device = {} } = this.props;
    return [
      <FormField
        component={TextField}
        initialValue={device.name}
        key="name"
        label="name"
        name="name"
      />,
      <FormField
        component={PickerField}
        initialValue={device.deviceType}
        key="deviceType"
        label="Type"
        name="deviceType"
      >
        <PickerField.Item label="Brewskey box" value="BrewskeyBox" />
        <PickerField.Item label="Onsite" value="Onsite" />
      </FormField>,
      <FormField
        component={PickerField}
        initialValue={device.location}
        key="location"
        label="Location"
        name="location"
      >
        {this.injectedProps.locationStore.allItems.map(
          (location: Location): React.Node => (
            <PickerField.Item
              key={location.id}
              label={location.name}
              value={location}
            />
          ),
        )}
      </FormField>,
      <FormField
        initialValue={device.deviceStatus}
        component={DeviceStatusPicker}
        key="deviceStatus"
        name="deviceStatus"
      />,
      <FormField initialValue={device.id} key="id" name="id" />,
    ];
  }
}

export default DeviceFormFields;
