import * as React from 'react';

import { createFilter } from '@brewskey/js-api/dist/filters';
import { FieldValues } from 'react-hook-form';

import { DropdownInput } from 'common/form/DropdownInput';
import { useGetStyles } from 'hooks/queries/StyleQueries';

import type { QueryOptions, ShortenedEntity, Style } from '@brewskey/js-api';

export type PickerValue<T> = T | null | undefined;

interface Props {
  error?: string | null | undefined;
  queryOptions?: QueryOptions;
  name: string;
  testID?: string;
  defaultValue?: PickerValue<Style | ShortenedEntity>;
  required?: boolean | string;
}

export const StylePicker: React.FC<Props> = ({
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

  return (
    <DropdownInput<FieldValues, Style | ShortenedEntity>
      search
      confirmSelectItem={false}
      defaultValue={defaultValue ?? undefined}
      labelField="name"
      name={name}
      onSearchFilter={onSearchFilter}
      placeholder="Select Style"
      queryOptions={props.queryOptions ?? {}}
      required={required}
      searchPlaceholder="Search styles..."
      testID={testID}
      useQueryHook={useGetStyles}
      valueField="id"
    />
  );
};
