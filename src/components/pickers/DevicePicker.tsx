import type { Device, QueryOptions } from '@brewskey/js-api';
import type { PickerValue, RenderRowProps } from './DAOPicker';

import * as React from 'react';
import DAOPicker from './DAOPicker';
import SelectableListItem from '../../common/SelectableListItem';
import { useGetDevices } from '../../hooks/queries/DeviceQueries';

type Props<TMultiple extends boolean> = {
  error?: string | null | undefined;
  multiple: TMultiple;
  onChange: (value: PickerValue<Device, TMultiple>) => void;
  queryOptions?: QueryOptions;
  value: PickerValue<Device, TMultiple>;
};

function DevicePicker<TMultiple extends boolean>({
  multiple = false as TMultiple,
  ...props
}: Props<TMultiple>): React.ReactElement {
  const renderRow = ({
    item: device,
    isSelected,
    toggleItem,
  }: RenderRowProps<Device>): React.ReactElement => (
    <SelectableListItem
      chevron={false}
      isSelected={isSelected}
      item={device}
      title={device.name}
      onPress={() => toggleItem(device)}
    />
  );

  return (
    <DAOPicker
      {...props}
      useQueryHook={useGetDevices}
      headerTitle={`Select Brewskey Box${multiple ? 'es' : ''}`}
      label={`Brewskey box${multiple ? 'es' : ''}`}
      multiple={multiple}
      queryOptions={props.queryOptions ?? {}}
      renderRow={renderRow}
      searchBy="name"
      shouldUseSearchQuery={false}
      stringValueExtractor={(device: Device): string => device.name}
    />
  );
}

export default DevicePicker;
