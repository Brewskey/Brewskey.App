import * as React from 'react';

import { createFilter } from '@brewskey/js-api/dist/filters';
import { FieldValues } from 'react-hook-form';

import { DropdownInput } from 'common/form/DropdownInput';
import { useGetGlasses } from 'hooks/queries/GlassQueries';

import type { Glass, QueryOptions, ShortenedEntity } from '@brewskey/js-api';

export type PickerValue<T> = T | null | undefined;

interface Props {
  error?: string | null | undefined;
  queryOptions?: QueryOptions;
  name: string;
  testID?: string;
  defaultValue?: PickerValue<Glass | ShortenedEntity>;
  required?: boolean | string;
}

export const GlassPicker: React.FC<Props> = ({
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
    <DropdownInput<FieldValues, Glass | ShortenedEntity>
      search
      confirmSelectItem={false}
      defaultValue={defaultValue ?? undefined}
      labelField="name"
      name={name}
      onSearchFilter={onSearchFilter}
      placeholder="Select Glass"
      queryOptions={props.queryOptions ?? {}}
      required={required}
      searchPlaceholder="Search glasses..."
      testID={testID}
      useQueryHook={useGetGlasses}
      valueField="id"
    />
  );
};
