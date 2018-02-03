// @flow

import type { Device, Location } from 'brewskey.js-api';

import * as React from 'react';
import { observer } from 'mobx-react';
import { LocationStore } from '../stores/DAOStores';
import { FormField } from '../common/form';
import TextField from './TextField';
import PickerField from '../common/PickerField';
import LoaderPickerField from '../common/PickerField/LoaderPickerField';
import DeviceStatePicker from './DeviceStatePicker';

type Props = {
  device?: Device,
};

@observer
class DeviceFormFields extends React.Component<Props> {
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
        component={LoaderPickerField}
        initialValue={device.location && device.location.id}
        itemsLoader={LocationStore.getMany()}
        key="location"
        label="Location"
        name="locationId"
      >
        {(items: Array<Location>): Array<React.Node> =>
          items.map(({ id, name }: Location): React.Node => (
            <PickerField.Item key={id} label={name} value={id} />
          ))
        }
      </FormField>,
      <FormField
        initialValue={device.deviceStatus}
        component={DeviceStatePicker}
        key="deviceStatus"
        name="deviceStatus"
      />,
      <FormField initialValue={device.id} key="id" name="id" />,
    ];
  }
}

export default DeviceFormFields;
