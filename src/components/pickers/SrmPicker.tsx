import * as React from 'react';

import { createFilter } from '@brewskey/js-api/dist/filters';
import { FieldValues } from 'react-hook-form';

import { ColorIcon } from 'common/ColorIcon';
import { DropdownInput } from 'common/form/DropdownInput';
import { useGetSrms } from 'hooks/queries/SrmQueries';

import type { QueryOptions, ShortenedEntity, Srm } from '@brewskey/js-api';

export type PickerValue<T> = T | null | undefined;

interface Props {
  error?: string | null | undefined;
  queryOptions?: QueryOptions;
  name: string;
  testID?: string;
  defaultValue?: PickerValue<Srm | ShortenedEntity>;
  required?: boolean | string;
}

export const SrmPicker: React.FC<Props> = ({
  name,
  testID,
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

  const renderRow = (item: Srm) => <ColorIcon color={`#${item.hex}`} />;

  return (
    <DropdownInput<FieldValues, Srm | ShortenedEntity>
      search
      confirmSelectItem={false}
      defaultValue={defaultValue ?? undefined}
      labelField="name"
      name={name}
      onSearchFilter={onSearchFilter}
      placeholder="Select SRM"
      queryOptions={props.queryOptions ?? {}}
      renderItem={renderRow}
      required={required}
      searchPlaceholder="Search SRM..."
      testID={testID}
      useQueryHook={useGetSrms}
      valueField="id"
    />
  );
};
