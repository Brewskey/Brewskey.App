import * as React from 'react';

import { useInfiniteQuery } from '@tanstack/react-query';
import nullthrows from 'nullthrows';
import { Controller, FieldValues, useFormContext } from 'react-hook-form';
import { GestureResponderEvent, Platform, View } from 'react-native';
import { Dropdown as RNEDropdown } from 'react-native-element-dropdown';

import { ClearButton } from './ClearButton';
import { WebDropdown } from './WebDropdown';
import { useDebounce } from '../../hooks/useDebounce';
import { flattenInfinitePages } from '../../utils/infiniteQuery';

import type { QueryOptions } from '@brewskey/js-api';
import type {
  InfiniteData,
  UseInfiniteQueryResult,
} from '@tanstack/react-query';
import type { ControllerRenderProps } from 'react-hook-form';

type DropdownProps = React.ComponentProps<typeof RNEDropdown>;

/** The primitive id stored on the form (the value of `valueField` on a row). */
type FormFieldValue = string | number | null;

/**
 * Read the `valueField` value off an item, accepting either a row object or an
 * already-primitive value. Returns `null` if no usable id can be extracted.
 */
const readValueFieldId = (
  item: unknown,
  valueField: string,
): FormFieldValue => {
  if (item == null) {
    return null;
  }
  if (typeof item === 'object') {
    const id = (item as Record<string, unknown>)[valueField];
    return id == null ? null : (id as FormFieldValue);
  }
  return item as FormFieldValue;
};

/** Returns true when two values represent the same row id (handles string/number coercion). */
const idsMatch = (a: FormFieldValue, b: FormFieldValue): boolean => {
  if (a == null || b == null) {
    return a == null && b == null;
  }
  return a === b || String(a) === String(b);
};

/**
 * Static fallback so the component can call a hook unconditionally even when the
 * caller didn't provide a `useQueryHook`.
 */
const usePlaceholderQuery = (_options?: unknown) =>
  useInfiniteQuery({
    queryKey: ['dropdown-placeholder'],
    queryFn: async () => [],
    initialPageParam: undefined,
    getNextPageParam: () => undefined,
    enabled: false,
  });

export type DropdownInputProps<TFormFields extends FieldValues, TItem> = Omit<
  DropdownProps,
  'onChange' | 'data' | 'name' | 'value'
> & {
  // Form integration. The form field stores the primitive `valueField` id.
  // `defaultValue` may be either that primitive or a full row (whose id will be
  // extracted, and which will also be used to display the initial label before
  // the data list resolves).
  defaultValue?: TItem | FormFieldValue;
  name: Extract<keyof TFormFields, string>;
  required?: boolean | string;
  onChange?: (item: TItem | null) => void;
  testID?: string;

  // Data source — either a static array or an infinite query hook.
  data?: TItem[];
  useQueryHook?: (
    options?: QueryOptions,
  ) => UseInfiniteQueryResult<InfiniteData<TItem[]>>;
  queryOptions?: QueryOptions;
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
  onConfirmSelectItem?: (item: TItem) => void;
};

const DropdownPlatform = (props: DropdownProps) => {
  if (Platform.OS === 'web') {
    return <WebDropdown {...props} />;
  }

  // On native, add a default clear affordance when a value is selected and the
  // caller hasn't customized `renderRightIcon`.
  if (props.value == null || props.renderRightIcon != null) {
    return <RNEDropdown {...props} />;
  }

  const handleClear = (event: GestureResponderEvent) => {
    event.stopPropagation();
    props.onChange?.(null as never);
  };

  return (
    <RNEDropdown
      {...props}
      renderRightIcon={() => <ClearButton onPress={handleClear} />}
    />
  );
};

interface ControlledDropdownProps<TItem> extends Omit<
  DropdownProps,
  'data' | 'value' | 'onChange'
> {
  baseData: TItem[];
  getSeedItem: () => TItem | null;
  setSeedItem: (item: TItem) => void;
  valueFieldKey: string;
  field: ControllerRenderProps<FieldValues, string>;
  confirmSelectItem: boolean;
  onConfirmSelectItem?: (item: TItem) => void;
  onChangeOuter?: (item: TItem | null) => void;
  setSearchText: (text: string) => void;
}

/**
 * Renders the platform dropdown for a single Controller `field`. Extracted so
 * we can use hooks (e.g. `useMemo`) here rather than inside Controller's render
 * callback.
 */
const ControlledDropdown = <TItem,>({
  baseData,
  getSeedItem,
  setSeedItem,
  valueFieldKey,
  field: { onChange, onBlur, value },
  confirmSelectItem,
  onConfirmSelectItem,
  onChangeOuter,
  setSearchText,
  ...dropdownProps
}: ControlledDropdownProps<TItem>) => {
  const fieldId = (value ?? null) as FormFieldValue;

  // Make sure the currently-selected row is present in the dropdown's `data`
  // so the underlying picker can render its label. Falls back to the seed
  // object when the data list hasn't returned the row yet.
  const dataWithSelection = React.useMemo<TItem[]>(() => {
    if (fieldId == null) {
      return baseData;
    }
    const exists = baseData.some((item) =>
      idsMatch(readValueFieldId(item, valueFieldKey), fieldId),
    );
    if (exists) {
      return baseData;
    }
    const seed = getSeedItem();
    if (
      seed != null &&
      idsMatch(readValueFieldId(seed, valueFieldKey), fieldId)
    ) {
      return [seed, ...baseData];
    }
    return baseData;
  }, [baseData, fieldId, getSeedItem, valueFieldKey]);

  const handleBlur = () => {
    setSearchText('');
    onBlur();
  };

  const commitSelection = (item: TItem | null) => {
    const nextId = readValueFieldId(item, valueFieldKey);
    onChange(nextId);
    onChangeOuter?.(item);
    if (item != null && typeof item === 'object') {
      setSeedItem({ ...(item as object) } as TItem);
    }
  };

  return (
    <View style={Platform.select({ web: { overflow: 'visible', zIndex: 1 } })}>
      <DropdownPlatform
        {...dropdownProps}
        confirmSelectItem={confirmSelectItem}
        data={dataWithSelection as DropdownProps['data']}
        onBlur={handleBlur}
        onChangeText={setSearchText}
        value={fieldId}
        onChange={(item) => {
          if (confirmSelectItem) {
            return;
          }
          commitSelection(item as TItem | null);
        }}
        onConfirmSelectItem={(item) => {
          onConfirmSelectItem?.(item as TItem);
          commitSelection(item as TItem | null);
        }}
      />
    </View>
  );
};

export const DropdownInput = <TFormFields extends FieldValues, TItem>({
  defaultValue,
  name,
  required = false,
  onChange: onChangeOuter,
  valueField,
  labelField,
  testID,
  mode = 'default',
  headerTitle: _headerTitle,
  confirmSelectItem = false,
  onConfirmSelectItem,
  useQueryHook,
  queryOptions,
  onSearchFilter,
  searchBy,
  data: staticData,
  search,
  ...props
}: DropdownInputProps<TFormFields, TItem>) => {
  nullthrows(name, 'DropdownInput: `name` prop is required');
  nullthrows(valueField, 'DropdownInput: `valueField` prop is required');

  const valueFieldKey = String(valueField);
  const form = nullthrows(
    useFormContext<TFormFields>(),
    'DropdownInput must be rendered inside a FormProvider',
  );
  const { control } = form;

  const [searchText, setSearchText] = React.useState('');
  const debouncedSearchText = useDebounce(searchText, 300);

  const finalQueryOptions = React.useMemo<QueryOptions | undefined>(() => {
    if (!useQueryHook) {
      return undefined;
    }
    const baseOptions = { ...(queryOptions ?? {}) };
    if (!debouncedSearchText) {
      return baseOptions;
    }
    if (search && onSearchFilter) {
      return onSearchFilter(debouncedSearchText, baseOptions);
    }
    if (search) {
      return { ...baseOptions, search: debouncedSearchText } as QueryOptions;
    }
    return baseOptions;
  }, [queryOptions, debouncedSearchText, onSearchFilter, search, useQueryHook]);

  const queryHook = useQueryHook ?? usePlaceholderQuery;
  const queryResult = queryHook(finalQueryOptions);

  const sourceData = React.useMemo<TItem[]>(() => {
    if (useQueryHook) {
      return flattenInfinitePages<TItem>(queryResult?.data);
    }
    return staticData ?? [];
  }, [useQueryHook, queryResult?.data, staticData]);

  // Client-side filter: only when the caller asked for `search` but didn't wire
  // it up to the server (no query hook, no `onSearchFilter`).
  const filteredData = React.useMemo<TItem[]>(() => {
    if (!search || !searchText.trim() || useQueryHook || onSearchFilter) {
      return sourceData;
    }
    const needle = searchText.toLowerCase();
    const field = String(searchBy ?? labelField ?? '');
    return sourceData.filter((item) => {
      if (item == null || typeof item !== 'object') {
        return false;
      }
      const value = (item as Record<string, unknown>)[field];
      return value != null && String(value).toLowerCase().includes(needle);
    });
  }, [
    sourceData,
    search,
    searchText,
    searchBy,
    labelField,
    useQueryHook,
    onSearchFilter,
  ]);

  // `react-native-element-dropdown` mutates each row (it assigns `_index`).
  // Shallow-clone rows so we never mutate React Query cache objects.
  const dropdownData = React.useMemo<TItem[]>(
    () =>
      filteredData.map((item) =>
        item != null && typeof item === 'object'
          ? ({ ...(item as object) } as TItem)
          : item,
      ),
    [filteredData],
  );

  // Seed object (full row) used to render the label for the initial selection
  // before the data list resolves. Only meaningful when `defaultValue` is an
  // object; primitives carry no label info on their own.
  const initialSeed = React.useMemo<TItem | null>(() => {
    if (defaultValue == null || typeof defaultValue !== 'object') {
      return null;
    }
    return { ...(defaultValue as object) } as TItem;
  }, [defaultValue]);
  const seedItemRef = React.useRef<TItem | null>(initialSeed);
  React.useEffect(() => {
    if (initialSeed != null) {
      seedItemRef.current = initialSeed;
    }
  }, [initialSeed]);
  const getSeedItem = React.useCallback(() => seedItemRef.current, []);
  const setSeedItem = React.useCallback((item: TItem) => {
    seedItemRef.current = item;
  }, []);

  // `defaultValue` is only consumed at mount by react-hook-form; subsequent
  // updates flow through `setValue` from the consumer.
  const initialFieldValue = React.useMemo(
    () => readValueFieldId(defaultValue, valueFieldKey),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [],
  );

  return (
    <Controller
      control={control}
      defaultValue={initialFieldValue as never}
      name={name as never}
      rules={{ required }}
      render={({ field }) => (
        <ControlledDropdown<TItem>
          {...props}
          baseData={dropdownData}
          confirmSelectItem={confirmSelectItem}
          field={field as ControllerRenderProps<FieldValues, string>}
          getSeedItem={getSeedItem}
          labelField={labelField}
          mode={mode}
          onChangeOuter={onChangeOuter}
          onConfirmSelectItem={onConfirmSelectItem}
          search={search}
          setSearchText={setSearchText}
          setSeedItem={setSeedItem}
          testID={testID}
          valueField={valueField}
          valueFieldKey={valueFieldKey}
        />
      )}
    />
  );
};
