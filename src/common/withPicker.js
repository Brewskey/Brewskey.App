// @flow

import type { KeyExtractor, PickerValue } from '../stores/PickerStore';

import * as React from 'react';
import PickerStore from '../stores/PickerStore';
import { observer } from 'mobx-react';
import hoistNonReactStatic from 'hoist-non-react-statics';

export type PickerProps<TEntity> = {
  checkIsSelected: (item: TEntity) => boolean,
  clear: () => void,
  stringValue: string,
  toggleItem: (item: TEntity) => void,
  value: PickerValue<TEntity>,
};

type Props<TEntity> = {
  keyExtractor?: KeyExtractor<TEntity>,
  multiple?: boolean,
  onChange?: (value: PickerValue<TEntity>) => void,
  value?: PickerValue<TEntity>,
};

const withPicker = <TEntity, TProps: Props<TEntity>>(
  Component: React.ComponentType<TProps>,
): React.ComponentType<TProps & PickerProps<TEntity>> => {
  @observer
  class WithPicker extends React.Component<TProps & PickerProps<TEntity>> {
    _pickerStore: PickerStore<TEntity> = new PickerStore({
      initialValue: this.props.value,
      keyExtractor: this.props.keyExtractor,
      multiple: this.props.multiple,
      onChange: this.props.onChange,
    });

    componentDidUpdate(prevProps: Props<TEntity>) {
      if (prevProps.value !== this.props.value) {
        this._pickerStore.setValue(this.props.value);
      }
    }

    render() {
      return (
        <Component
          {...this.props}
          checkIsSelected={this._pickerStore.checkIsSelected}
          clear={this._pickerStore.clear}
          toggleItem={this._pickerStore.toggleItem}
          value={this._pickerStore.value}
        />
      );
    }
  }

  hoistNonReactStatic(WithPicker, Component);
  return WithPicker;
};

export default withPicker;
