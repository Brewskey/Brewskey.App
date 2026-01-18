import type { Availability, QueryOptions } from '@brewskey/js-api';
import type { PickerValue, RenderRowProps } from './DAOPicker';

import * as React from 'react';
import DAOPicker from './DAOPicker';
import SelectableListItem from '../../common/SelectableListItem';
import { useGetAvailabilities } from '../../hooks/queries/AvailabilityQueries';

type Props = {
  error?: string | null | undefined;
  onChange: (value: PickerValue<Availability, false>) => void;
  queryOptions?: QueryOptions;
  value: PickerValue<Availability, false>;
};

const AvailabilityPicker: React.FC<Props> = (props) => {
  const renderRow = ({
    item: availability,
    isSelected,
    toggleItem,
  }: RenderRowProps<Availability>): React.ReactElement => (
    <SelectableListItem
      chevron={false}
      isSelected={isSelected}
      item={availability}
      title={availability.name}
      onPress={() => toggleItem(availability)}
    />
  );

  return (
    <DAOPicker
      {...props}
      useQueryHook={useGetAvailabilities}
      headerTitle="Select Availability"
      label="Availability"
      multiple={false}
      queryOptions={props.queryOptions ?? {}}
      renderRow={renderRow}
      searchBy="name"
      shouldUseSearchQuery={false}
      stringValueExtractor={(availability: Availability): string => availability.name}
    />
  );
};

export default AvailabilityPicker;
