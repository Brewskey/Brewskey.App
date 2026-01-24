import * as React from 'react';
import { Controller, useFormContext } from 'react-hook-form';
import { Platform, View, Text, TouchableOpacity } from 'react-native';
import { Dropdown as RNEDropdown } from 'react-native-element-dropdown';
import { InfiniteData, UseInfiniteQueryResult } from '@tanstack/react-query';
import nullthrows from 'nullthrows';
import { COLORS } from '../../theme';
import { WebDropdown } from './WebDropdown';

type DropdownProps = React.ComponentProps<typeof RNEDropdown>;

export type DropdownInputProps<TValueType> = Omit<
  DropdownProps,
  'onChange' | 'data'
> & {
  // Form integration
  defaultValue?: TValueType | TValueType[];
  name: string;
  required?: boolean | string;
  onChange?: DropdownProps['onChange'];
  testID?: string;

  // Data source - either static array or async query
  data?: TValueType[];
  useQueryHook?: (options?: any) => UseInfiniteQueryResult<InfiniteData<TValueType[]>, Error>;
  queryOptions?: any;
  onSearchFilter?: (searchText: string, baseQueryOptions: any) => any;
  searchBy?: string;
  shouldUseSearchQuery?: boolean;

  // Multi-select support
  multiple?: boolean;

  // Modal mode
  mode?: 'default' | 'modal' | 'auto';
  headerTitle?: string;

  // Confirmation flow
  confirmSelectItem?: boolean;
  onConfirmSelectItem?: (item: TValueType | TValueType[]) => void;

  // Value normalization
  keyExtractor?: (item: TValueType) => string;

  // Styling variants
  inputVariant?: 'default' | 'picker'; // 'picker' for underline style
};

// Native dropdown wrapper
const Dropdown = <TValueType,>(props: DropdownProps & {
  testID?: string;
  multiple?: boolean;
  mode?: 'default' | 'modal' | 'auto';
  headerTitle?: string;
  confirmSelectItem?: boolean;
  onConfirmSelectItem?: (item: TValueType | TValueType[]) => void;
  useQueryHook?: (options?: any) => UseInfiniteQueryResult<InfiniteData<TValueType[]>, Error>;
  queryOptions?: any;
  onSearchFilter?: (searchText: string, baseQueryOptions: any) => any;
  searchBy?: string;
  shouldUseSearchQuery?: boolean;
  keyExtractor?: (item: TValueType) => string;
  inputVariant?: 'default' | 'picker';
}) => {
  if (Platform.OS === 'web') {
    return <WebDropdown {...props} />;
  }

  // For native, use react-native-element-dropdown
  // Add clear button support via renderRightIcon if value exists
  const nativeProps: any = { ...props };
  if (props.value != null && !props.renderRightIcon) {
    nativeProps.renderRightIcon = () => {
      if (props.value == null) return null;
      return (
        <TouchableOpacity
          onPress={(e: any) => {
            e.stopPropagation();
            props.onChange?.(props.multiple ? [] : null as any);
          }}
          style={{ padding: 8 }}
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
  testID,
  multiple = false,
  mode = 'default',
  headerTitle,
  confirmSelectItem = false,
  onConfirmSelectItem,
  useQueryHook,
  queryOptions,
  onSearchFilter,
  searchBy,
  shouldUseSearchQuery = false,
  keyExtractor,
  inputVariant = 'default',
  ...props
}: DropdownInputProps<TValueType>) => {
  const { control } = useFormContext();

  return (
    <Controller
      control={control}
      name={nullthrows(name, 'DropdownInput: name prop is required and must be a non-empty string')}
      defaultValue={defaultValue}
      rules={{ required }}
      render={({ field: { onChange, onBlur, value } }) => {
        // Normalize value for display - component will resolve primitives to objects internally
        const displayValue = multiple
          ? (Array.isArray(value) ? value : value != null ? [value] : [])
          : value;

        return (
          <View style={Platform.select({
            web: {
              overflow: 'visible',
              zIndex: 1,
            },
          })}>
            <Dropdown<TValueType>
              {...(props as any)}
              data={(props.data || []) as any[]}
              valueField={valueField}
              value={displayValue}
              onBlur={onBlur}
              testID={testID}
              multiple={multiple}
              mode={mode}
              headerTitle={headerTitle}
              confirmSelectItem={confirmSelectItem}
              onConfirmSelectItem={(item) => {
                onConfirmSelectItem?.(item);
                if (multiple) {
                  onChange(item as TValueType[]);
                } else {
                  onChange(item as TValueType);
                }
              }}
              useQueryHook={useQueryHook}
              queryOptions={queryOptions}
              onSearchFilter={onSearchFilter}
              searchBy={searchBy}
              shouldUseSearchQuery={shouldUseSearchQuery}
              keyExtractor={keyExtractor}
              inputVariant={inputVariant}
              onChange={(item) => {
                if (!confirmSelectItem) {
                  // Extract value to store: use valueField property if specified, otherwise store full item
                  const extractValue = (it: TValueType) => 
                    valueField && it != null ? (it as any)[valueField] : it;

                  if (multiple) {
                    const currentValues = Array.isArray(value) ? value : [];
                    const itemValue = extractValue(item);
                    const newValues = currentValues.includes(itemValue)
                      ? currentValues.filter((v) => v !== itemValue)
                      : [...currentValues, itemValue];
                    onChange(newValues as any);
                  } else {
                    onChange(extractValue(item));
                  }
                  onChangeOuter?.(item);
                }
              }}
            />
          </View>
        );
      }}
    />
  );
};
