import { Controller, useFormContext } from 'react-hook-form';
import { Platform } from 'react-native';
import { Dropdown as RNEDropdown } from 'react-native-element-dropdown';
import nullthrows from 'nullthrows';

type DropdownProps<T> = React.ComponentProps<typeof RNEDropdown>;

export type DropdownInputProps<TValueType> = Omit<
  DropdownProps<TValueType>,
  'onChange'
> & {
  defaultValue?: TValueType;
  name: string;
  required?: boolean | string;
  onChange?: DropdownProps<TValueType>['onChange'];
  testID?: string;
};

const Dropdown = <TValueType,>(props: DropdownProps<TValueType> & { testID?: string }) => {
  if (Platform.OS === 'web') {
    const onChange: React.ChangeEventHandler<HTMLSelectElement> = (event) => {
      const foundItem = props.data.find(
        (item) =>
           
          (item[props.valueField] as unknown as any).toString() ===
          event.currentTarget.value,
      );
      props.onChange(foundItem!);
    };
    
    // For web, extract the value from the item if valueField is provided
    const selectValue = props.valueField && props.value != null && typeof props.value === 'object'
      ? (props.value as any)[props.valueField]?.toString()
      : props.value?.toString();
    
    return (
      <select onChange={onChange} value={selectValue} data-testid={props.testID}>
        {props.data.map((item) => {
           
          const value = (item[props.valueField] as unknown as any).toString();
          return (
            <option key={value} value={value}>
              {
                 
                (item[props.labelField] as unknown as any).toString()
              }
            </option>
          );
        })}
      </select>
    );
  }

  return <RNEDropdown {...props} />;
};

export const DropdownInput = <TValueType,>({
  defaultValue,
  name,
  required = false,
  onChange: onChangeOuter,
  valueField,
  testID,
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
        // If valueField is provided, extract the value from the item
        // Also handle the case where value might be a primitive (already extracted)
        // or an object (needs extraction)
        let displayValue: TValueType | undefined;
        if (valueField && value != null) {
          if (typeof value === 'object' && value !== null) {
            // Value is an object, extract the valueField
            displayValue = (value as any)[valueField];
          } else {
            // Value is already a primitive, find the matching item
            const matchingItem = props.data?.find(
              (item) => (item as any)[valueField] === value
            );
            displayValue = matchingItem as TValueType | undefined;
          }
        } else {
          displayValue = value;
        }

        return (
          <Dropdown<TValueType>
            {...props}
            valueField={valueField}
            value={displayValue}
            onBlur={onBlur}
            testID={testID}
            onChange={(item) => {
              // Extract the value if valueField is provided
              const valueToStore = valueField && item != null
                ? (item as any)[valueField]
                : item;
              onChange(valueToStore);
              onChangeOuter?.(item);
            }}
          />
        );
      }}
    />
  );
};
