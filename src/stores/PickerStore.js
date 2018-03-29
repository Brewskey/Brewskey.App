// @flow

import type { ObservableMap } from 'mobx';

import { action, computed, observable } from 'mobx';

export type PickerValue<TEntity> = ?TEntity | Array<TEntity>;

export type KeyExtractor<TEntity> = (item: TEntity) => string;

type PickerStoreProps<TEntity> = {
  initialValue: PickerValue<TEntity>,
  keyExtractor?: KeyExtractor<TEntity>,
  multiple?: boolean,
  onChange?: (value: PickerValue<TEntity>) => void,
};

const defaultKeyExtractor = <TEntity>(item: TEntity): string => {
  const castedItem = (item: any);
  if (!castedItem.id) {
    throw new Error(
      'PickerStore: keyExtractorError, there is no id prop in item',
    );
  }
  return castedItem.id.toString();
};

class PickerStore<TEntity> {
  _keyExtractor: KeyExtractor<TEntity>;
  _multiple: boolean = false;
  _onChange: ?(value: PickerValue<TEntity>) => void;

  // mobx doesn't support observable Set
  // this also can be done with ObservableArray instead ObservableMap
  // but I need keys for initialParams in forms in cases where initialValue
  // is ShortenedEntity
  @observable _valueByKey: ObservableMap<string, TEntity> = new Map();

  constructor({
    initialValue,
    keyExtractor = defaultKeyExtractor,
    multiple = false,
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
      return Array.from(this._valueByKey.toJS().values());
    }
    return this._valueByKey.size
      ? Array.from(this._valueByKey.toJS().values())[0]
      : null;
  }

  checkIsSelected = (item: TEntity): boolean =>
    this._valueByKey.has(this._keyExtractor(item));

  @action
  clear = (): void => {
    this._valueByKey.clear();
    this._onChange && this._onChange(this.value);
  };

  @action
  setValue = (value: PickerValue<TEntity>) => {
    let entries;
    if (Array.isArray(value)) {
      entries = value.map((item: TEntity): [string, TEntity] => [
        this._keyExtractor(item),
        item,
      ]);
    } else {
      entries = value ? [[this._keyExtractor(value), value]] : [];
    }

    this._valueByKey.replace((entries: any));
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
