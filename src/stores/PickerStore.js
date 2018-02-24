// @flow

import type { ObservableMap } from 'mobx';

import { action, computed, observable } from 'mobx';

export type PickerValue<TEntity> = ?TEntity | Array<TEntity>;

export type KeyExtractor<TEntity> = (item: TEntity) => void;

type PickerStoreProps<TEntity> = {
  initialValue: PickerValue<TEntity>,
  keyExtractor?: KeyExtractor<TEntity>,
  multiple?: boolean,
  onChange?: (value: PickerValue<TEntity>) => void,
};

const defaultKeyExtractor = <TEntity>(item: TEntity): string =>
  item.id.toString();

class PickerStore<TEntity> {
  _keyExtractor: KeyExtractor<TEntity>;
  _multiple: boolean = false;
  _onChange: ?(value: PickerValue<TEntity>) => void;

  // mobx doesn't support observable Set
  // this also can be done with ObservableArray instead ObservableMap
  // but I need keys for initialParams in forms in cases where initialValue
  // is ShortenedEntity
  @observable _valueByKey: ObservableMap<TEntity> = new Map();

  constructor({
    initialValue,
    keyExtractor = defaultKeyExtractor,
    multiple,
    onChange,
  }: PickerStoreProps<TEntity>) {
    this._multiple = multiple;
    this._onChange = onChange;
    this._keyExtractor = keyExtractor;
    initialValue && this.setValue(initialValue);
  }

  @computed
  get value(): PickerValue<TEntity> {
    if (this._multiple) {
      return this._valueByKey.values();
    }
    return this._valueByKey.size ? this._valueByKey.values()[0] : null;
  }

  checkIsSelected = (item: TEntity): boolean =>
    this._valueByKey.has(this._keyExtractor(item));

  @action clear = (): void => this._valueByKey.clear();

  @action
  setValue = (value: PickerValue<TEntity>) => {
    let entries;
    if (this._multiple) {
      entries = value.map((item: TEntity): [string, TEntity] => [
        this._keyExtractor(item),
        item,
      ]);
    } else {
      entries = value ? [[this._keyExtractor(value), value]] : [];
    }

    this._valueByKey.replace(entries);
  };

  @action
  toggleItem = (item: TEntity) => {
    const itemKey = this._keyExtractor(item);

    if (this._valueByKey.has(itemKey)) {
      this._valueByKey.delete(itemKey);
    } else {
      !this._multiple && this._valueByKey.clear();
      this._valueByKey.set(itemKey, item);
    }

    this._onChange && this._onChange(this.value);
  };
}

export default PickerStore;
