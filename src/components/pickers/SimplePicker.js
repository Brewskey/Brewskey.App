// @flow

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

type Props<TValue> = {|
  doesRequireConfirmation: boolean,
  error?: string,
  headerTitle: string,
  label: string,
  onChange: (value: TValue) => void,
  pickerValues: Array<SimplePickerValue<TValue>>,
  placeholder?: string,
  value: TValue,
|};

type SinglePicker = false;

@observer
class SimplePicker<TValue> extends React.Component<Props<TValue>> {
  static defaultProps = {
    doesRequireConfirmation: true,
  };

  _pickerStore: PickerStore<
    SimplePickerValue<TValue>,
    SinglePicker,
  > = new PickerStore({
    initialValue: this.props.pickerValues.find(
      pickerValue => pickerValue.value === this.props.value,
    ),
    keyExtractor: pickerValue => (pickerValue.value: any).toString(),
    multiple: (false: SinglePicker),
    onChange: (pickerValue: ?SimplePickerValue<TValue>) => {
      if (!pickerValue) {
        return;
      }

      this.props.onChange(pickerValue.value);
      if (!this.props.doesRequireConfirmation) {
        this._modalToggleStore.toggleOff();
      }
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
      doesRequireConfirmation,
      error,
      label,
      headerTitle,
      pickerValues,
      placeholder,
    } = this.props;
    const { clear, value } = this._pickerStore;

    return (
      <Fragment>
        <PickerTextInput
          error={error}
          label={label}
          multiple={false}
          onPress={this._modalToggleStore.toggleOn}
          placeholder={placeholder}
          stringValueExtractor={this._stringValueExtractor}
          value={value}
        />
        <Modal
          isVisible={this._modalToggleStore.isToggled}
          onHideModal={this._modalToggleStore.toggleOff}
        >
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
            {!doesRequireConfirmation ? null : (
              <PickerControl
                multiple={false}
                onClearPress={clear}
                onSelectPress={this._modalToggleStore.toggleOff}
                value={value}
              />
            )}
          </Container>
        </Modal>
      </Fragment>
    );
  }
}

export default SimplePicker;
