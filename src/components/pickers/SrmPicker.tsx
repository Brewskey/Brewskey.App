import type { Srm, QueryOptions } from '@brewskey/js-api';
import * as React from 'react';
import { DropdownInput } from '../../common/form/DropdownInput';
import { useGetSrms } from '../../hooks/queries/SrmQueries';
import { createFilter } from '@brewskey/js-api/dist/filters';
import ColorIcon from '../../common/ColorIcon';

export type PickerValue<TEntity, TMultiple extends boolean> = TMultiple extends true
  ? TEntity[]
  : TEntity | null | undefined;

type Props = {
  error?: string | null | undefined;
  label?: string;
  onChange: (value: PickerValue<Srm, false>) => void;
  queryOptions?: QueryOptions;
  value: PickerValue<Srm, false>;
  // Form integration props
  name: string;
  defaultValue?: PickerValue<Srm, false>;
  required?: boolean | string;
};

const SrmPicker: React.FC<Props> = ({
  label = 'SRM',
  name = 'srm',
  defaultValue,
  required,
  ...props
}) => {

  const onSearchFilter = React.useCallback((searchText: string, baseQueryOptions: QueryOptions) => {
    return {
      ...baseQueryOptions,
      filters: [
        ...(baseQueryOptions.filters || []),
        createFilter('name').contains(searchText),
      ],
    };
  }, []);

  const renderRow = (item: Srm) => {
    return (
      <ColorIcon color={`#${item.hex}`} />
    );
  };

  return (
    <DropdownInput<Srm>
      name={name}
      defaultValue={defaultValue ?? undefined}
      required={required}
      useQueryHook={useGetSrms}
      queryOptions={props.queryOptions ?? {}}
      onSearchFilter={onSearchFilter}
      labelField="name"
      valueField="id"
      multiple={false}
      headerTitle="Select SRM"
      confirmSelectItem={true}
      inputVariant="picker"
      search={true}
      searchPlaceholder="Search SRM..."
      placeholder="Select SRM"
      renderItem={renderRow}
      onChange={(item) => {
        if (!Array.isArray(item)) {
          props.onChange(item as Srm);
        }
      }}
      onConfirmSelectItem={(item) => {
        if (!Array.isArray(item)) {
          props.onChange(item as Srm);
        }
      }}
      keyExtractor={(item) => String(item.id)}
      testID={label ? `picker-${label.toLowerCase().replace(/\s+/g, '-')}` : `srm-picker-${name}`}
    />
  );
};

export default SrmPicker;
