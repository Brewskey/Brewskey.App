// @flow

import autobind from 'autobind-decorator';
import { ObservableMap, action, computed, observable } from 'mobx';

type $If<X, Then, Else = empty> = $Call<
  ((true, Then, Else) => Then) & ((false, Then, Else) => Else),
  X,
  Then,
  Else,
>;

export type PickerValue<TEntity, TMultiple> = $If<
  TMultiple,
  Array<TEntity>,
  ?TEntity,
>;

export type KeyExtractor<TEntity> = (item: TEntity) => string;

type PickerStoreProps<TEntity, TMultiple> = {|
  +initialValue: PickerValue<TEntity, TMultiple>,
  +keyExtractor?: KeyExtractor<TEntity>,
  +multiple: TMultiple,
  +onChange?: (value: PickerValue<TEntity, TMultiple>) => void,
|};

const defaultKeyExtractor = <TEntity>(item: TEntity): string => {
  const castedItem = (item: any);
  if (!castedItem.id) {
    throw new Error(
      'PickerStore: keyExtractorError, there is no id prop in item',
    );
  }
  return castedItem.id.toString();
};

class PickerStore<TEntity, TMultiple: any> {
  _keyExtractor: KeyExtractor<TEntity>;
  _onChange: ?(value: PickerValue<TEntity, TMultiple>) => void;
  _config: PickerStoreProps<TEntity, any>;

  // mobx doesn't support observable Set
  // this also can be done with ObservableArray instead ObservableMap
  // but I need keys for initialParams in forms in cases where initialValue
  // is ShortenedEntity
  @observable
  _valueByKey: ObservableMap<string, TEntity> = observable.map();

  constructor(config: PickerStoreProps<TEntity, TMultiple>) {
    this._config = config;
    this._onChange = config.onChange;
    this._keyExtractor = config.keyExtractor || defaultKeyExtractor;
    config.initialValue && this.setValue(config.initialValue);
  }

  @computed
  get value(): PickerValue<TEntity, TMultiple> {
    const values: Array<TEntity> = Array.from(this._valueByKey.toJS().values());
    if (this._config.multiple === true) {
      return values;
    }

    return (values[0]: any);
  }

  @autobind
  checkIsSelected(item: TEntity): boolean {
    return this._valueByKey.has(this._keyExtractor(item));
  }

  @autobind
  @action
  clear() {
    this._valueByKey.clear();
    this._onChange && this._onChange(this.value);
  }

  @autobind
  @action
  setValue(value: PickerValue<TEntity, TMultiple>) {
    let entries: Array<[string, TEntity]> = [];
    if (Array.isArray(value)) {
      entries = value.map((item) => [this._keyExtractor(item), item]);
    } else {
      entries = [[this._keyExtractor(value), value]];
    }

    this._valueByKey.replace(new ObservableMap(entries));
  }

  @autobind
  @action
  toggleItem(item: TEntity) {
    const itemKey = this._keyExtractor(item);

    if (this._valueByKey.has(itemKey)) {
      this._valueByKey.delete(itemKey);
    } else {
      !this._config.multiple && this._valueByKey.clear();
      this._valueByKey.set(itemKey, item);
    }

    this._onChange && this._onChange(this.value);
  }
}

export default PickerStore;
