import * as React from 'react';

import { useInfiniteQuery } from '@tanstack/react-query';
import nullthrows from 'nullthrows';
import { Controller, useFormContext } from 'react-hook-form';
import { Platform, Text, TouchableOpacity, View } from 'react-native';
import { Dropdown as RNEDropdown } from 'react-native-element-dropdown';

import { WebDropdown } from './WebDropdown';
import { useDebounce } from '../../hooks/useDebounce';
import { COLORS } from '../../theme';

import type { QueryOptions } from '@brewskey/js-api';
import type {
  InfiniteData,
  UseInfiniteQueryResult,
} from '@tanstack/react-query';

type DropdownProps = React.ComponentProps<typeof RNEDropdown>;

const usePlaceholderQuery = (_options?: unknown) =>
  useInfiniteQuery({
    queryKey: ['dropdown-placeholder'],
    queryFn: async () => [],
    initialPageParam: undefined,
    getNextPageParam: () => undefined,
    enabled: false,
  });

export type DropdownInputProps<TValueType> = Omit<
  DropdownProps,
  'onChange' | 'data'
> & {
  // Form integration
  defaultValue?: TValueType;
  name: string;
  required?: boolean | string;
  onChange?: DropdownProps['onChange'];
  testID?: string;

  // Data source - either static array or async query
  data?: TValueType[];
  useQueryHook?: (
    options?: any,
  ) => UseInfiniteQueryResult<InfiniteData<TValueType[]>>;
  queryOptions?: any;
  onSearchFilter?: (
    searchText: string,
    baseQueryOptions: QueryOptions,
  ) => QueryOptions;
  searchBy?: string;
  shouldUseSearchQuery?: boolean;

  // Modal mode
  mode?: 'default' | 'modal' | 'auto';
  headerTitle?: string;

  // Confirmation flow (react-native-element-dropdown API)
  confirmSelectItem?: boolean;
  onConfirmSelectItem?: (item: TValueType) => void;
};

// Wrapper: WebDropdown on web, react-native-element-dropdown on native. Props match DropdownProps.
// eslint-disable-next-line @typescript-eslint/no-unused-vars -- generic used by DropdownInput when rendering <Dropdown<TValueType>>
const Dropdown = <TValueType,>(props: DropdownProps) => {
  if (Platform.OS === 'web') {
    return <WebDropdown {...props} />;
  }

  const nativeProps: any = { ...props };
  if (props.value != null && !props.renderRightIcon) {
    nativeProps.renderRightIcon = () => {
      if (props.value == null) return null;
      return (
        <TouchableOpacity
          style={{ padding: 8 }}
          onPress={(e: any) => {
            e.stopPropagation();
            props.onChange?.(null as any);
          }}
        >
          <Text style={{ fontSize: 16, color: COLORS.textFaded }}>×</Text>
        </TouchableOpacity>
      );
    };
  }
  return <RNEDropdown {...nativeProps} />;
};

export const DropdownInput = <TValueType,>({
  defaultValue,
  name,
  required = false,
  onChange: onChangeOuter,
  valueField,
  labelField,
  testID,
  mode = 'default',
  headerTitle,
  confirmSelectItem = false,
  onConfirmSelectItem,
  useQueryHook,
  queryOptions,
  onSearchFilter,
  searchBy,
  data: staticData,
  search,
  ...props
}: DropdownInputProps<TValueType>) => {
  const { control, setValue } = useFormContext();
  const [searchText, setSearchText] = React.useState('');
  const debouncedSearchText = useDebounce(searchText, 300);

  // Query options with search (for useQueryHook)
  const finalQueryOptions = React.useMemo(() => {
    if (!useQueryHook) {
      return null;
    }
    const baseOptions = { ...(queryOptions || {}) };
    if (!debouncedSearchText) {
      return baseOptions;
    }
    if (search && onSearchFilter) {
      return onSearchFilter(debouncedSearchText, baseOptions);
    }
    if (search) {
      return { ...baseOptions, search: debouncedSearchText };
    }
    return baseOptions;
  }, [queryOptions, debouncedSearchText, onSearchFilter, search, useQueryHook]);

  const queryHook = useQueryHook ?? usePlaceholderQuery;
  const queryResult = queryHook(finalQueryOptions ?? {});

  // Flatten data from query or use static data
  const flatData = React.useMemo(() => {
    if (queryResult?.data) {
      return (
        (queryResult.data as { pages?: TValueType[][] }).pages?.flatMap(
          (page) => page,
        ) ?? []
      );
    }
    return staticData ?? [];
  }, [queryResult?.data, staticData]);

  // Client-side filter when using static data with search (no useQueryHook / onSearchFilter)
  const filteredData = React.useMemo(() => {
    if (!search || !searchText.trim() || useQueryHook || onSearchFilter) {
      return flatData;
    }
    const searchLower = searchText.toLowerCase();
    const field = String((searchBy || labelField) ?? '');
    return flatData.filter((item) => {
      const labelValue =
        (item as Record<string, unknown>)[field]?.toString().toLowerCase() ??
        '';
      return labelValue.includes(searchLower);
    });
  }, [
    flatData,
    search,
    searchText,
    searchBy,
    labelField,
    useQueryHook,
    onSearchFilter,
  ]);

  nullthrows(
    name,
    'DropdownInput: name prop is required and must be a non-empty string',
  );
  const dropdownName = `${name}-hidden`;

  return (
    <Controller
      control={control}
      defaultValue={defaultValue}
      name={dropdownName}
      rules={{ required }}
      render={({
        field: { onChange, onBlur, value },
        formState: _formState,
      }) => {
        const handleBlur = () => {
          setSearchText('');
          onBlur();
        };

        return (
          <View
            style={Platform.select({
              web: { overflow: 'visible', zIndex: 1 },
            })}
          >
            <Dropdown<TValueType>
              {...props}
              confirmSelectItem={confirmSelectItem}
              data={filteredData}
              labelField={labelField}
              mode={mode}
              onBlur={handleBlur}
              onChangeText={setSearchText}
              search={search}
              testID={testID}
              value={value}
              valueField={valueField}
              onChange={(item) => {
                if (!confirmSelectItem) {
                  onChange(item);
                  onChangeOuter?.(item);
                  setValue(name, item[valueField as string]);
                }
              }}
              onConfirmSelectItem={(item) => {
                onConfirmSelectItem?.(item);
                onChange(item);
                setValue(name, item[valueField as string]);
              }}
            />
          </View>
        );
      }}
    />
  );
};
