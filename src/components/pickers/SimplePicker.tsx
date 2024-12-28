import * as React from 'react';
import ToggleStore from '../../stores/ToggleStore';
import List from '../../common/List';
import Container from '../../common/Container';
import Fragment from '../../common/Fragment';
import PickerTextInput from './PickerTextInput';
import Header from '../../common/Header';
import HeaderIconButton from '../../common/Header/HeaderIconButton';
import Modal from '../../components/modals/Modal';
import SelectableListItem from '../../common/SelectableListItem';
import PickerControl from './PickerControl';
import { useFormContext } from 'react-hook-form';
import { useState } from 'react';

export type SimplePickerValue<TValue> = {
  label: string;
  value: TValue;
};

type Props<TValue> = {
  description?: React.ReactNode;
  doesRequireConfirmation: boolean;
  error?: string;
  headerTitle: string;
  label: string;
  onChange: (value: TValue) => void;
  pickerValues: Array<SimplePickerValue<TValue>>;
  placeholder?: string;
  value: TValue;
};

export const SimplePicker = <TValue,>({
  description,
  doesRequireConfirmation,
  error,
  label,
  headerTitle,
  pickerValues,
  placeholder,
}: Props<TValue>) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const context = useFormContext();
  // _pickerStore: PickerStore<SimplePickerValue<TValue>, false> = new PickerStore<
  //   SimplePickerValue<TValue>,
  //   false
  // >({
  //   initialValue: this.props.pickerValues.find(
  //     (pickerValue) => pickerValue.value === this.props.value,
  //   ),
  //   keyExtractor: (pickerValue) => (pickerValue.value as any).toString(),
  //   multiple: false,
  //   onChange: (pickerValue) => {
  //     if (!pickerValue) {
  //       return;
  //     }

  //     this.props.onChange(pickerValue.value);
  //     if (!this.props.doesRequireConfirmation) {
  //       this._modalToggleStore.toggleOff();
  //     }
  //   },
  // });

  // _modalToggleStore: ToggleStore = new ToggleStore();

  const stringValueExtractor = (
    pickerValue: SimplePickerValue<TValue>,
  ): string => pickerValue.label;

  const listKeyExtractor = (textPickerValue) =>
    JSON.stringify(textPickerValue.value) || '';

  const renderItem: (
    arg1: RenderItemProps<SimplePickerValue<TValue>>,
  ) => React.ReactElement = ({ item: pickerValue }) => {
    return (
      <SelectableListItem
        chevron={false}
        isSelected={this._pickerStore.checkIsSelected(pickerValue)}
        item={pickerValue}
        title={pickerValue.label}
        onPress={this._pickerStore.toggleItem}
      />
    );
  };

  const value = context.getValues();
  return (
    <Fragment>
      <PickerTextInput
        description={description}
        error={error}
        label={label}
        onPress={() => setIsModalOpen(true)}
        placeholder={placeholder}
        stringValueExtractor={stringValueExtractor}
        value={value as any}
      />
      <Modal isVisible={isModalOpen} onHideModal={() => setIsModalOpen(true)}>
        <Container>
          <Header
            leftComponent={
              <HeaderIconButton
                name="arrow-back"
                onPress={() => setIsModalOpen(true)}
              />
            }
            title={headerTitle}
          />
          <List
            data={pickerValues}
            extraData={Array.isArray(value) ? value.length : value}
            keyExtractor={listKeyExtractor}
            renderItem={renderItem}
          />
          {!doesRequireConfirmation ? null : (
            <PickerControl
              onClearPress={clear}
              onSelectPress={this._modalToggleStore.toggleOff}
              value={value}
            />
          )}
        </Container>
      </Modal>
    </Fragment>
  );
};
