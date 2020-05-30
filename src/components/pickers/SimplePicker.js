// @flow

import type { PickerValue } from '../../stores/PickerStore';
import type { RenderItemProps } from 'react-native/Libraries/Lists/VirtualizedList';

import * as React from 'react';
import { observer } from 'mobx-react';
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
  description?: React.Node,
  doesRequireConfirmation: boolean,
  error?: string,
  headerTitle: string,
  label: string,
  onChange: (value: TValue) => void,
  pickerValues: Array<SimplePickerValue<TValue>>,
  placeholder?: string,
  value: TValue,
|};

@observer
class SimplePicker<TValue> extends React.Component<Props<TValue>> {
  static defaultProps = {
    doesRequireConfirmation: true,
  };

  _pickerStore: PickerStore<SimplePickerValue<TValue>, false> = new PickerStore<
    SimplePickerValue<TValue>,
    false,
  >({
    initialValue: this.props.pickerValues.find(
      (pickerValue) => pickerValue.value === this.props.value,
    ),
    keyExtractor: (pickerValue) => (pickerValue.value: any).toString(),
    multiple: false,
    onChange: (pickerValue) => {
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

  _stringValueExtractor = (pickerValue: SimplePickerValue<TValue>): string =>
    pickerValue.label;

  _listKeyExtractor = (textPickerValue) =>
    JSON.stringify(textPickerValue.value) || '';

  _renderItem: (RenderItemProps<SimplePickerValue<TValue>>) => React.Node = ({
    item: pickerValue,
  }) => {
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

  render(): React.Node {
    const {
      description,
      doesRequireConfirmation,
      error,
      label,
      headerTitle,
      pickerValues,
      placeholder,
    } = this.props;
    const value = this._pickerStore.value;
    const { clear } = this._pickerStore;
    console.log(pickerValues);
    return (
      <Fragment>
        <PickerTextInput
          description={description}
          error={error}
          label={label}
          onPress={this._modalToggleStore.toggleOn}
          placeholder={placeholder}
          stringValueExtractor={this._stringValueExtractor}
          value={(value: any)}
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
