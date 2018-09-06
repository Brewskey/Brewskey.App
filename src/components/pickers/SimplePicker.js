// @flow

import type { PickerValue } from '../../stores/PickerStore';

import * as React from 'react';
import { observer } from 'mobx-react/native';
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
import PickerStore from '../../stores/PickerStore';

export type SimplePickerValue<TValue> = {| label: string, value: TValue |};

type Props<TValue> = {
  error?: string,
  headerTitle: string,
  label: string,
  multiple?: boolean,
  onChange: (value: PickerValue<TValue>) => void,
  pickerValues: Array<SimplePickerValue<TValue>>,
  placeholder?: string,
  value: PickerValue<TValue>,
};

@observer
class SimplePicker<TValue> extends React.Component<Props<TValue>, any> {
  _pickerStore: PickerStore<SimplePickerValue<TValue>> = new PickerStore({
    initialValue: this.props.pickerValues.find(
      pickerValue => pickerValue.value === this.props.value,
    ),
    keyExtractor: pickerValue => (pickerValue.value: any).toString(),
    multiple: this.props.multiple,
    onChange: (pickerValue: PickerValue<SimplePickerValue<TValue>>) => {
      const valueToSumbit = Array.isArray(pickerValue)
        ? pickerValue.map(simplePickerValue => simplePickerValue.value)
        : pickerValue && pickerValue.value;
      this.props.onChange(valueToSumbit);
    },
  });

  _modalToggleStore: ToggleStore = new ToggleStore();

  _stringValueExtractor = (pickerValue): string => pickerValue.label;

  _listKeyExtractor = textPickerValue => textPickerValue.value.toString();

  _renderItem = ({ item: pickerValue }) => (
    <SelectableListItem
      hideChevron
      isSelected={this._pickerStore.checkIsSelected(pickerValue)}
      item={pickerValue}
      title={pickerValue.label}
      toggleItem={this._pickerStore.toggleItem}
    />
  );

  render() {
    const {
      error,
      label,
      headerTitle,
      multiple,
      pickerValues,
      placeholder,
      ...rest
    } = this.props;
    const { clear, value } = this._pickerStore;

    return (
      <Fragment>
        <PickerTextInput
          {...rest}
          error={error}
          label={label}
          onPress={this._modalToggleStore.toggleOn}
          placeholder={placeholder}
          stringValueExtractor={this._stringValueExtractor}
          value={value}
        />
        <Modal isVisible={this._modalToggleStore.isToggled}>
          <Container>
            <Header
              leftComponent={
                <HeaderIconButton
                  name="arrow-back"
                  onPress={this._modalToggleStore.toggleOff}
                />
              }
              title={headerTitle}
            />
            <List
              data={pickerValues}
              extraData={Array.isArray(value) ? value.length : value}
              keyExtractor={this._listKeyExtractor}
              renderItem={this._renderItem}
            />
            <PickerControl
              multiple={multiple}
              onClearPress={clear}
              onSelectPress={this._modalToggleStore.toggleOff}
              value={value}
            />
          </Container>
        </Modal>
      </Fragment>
    );
  }
}

export default SimplePicker;
