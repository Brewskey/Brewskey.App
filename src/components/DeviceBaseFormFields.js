// @flow

import type { Device, Location } from 'brewskey.js-api';

import * as React from 'react';
import DAOApi from 'brewskey.js-api';
import { observer } from 'mobx-react';
import DAOEntityStore from '../stores/DAOEntityStore';
import { FormField } from '../common/form';
import TextField from './TextField';
import PickerField from './PickerField';
import DeviceStatusPicker from './DeviceStatusPicker';

type Props = {
  device?: Device,
};

@observer
class DeviceFormFields extends React.Component<Props> {
  _locationStore: DAOEntityStore<Location> = new DAOEntityStore(
    DAOApi.LocationDAO,
  );

  componentWillMount() {
    this._locationStore.fetchMany();
  }

  // todo select only users locations
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
        {this._locationStore.allItems.map((location: Location): React.Node => (
          <PickerField.Item
            key={location.id}
            label={location.name}
            value={location}
          />
        ))}
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
