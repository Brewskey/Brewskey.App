import * as React from 'react';
import { useState, useMemo, useEffect } from 'react';
import type { ListRenderItemInfo } from 'react-native';

import List from '../../common/List';
import Container from '../../common/Container';
import Fragment from '../../common/Fragment';
import PickerTextInput from './PickerTextInput';
import Header from '../../common/Header';
import { HeaderIconButton } from '../../common/Header/HeaderIconButton';
import Modal from '../../components/modals/Modal';
import SelectableListItem from '../../common/SelectableListItem';
import PickerControl from './PickerControl';
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
}: Props<TValue>) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const context = useFormContext();
  
  // Get the current value - prefer propValue, fallback to form context
  const currentValue = propValue !== undefined ? propValue : (context ? (context.getValues() as Record<string, TValue>)[label] : undefined);
  
  const [selectedValue, setSelectedValue] = useState<SimplePickerValue<TValue> | null>(
    () => {
      if (currentValue === undefined || currentValue === null) return null;
      return pickerValues.find((pv) => JSON.stringify(pv.value) === JSON.stringify(currentValue)) || null;
    }
  );

  // Update selectedValue when currentValue changes
  useEffect(() => {
    if (currentValue === undefined || currentValue === null) {
      setSelectedValue(null);
      return;
    }
    const found = pickerValues.find(
      (pv) => JSON.stringify(pv.value) === JSON.stringify(currentValue)
    );
    setSelectedValue(found || null);
  }, [currentValue, pickerValues]);

  const stringValueExtractor = (
    pickerValue: SimplePickerValue<TValue>,
  ): string => pickerValue.label;

  const listKeyExtractor = (pickerValue: SimplePickerValue<TValue>) =>
    JSON.stringify(pickerValue.value) || '';

  const checkIsSelected = (pickerValue: SimplePickerValue<TValue>): boolean => {
    if (!selectedValue) return false;
    return JSON.stringify(selectedValue.value) === JSON.stringify(pickerValue.value);
  };

  const toggleItem = (pickerValue: SimplePickerValue<TValue>) => {
    if (checkIsSelected(pickerValue)) {
      setSelectedValue(null);
      onChange(undefined as TValue);
    } else {
      setSelectedValue(pickerValue);
      onChange(pickerValue.value);
      if (!doesRequireConfirmation) {
        setIsModalOpen(false);
      }
    }
  };

  const clear = () => {
    setSelectedValue(null);
    onChange(undefined as TValue);
  };

  const handleSelectPress = () => {
    setIsModalOpen(false);
  };

  const displayValue = selectedValue || currentValue;

  const renderItem: (
    arg1: ListRenderItemInfo<SimplePickerValue<TValue>>,
  ) => React.ReactElement = ({ item: pickerValue }) => {
    return (
      <SelectableListItem
        chevron={false}
        isSelected={checkIsSelected(pickerValue)}
        item={pickerValue}
        title={pickerValue.label}
        onPress={() => toggleItem(pickerValue)}
      />
    );
  };

  return (
    <Fragment>
      <PickerTextInput
        description={description}
        disabled={disabled}
        error={error}
        label={label}
        onPress={() => setIsModalOpen(true)}
        placeholder={placeholder}
        stringValueExtractor={stringValueExtractor}
        value={displayValue as SimplePickerValue<TValue> | null | undefined}
      />
      <Modal isVisible={isModalOpen} onHideModal={() => setIsModalOpen(false)}>
        <Container>
          <Header
            leftComponent={
              <HeaderIconButton
                name="arrow-back"
                onPress={() => setIsModalOpen(false)}
              />
            }
            title={headerTitle}
          />
          <List
            data={{ pages: [pickerValues], pageParams: [0] } as { pages: SimplePickerValue<TValue>[][]; pageParams: number[] }}
            extraData={selectedValue ? { value: JSON.stringify(selectedValue.value) } : undefined}
            keyExtractor={listKeyExtractor}
            renderItem={renderItem}
          />
          {!doesRequireConfirmation ? null : (
            <PickerControl
              onClearPress={clear}
              onSelectPress={handleSelectPress}
              value={displayValue}
            />
          )}
        </Container>
      </Modal>
    </Fragment>
  );
};
