import * as React from 'react';

import { createFilter } from '@brewskey/js-api/dist/filters';

import { DropdownInput } from '../../common/form/DropdownInput';
import { useGetAvailabilities } from '../../hooks/queries/AvailabilityQueries';

import type {
  Availability,
  QueryOptions,
  ShortenedEntity,
} from '@brewskey/js-api';

export type PickerValue<T> = T | null | undefined;

interface Props {
  error?: string | null | undefined;
  queryOptions?: QueryOptions;
  name: string;
  defaultValue?: PickerValue<Availability | ShortenedEntity>;
  required?: boolean | string;
}

export const AvailabilityPicker: React.FC<Props> = ({
  name = 'availability',
  defaultValue,
  required,
  ...props
}) => {
  const onSearchFilter = React.useCallback(
    (searchText: string, baseQueryOptions: QueryOptions) => ({
      ...baseQueryOptions,
      filters: [
        ...(baseQueryOptions.filters || []),
        createFilter('name').contains(searchText),
      ],
    }),
    [],
  );

  return (
    <DropdownInput<Availability | ShortenedEntity>
      search
      confirmSelectItem={false}
      defaultValue={defaultValue ?? undefined}
      labelField="name"
      name={name}
      onSearchFilter={onSearchFilter}
      placeholder="Select Availability"
      queryOptions={props.queryOptions ?? {}}
      required={required}
      searchPlaceholder="Search availability..."
      testID={`availability-picker-${name}`}
      useQueryHook={useGetAvailabilities}
      valueField="id"
    />
  );
};
