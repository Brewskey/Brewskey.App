import * as React from 'react';
import { DropdownInput } from '../../common/form/DropdownInput';
import { useFormContext } from 'react-hook-form';

export type SimplePickerValue<TValue> = {
  label: string;
  value: TValue;
};

type Props<TValue> = {
  description?: React.ReactNode;
  disabled?: boolean;
  doesRequireConfirmation: boolean;
  error?: string;
  headerTitle: string;
  label: string;
  onChange: (value: TValue) => void;
  pickerValues: SimplePickerValue<TValue>[];
  placeholder?: string;
  value: TValue;
  // Form integration props
  name: string;
  defaultValue?: TValue;
  required?: boolean | string;
};

export const SimplePicker = <TValue,>({
  description,
  disabled,
  doesRequireConfirmation,
  error,
  label,
  headerTitle,
  pickerValues,
  placeholder,
  onChange,
  value: propValue,
  name = label.toLowerCase().replace(/\s+/g, '-'),
  defaultValue,
  required,
}: Props<TValue>) => {
  const context = useFormContext();
  
  // Get the current value - prefer propValue, fallback to form context
  const currentValue = propValue !== undefined 
    ? propValue 
    : (context ? (context.getValues() as Record<string, TValue>)[label] : undefined);

  // Find the selected item
  const selectedItem = React.useMemo(() => {
    if (currentValue === undefined || currentValue === null) return null;
    return pickerValues.find((pv) => JSON.stringify(pv.value) === JSON.stringify(currentValue)) || null;
  }, [currentValue, pickerValues]);

  const keyExtractor = React.useCallback((item: SimplePickerValue<TValue>) => {
    return JSON.stringify(item.value) || '';
  }, []);

  return (
    <DropdownInput<SimplePickerValue<TValue>>
      name={name}
      defaultValue={defaultValue !== undefined ? pickerValues.find(pv => JSON.stringify(pv.value) === JSON.stringify(defaultValue)) || undefined : undefined}
      required={required}
      data={pickerValues}
      labelField="label"
      valueField="value"
      multiple={false}
      headerTitle={headerTitle}
      confirmSelectItem={doesRequireConfirmation}
      inputVariant="picker"
      search={false}
      placeholder={placeholder}
      onChange={(item) => {
        // This will be called immediately if doesRequireConfirmation is false
        if (!doesRequireConfirmation && item && !Array.isArray(item)) {
          onChange((item as SimplePickerValue<TValue>).value);
        }
      }}
      onConfirmSelectItem={(item) => {
        // This will be called when confirm button is pressed
        if (doesRequireConfirmation && item && !Array.isArray(item)) {
          onChange((item as SimplePickerValue<TValue>).value);
        }
      }}
      keyExtractor={keyExtractor}
      disable={disabled}
      testID={`picker-${label?.toLowerCase().replace(/\s+/g, '-')}`}
    />
  );
};
